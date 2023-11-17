// Import necessary modules
const router = require("express").Router(); // Importing Router module from express
const File = require("../models/schema"); // Importing File model from ../models/schema

// Define a GET route with a dynamic parameter :uuid
router.get("/:uuid", async (req, res) => {
    try {
        // Find a file in the database with the given uuid
        const file = await File.findOne({ uuid: req.params.uuid });

        // If no file is found, render the download.ejs template with an error message
        if (!file) {
            res.render("download.ejs", {
                error: "Link has been expired!"
            });
        }

        // If a file is found, render the download.ejs template with the file details
        return res.render("download.ejs", {
            uuid: file.uuid,
            fileName: file.filename,
            fileSize: file.size,
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
        });

    } catch (error) {
        // If an error occurs, render the download.ejs template with an error message
        return res.render("download.ejs", {
            error: "Something went wrong!"
        });
    }
});

// Export the router module
module.exports = router;