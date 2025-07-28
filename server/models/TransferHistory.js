const mongoose = require('mongoose');

const TransferHistorySchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.ObjectId,
    ref: 'Staff',
    required: true,
  },
  fromBranch: {
    type: mongoose.Schema.ObjectId,
    ref: 'Branch',
  },
  toBranch: {
    type: mongoose.Schema.ObjectId,
    ref: 'Branch',
    required: true,
  },
  transferDate: {
    type: Date,
    default: Date.now,
  },
  remarks: String,
});

module.exports = mongoose.model('TransferHistory', TransferHistorySchema);
