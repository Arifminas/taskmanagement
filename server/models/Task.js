const mongoose = require('mongoose');

const SubtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  progress: { type: Number, default: 0, min: 0, max: 100 }, // optional per subtask progress
});

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a task title'],
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'ongoing', 'completed'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  department: {
    type: mongoose.Schema.ObjectId,
    ref: 'Department',
    required: true,
  },
  assignees: [{
  type: mongoose.Schema.ObjectId,
  ref: 'User',
}],
  attachments: [
    {
      type: String, // URL or filepath
    },
  ],
  dueDate: {
    type: Date,
  },
  comments: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment',
    },
  ],
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  progress: { type: Number, default: 0, min: 0, max: 100 }, // Overall task progress 0-100
  subtasks: [SubtaskSchema], // Array of subtasks
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
