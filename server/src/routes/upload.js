const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

router.post('/file', upload.single('file'), (req, res) => {
    res.json({ key: req.file.key, url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.key}` });
});

module.exports = router;