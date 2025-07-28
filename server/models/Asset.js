const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  serialNumber: {
    type: String,
    unique: true,
  },
  description: String,
  group: {
    type: mongoose.Schema.ObjectId,
    ref: 'AssetGroup',
  },
  purchaseDate: Date,
  expiryDate: Date,
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Staff',
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'maintenance', 'retired'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Asset', AssetSchema);
