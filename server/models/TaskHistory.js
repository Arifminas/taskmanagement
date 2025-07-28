const mongoose = require('mongoose');

const TaskHistorySchema = new mongoose.Schema({
  task: { type: mongoose.Schema.ObjectId, ref: 'Task', required: true },
  action: { type: String, required: true }, // e.g., "Status changed", "Comment added"
  oldValue: String,
  newValue: String,
  performedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  details: { type: String }
});

module.exports = mongoose.model('TaskHistory', TaskHistorySchema);
