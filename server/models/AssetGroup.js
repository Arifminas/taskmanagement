const mongoose = require('mongoose');

const AssetGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('AssetGroup', AssetGroupSchema);
