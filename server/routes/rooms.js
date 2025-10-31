const express = require('express');
const { createRoom, getPublicRooms, getRoomMessages, joinRoom } = require('../controllers/roomController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Public (would be private with auth)
router.post('/', createRoom);

// @desc    Get all public rooms
// @route   GET /api/rooms
// @access  Public
router.get('/', getPublicRooms);

// @desc    Get room messages with pagination
// @route   GET /api/rooms/:roomId/messages
// @access  Public
router.get('/:roomId/messages', getRoomMessages);

// @desc    Join a room
// @route   POST /api/rooms/:roomId/join
// @access  Public
router.post('/:roomId/join', joinRoom);

module.exports = router;