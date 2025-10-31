const User = require('../models/User');

const joinChat = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || username.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 2 characters long'
      });
    }

    // Check if username is taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken'
      });
    }

    // Create new user
    const user = new User({
      username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      status: 'online'
    });

    await user.save();

    res.status(200).json({
      success: true,
      user: user.toObject()
    });

  } catch (error) {
    console.error('Join chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-__v');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.params.userId;

    const user = await User.findByIdAndUpdate(
      userId,
      { status, lastActive: new Date() },
      { new: true }
    ).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  joinChat,
  getUserProfile,
  updateUserStatus
};