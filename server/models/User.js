const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 20
  },
  avatar: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['online', 'away', 'offline'],
    default: 'online'
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  socketId: {
    type: String,
    default: ''
  },
  notificationSettings: {
    sounds: { type: Boolean, default: true },
    browserAlerts: { type: Boolean, default: true },
    showTyping: { type: Boolean, default: true }
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for user's active rooms
userSchema.virtual('activeRooms', {
  ref: 'Room',
  localField: '_id',
  foreignField: 'users'
});

module.exports = mongoose.model('User', userSchema);