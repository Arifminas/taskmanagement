// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    body: { type: String, default: '' },
    type: { type: String, enum: ['task', 'report', 'system', 'chat'], default: 'system' },
    read: { type: Boolean, default: false },
    link: { type: String }, // route to open
    meta: { type: mongoose.Schema.Types.Mixed }, // optional extra payload
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
