const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.log('Auth middleware: Token missing');
      return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware: Decoded token payload:', decoded);

    if (!decoded || !decoded.id) {
      console.log('Auth middleware: Invalid token payload');
      return res.status(401).json({ message: 'Not authorized, token invalid payload' });
    }

    // Fetch user from DB
    const user = await User.findById(decoded.id).select('-password');
    console.log('Auth middleware: User fetched from DB:', user);

    if (!user) {
      console.log('Auth middleware: User not found in DB');
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user info to request object
    req.user = {
      _id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
      department: user.department, 
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token invalid' });
    }

    return res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = auth;

