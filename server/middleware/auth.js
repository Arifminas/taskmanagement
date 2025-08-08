// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Exact public paths (no auth required)
const PUBLIC_PATHS = [
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/verify-otp',
  '/api/v1/departments/public',
];

// Public prefixes (anything under these is public)
const PUBLIC_PREFIXES = [
  // add more if you expose docs/health etc.
  // '/api/v1/health',
  // '/api/v1/docs',
];

function normalizeUrl(u = '') {
  // strip query, collapse duplicate slashes
  const noQuery = u.split('?')[0] || '';
  return noQuery.replace(/\/{2,}/g, '/');
}

function isPublic(url) {
  if (!url) return false;
  const path = normalizeUrl(url);
  if (PUBLIC_PATHS.includes(path)) return true;
  return PUBLIC_PREFIXES.some((p) => path.startsWith(p));
}

const auth = async (req, res, next) => {
  try {
    // Allow CORS preflight
    if (req.method === 'OPTIONS') return next();

    const url = req.originalUrl || req.url || '';
    if (isPublic(url)) return next(); // ⬅️ bypass auth for public endpoints

    // Extract token
    let token;
    const authHeader = req.headers.authorization || '';
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    }
    // If you later store token in cookies, you can also check:
    // if (!token && req.cookies?.token) token = req.cookies.token;

    if (!token) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Auth middleware: Token missing for', req.method, normalizeUrl(url));
      }
      return res.status(401).json({ message: 'Not authorized, token missing' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Auth middleware: Invalid token payload for', normalizeUrl(url));
      }
      return res.status(401).json({ message: 'Not authorized, token invalid payload' });
    }

    // Fetch user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Auth middleware: User not found for id', decoded.id);
      }
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach to req
    req.user = {
      _id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
      department: user.department,
    };

    next();
  } catch (err) {
    console.error('Auth middleware error on', req.method, normalizeUrl(req.originalUrl || req.url), err);

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
