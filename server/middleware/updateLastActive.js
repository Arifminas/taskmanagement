// middleware/updateLastActive.js

const User = require('../models/User');

const updateLastActive = async (req, res, next) => {
  if (req.user) {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        lastActive: new Date(),
        isOnline: true,
      });
    } catch (err) {
      console.error('Failed to update lastActive:', err);
    }
  }
  next();
};

module.exports = updateLastActive;
