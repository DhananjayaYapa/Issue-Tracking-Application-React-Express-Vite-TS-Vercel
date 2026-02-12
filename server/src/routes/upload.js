const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');

router.post('/file', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Check if S3 upload (has key) or memory storage
    if (req.file.key) {
        res.json({ 
            key: req.file.key, 
            url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.key}` 
        });
    } else {
        res.status(503).json({ error: 'S3 storage not configured. File upload is unavailable.' });
    }
});

module.exports = router;