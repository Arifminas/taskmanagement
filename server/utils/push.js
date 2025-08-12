
const webPush = require('web-push');

const {
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY,
  VAPID_SUBJECT = 'mailto:arifavtest1@gmail.com',
} = process.env;

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

async function sendPush(subscription, payload) {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return; // silently skip in dev w/o keys
  try {
    await webPush.sendNotification(subscription, JSON.stringify(payload));
  } catch (err) {
    // 410 = gone — delete bad sub on your side
    if (err.statusCode === 410 || err.statusCode === 404) {
      const User = require('../models/User');
      await User.updateOne(
        { _id: payload.userId },
        { $pull: { pushSubscriptions: { endpoint: subscription.endpoint } } }
      );
    } else {
      console.error('WebPush error:', err.statusCode, err.body || err.message);
    }
  }
}

module.exports = { sendPush };
