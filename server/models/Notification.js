const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['task', 'report', 'system', 'chat'], default: 'system' },
    isRead: { type: Boolean, default: false },
    link: { type: String }, // optional route to redirect
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
