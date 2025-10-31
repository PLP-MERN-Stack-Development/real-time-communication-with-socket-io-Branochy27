const express = require('express');
const { uploadFile, deleteFile } = require('../controllers/uploadController');
const upload = require('../config/upload');

const router = express.Router();

// @desc    Upload file
// @route   POST /api/upload
// @access  Public
router.post('/', upload.single('file'), uploadFile);

// @desc    Delete file
// @route   DELETE /api/upload/:filename
// @access  Public
router.delete('/:filename', deleteFile);

module.exports = router;