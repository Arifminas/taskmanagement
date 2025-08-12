// utils/notify.js
const { sendPush } = require('./push');
const User = require('../models/User');
const Notification = require('../models/Notification'); // ✅ missing import

async function notifyUser({ app, userId, title, message, type = 'system', link, meta }) {
  // 1) Persist
  const doc = await Notification.create({
    user: userId,
    title,
    message,
    type,
    link,
    meta,
  });

  // 2) Realtime
  try {
    const io = app.get('io');
    if (io) io.to(userId.toString()).emit('notification:new', doc.toObject()); // ✅ single event name
  } catch (e) {
    console.error('Socket emit failed', e);
  }

  // 3) Web Push
  try {
    const user = await User.findById(userId).lean();
    if (!user?.pushSubscriptions?.length) return doc;

    const payload = {
      title: doc.title || 'Notification',
      body: doc.message || '',
      data: { link: doc.link || '/', notificationId: doc._id.toString() },
      icon: '/icons/icon-192.png',
      badge: '/icons/badge.png',
      userId: userId.toString(),
    };

    await Promise.all(user.pushSubscriptions.map((sub) => sendPush(sub, payload)));
  } catch (e) {
    console.error('Push error:', e.message);
  }

  return doc;
}

module.exports = { notifyUser };
