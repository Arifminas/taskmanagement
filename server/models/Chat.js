const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  department: {  // For department chats, optional for public
    type: mongoose.Schema.ObjectId,
    ref: 'Department',
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
},{ timestamps: true } );

ChatSchema.index({ isPublic: 1, createdAt: 1 });
ChatSchema.index({ department: 1, createdAt: 1 });

module.exports = mongoose.model('Chat', ChatSchema);
