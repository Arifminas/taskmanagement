// controllers/notificationController.js
const Notification = require('../models/Notification');
const User = require('../models/User');
const { notifyUser } = require('../utils/notify');

exports.create = async (req, res) => {
  try {
    const { user, title, message, body = '', type = 'system', link, meta = {} } = req.body;

    if (!user || !title || !message) {
      return res.status(400).json({ success: false, message: 'user, title, message are required' });
    }

    const doc = await Notification.create({ user, title, message, body, type, link, meta, read: false });

    // fan out (socket + push)
    await notifyUser({ app: req.app, userId: user, notification: doc.toObject() });

    res.status(201).json({ success: true, data: doc });
  } catch (e) {
    console.error('Create notification error:', e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.list = async (req, res) => {
  try {
    const { unread } = req.query;
    const filter = { user: req.user._id };
    if (unread === '1') filter.read = false;

    const items = await Notification.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: items });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

exports.markRead = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: { read: true } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: doc });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error updating notification' });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { $set: { read: true } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error updating all notifications' });
  }
};

// Save push subscription for current user
exports.subscribe = async (req, res) => {
  try {
    const sub = req.body; // { endpoint, keys: {p256dh, auth}}
    if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
      return res.status(400).json({ success: false, message: 'Invalid subscription' });
    }
    await User.updateOne(
      { _id: req.user._id },
      { $addToSet: { pushSubscriptions: sub } }
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to save subscription' });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) return res.status(400).json({ success: false, message: 'endpoint required' });

    await User.updateOne(
      { _id: req.user._id },
      { $pull: { pushSubscriptions: { endpoint } } }
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to unsubscribe' });
  }
};
