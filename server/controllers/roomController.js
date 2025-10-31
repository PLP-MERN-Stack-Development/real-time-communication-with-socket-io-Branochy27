const Room = require('../models/Room');
const Message = require('../models/Message');

const createRoom = async (req, res) => {
  try {
    const { name, displayName, description, isPrivate } = req.body;
    const userId = req.user._id; // From auth middleware

    if (!name || !displayName) {
      return res.status(400).json({
        success: false,
        message: 'Room name and display name are required'
      });
    }

    // Check if room already exists
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: 'Room with this name already exists'
      });
    }

    // Create new room
    const room = new Room({
      name,
      displayName,
      description: description || '',
      isPrivate: isPrivate || false,
      createdBy: userId,
      users: [userId]
    });

    await room.save();
    await room.populate('createdBy', 'username');

    res.status(201).json({
      success: true,
      room: room.toObject()
    });

  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating room'
    });
  }
};

const getPublicRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isPrivate: false })
      .populate('createdBy', 'username')
      .populate('users', 'username avatar status')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      rooms,
      count: rooms.length
    });

  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching rooms'
    });
  }
};

const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find({ room: roomId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalMessages = await Message.countDocuments({ room: roomId });

    res.status(200).json({
      success: true,
      messages: messages.reverse(), // Return oldest first for proper display
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(totalMessages / limit),
        total: totalMessages,
        hasMore: skip + messages.length < totalMessages
      }
    });

  } catch (error) {
    console.error('Get room messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching messages'
    });
  }
};

const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Add user to room if not already a member
    if (!room.users.includes(userId)) {
      room.users.push(userId);
      await room.save();
    }

    await room.populate('users', 'username avatar status');
    await room.populate('createdBy', 'username');

    res.status(200).json({
      success: true,
      room: room.toObject(),
      message: 'Successfully joined room'
    });

  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while joining room'
    });
  }
};

module.exports = {
  createRoom,
  getPublicRooms,
  getRoomMessages,
  joinRoom
};