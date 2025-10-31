const express = require('express');
const { joinChat, getUserProfile, updateUserStatus } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Join chat (authenticate user)
// @route   POST /api/auth/join
// @access  Public
router.post('/join', joinChat);

// @desc    Get user profile
// @route   GET /api/auth/profile/:userId
// @access  Public
router.get('/profile/:userId', getUserProfile);

// @desc    Update user status
// @route   PUT /api/auth/status/:userId
// @access  Public
router.put('/status/:userId', updateUserStatus);

module.exports = router;