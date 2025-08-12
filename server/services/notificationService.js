// services/notificationService.js
const Notification = require('../models/Notification');

const createAndEmit = async (app, payload) => {
  const { user, ...data } = payload;

  // allow single user or array
  const userIds = Array.isArray(user) ? user : [user];
  const docs = await Notification.insertMany(
    userIds.map(u => ({ user: u, ...data }))
  );

  // emit per user
  const io = app.get('io');
  if (io) {
    docs.forEach(doc => {
      io.to(String(doc.user)).emit('notification:new', {
        _id: doc._id,
        title: doc.title,
        body: doc.body,
        type: doc.type,
        link: doc.link,
        meta: doc.meta,
        createdAt: doc.createdAt,
      });
    });
  }

  return docs;
};

module.exports = { createAndEmit };
