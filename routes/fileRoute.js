// Import required modules
const router = require('express').Router(); // Express router module
const multer = require('multer'); // Multer module for file upload
const path = require('path'); // Path module for file path manipulation
const File = require('../models/schema'); // Importing file schema model
const { v4: uuidv4 } = require('uuid'); // UUID module for generating unique IDs
const sendMail = require('../services/emailService'); // Importing email service

// Set up multer disk storage configuration
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/') // Set the destination directory for file uploads
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`; // Generate a unique filename for each file
        cb(null, uniqueName) // Set the filename for the uploaded file
    },
})

// Set up multer configuration
let upload = multer({
    storage, // Use the configured storage
    limit: {
        fileSize: 1000000 * 100 // Set the maximum file size limit to 100MB
    }
}).single('myfile') // Set the field name for the file upload

// Handle POST request to '/'
router.post('/', (req, res) => {

    // Store the file
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).send({ error: err.message }) // If there is an error during file upload, send an error response
        }

        // Store the file in the database
        const file = new File({
            filename: req.file.filename, // Get the filename of the uploaded file
            uuid: uuidv4(), // Generate a unique ID for the file
            path: req.file.path, // Get the path of the uploaded file
            size: req.file.size, // Get the size of the uploaded file
        });

        const response = await file.save(); // Save the file in the database

        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` }) // Send a JSON response with the file URL

    })
})


router.post('/send', async (req, res) => {

    const { uuid, emailTo, emailFrom } = req.body;

    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: "All fields are required" });
    }

    const file = await File.findOne({ uuid: uuid });
    if (!file) {
        return res.status(422).send({ error: "File not found" });
    }

    if (file.sender) {
        return res.status(422).send({ error: "Email already sent" });
    }

    file.sender = emailFrom;
    file.receiver = emailTo;

    const response = await file.save();

    // Send email
    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: "File Sharing",
        text: `${emailFrom} shared a file with you`,
        html: require('../services/emailTemplate')({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
            size: parseInt(file.size / 1000) + 'KB',
            expires: '24 hours'
        })
    })

    return res.send({ success: true })
})

module.exports = router // Export the router module for use in other files