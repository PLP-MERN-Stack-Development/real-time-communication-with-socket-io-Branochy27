const Message = require('../models/Message');
const Room = require('../models/Room');

const searchMessages = async (req, res) => {
  try {
    const { query, roomId, page = 1, limit = 20 } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchCriteria = {
      content: { $regex: query, $options: 'i' },
      type: 'text' // Only search text messages
    };

    if (roomId) {
      searchCriteria.room = roomId;
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find(searchCriteria)
      .populate('user', 'username avatar')
      .populate('room', 'name displayName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalResults = await Message.countDocuments(searchCriteria);

    res.status(200).json({
      success: true,
      results: messages,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(totalResults / limit),
        total: totalResults,
        hasMore: skip + messages.length < totalResults
      }
    });

  } catch (error) {
    console.error('Search messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching messages'
    });
  }
};

const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Add user to readBy array if not already there
    if (!message.readBy.includes(userId)) {
      message.readBy.push(userId);
      await message.save();
    }

    res.status(200).json({
      success: true,
      message: 'Message marked as read'
    });

  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { reaction } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Find existing reaction for this emoji
    const existingReaction = message.reactions.find(r => r.emoji === reaction);
    
    if (existingReaction) {
      // Toggle user in reaction
      const userIndex = existingReaction.users.indexOf(userId);
      if (userIndex > -1) {
        // Remove reaction
        existingReaction.users.splice(userIndex, 1);
        // Remove reaction if no users left
        if (existingReaction.users.length === 0) {
          message.reactions = message.reactions.filter(r => r.emoji !== reaction);
        }
      } else {
        // Add reaction
        existingReaction.users.push(userId);
      }
    } else {
      // Create new reaction
      message.reactions.push({
        emoji: reaction,
        users: [userId]
      });
    }

    await message.save();
    await message.populate('user', 'username avatar');
    await message.populate('reactions.users', 'username');

    res.status(200).json({
      success: true,
      message: message.toObject()
    });

  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding reaction'
    });
  }
};

module.exports = {
  searchMessages,
  markMessageAsRead,
  addReaction
};