const router = require('express').Router(); // Importing the Express Router
const File = require('../models/schema'); // Importing the 'schema' module from the '../models' directory

// GET request handler for '/:uuid' route
router.get('/:uuid', async (req, res) => {
    // Find the file with the given 'uuid' parameter in the database
    const file = await File.findOne({ uuid: req.params.uuid });

    // If no file is found, render a download page with an error message
    if (!file) {
        return res.render('download', { error: 'Link has been expired.' });
    }

    // Save the file in the database
    const response = await file.save();

    // Construct the file path using the current directory and the file's 'path' property
    const filePath = `${__dirname}/../${file.path}`;

    // Log the file path to the console
    console.log(filePath);

    // Download the file with the given file path
    res.download(filePath);
});

// Export the router
module.exports = router;