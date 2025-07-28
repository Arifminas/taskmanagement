const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  branch: {
    type: mongoose.Schema.ObjectId,
    ref: 'Branch',
  },
  assignedAssets: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Asset',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Staff', StaffSchema);
