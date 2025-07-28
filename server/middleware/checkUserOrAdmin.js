const User = require('../models/User');
   
module.exports = (req, res, next) => {
  const { user } = req; // from auth middleware
  const userIdParam = req.params.id; // ID from URL

  if (user.role === 'admin' || user._id.toString() === userIdParam) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Not authorized to update this user' });
};