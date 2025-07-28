const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const auth = require('../../middleware/auth');          // JWT auth middleware
const { body } = require('express-validator');         // For input validation
const validateRequest = require('../../middleware/validateRequest'); // Custom validation error handler

// Registration route with validation
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
    // Add more validations as needed
  ],
  validateRequest,
  authController.register
);

// OTP Verification route with validation
router.post(
  '/verify-otp',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ],
  validateRequest,
  authController.verifyOtp
);

// Login route with validation
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  authController.login
);

// Forgot password route with validation
router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  validateRequest,
  authController.forgotPassword
);

router.post(
  '/resend-otp',
  [
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  validateRequest,
  authController.resendOtp
);

// Logout route - protected
router.post('/logout', auth, authController.logout);

module.exports = router;
