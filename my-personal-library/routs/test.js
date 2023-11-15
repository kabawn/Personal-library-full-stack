const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// POST endpoint for file upload
router.post('/upload', (req, res, next) => {
  // Create an instance of the Formidable form object
  const form = new formidable.IncomingForm();
  // Set options, like the upload directory
  console.log('__dirname:', __dirname);
console.log('uploads path:', '../uploads');
console.log('file.name:', file.name);
  form.uploadDir = path.join(__dirname, '/app/uploads');
  form.keepExtensions = true; // Include the original file extensions

  // Parse the incoming form fields and files
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error parsing the files', err);
      return res.status(500).json({ error: 'There was an error parsing the files' });
    }
    console.log('Parsed files:', files);

    // `file` is the name of the <input> field of type `file`
    const file = files.file;

    // Construct the new path for the file
    const oldPath = file.path;
    const newPath = path.join(__dirname, '/app/uploads', file.name);

    // Move the file from the temporary directory to the target directory
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        // Handle file move errors
        return res.status(500).json({ error: err.message });
      }
      // Send the file path as a response
      res.json({ message: 'File uploaded successfully', filePath: `/uploads/${file.name}` });
    });
  });
});

module.exports = router;
