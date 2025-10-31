const mongoose = require('mongoose');

const privateMessageSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  delivered: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
privateMessageSchema.index({ from: 1, to: 1, createdAt: -1 });
privateMessageSchema.index({ to: 1, read: 1 });

module.exports = mongoose.model('PrivateMessage', privateMessageSchema);