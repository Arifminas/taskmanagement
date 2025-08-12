const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.ObjectId,
    ref: 'Task',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
  },
   parentComment: { type: mongoose.Schema.ObjectId, ref: 'Comment', default: null }, // For replies
  createdAt: {
    type: Date,
    default: Date.now,
  },
   attachments: [{ type: String }],
   statusChange: { type: String, enum: ['pending', 'ongoing', 'completed', null], default: null },
},{ timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
