const express = require('express');
const { searchMessages, markMessageAsRead, addReaction } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Search messages
// @route   GET /api/messages/search
// @access  Public
router.get('/search', searchMessages);

// @desc    Mark message as read
// @route   PUT /api/messages/:messageId/read
// @access  Public
router.put('/:messageId/read', markMessageAsRead);

// @desc    Add reaction to message
// @route   POST /api/messages/:messageId/reaction
// @access  Public
router.post('/:messageId/reaction', addReaction);

module.exports = router;