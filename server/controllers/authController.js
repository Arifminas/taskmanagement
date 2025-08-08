const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail'); // your email helper
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const Department = require('../models/Department');


exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (!department) {
      return res.status(400).json({ message: 'Department is required' });
    }

    // department might be an id string, a name string, or an object { _id, name }
    const deptValue =
      typeof department === 'object'
        ? (department._id || department.name || '').toString()
        : department.toString();

    let departmentDoc = null;

    // If it looks like a valid ObjectId, try by id first
    if (mongoose.Types.ObjectId.isValid(deptValue)) {
      departmentDoc = await Department.findById(deptValue);
    }

    // Otherwise, try exact name, then case-insensitive name
    if (!departmentDoc) {
      const trimmed = deptValue.trim();
      departmentDoc =
        (await Department.findOne({ name: trimmed })) ||
        (await Department.findOne({
          name: { $regex: `^${trimmed}$`, $options: 'i' },
        }));
    }

    if (!departmentDoc) {
      return res.status(400).json({ message: 'Invalid department' });
    }
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Generate OTP and expiry (10 mins)
    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    // Create new user with OTP & unverified status
    user = new User({
      name,
      email,
      password,
      role,
      department: departmentDoc._id, // Use ObjectId here
      verificationOTP: otp,
      verificationOTPExpires: otpExpiry,
      isVerified: false,
    });

    await user.save();

    // Send OTP email
    await sendEmail({
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });

    // Generate JWT token
    const token = user.getSignedJwtToken();

    // Calculate cookie expiration from env or default 1 hour
    const cookieExpireMs = process.env.JWT_COOKIE_EXPIRE
      ? parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
      : 3600000;

    // Set JWT token as secure httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: cookieExpireMs,
    });

    // Return success message **and token details**
    res.status(201).json({
      success: true,
      token,
      expiresIn: cookieExpireMs,
      message: 'User registered successfully. Please verify your email using the OTP sent.',
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const generateTempPassword = () => crypto.randomBytes(4).toString('hex');

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
     if (!email) return res.status(400).json({ message: 'Email is required' });

    const tempPassword = generateTempPassword();
    const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

    user.password = hashedTempPassword;
    await user.save();

    await sendEmail({
      to: email,
      subject: 'Temporary Password',
      text: `Your temporary password is: ${tempPassword}. Please login and change your password immediately.`,
    });

    res.json({ success: true, message: 'Temporary password sent to email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    if (user.verificationOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.verificationOTPExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    user.isVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpires = undefined;

    await user.save();

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Please provide email and password' });

    // Find user with password field (assuming password select is false by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token using model method (which now includes role)
    const token = user.getSignedJwtToken();
// After successful login
await User.findByIdAndUpdate(user._id, {
  isOnline: true,
  lastLogin: new Date(),
});

    // Send login notification asynchronously
    sendEmail({
      to: user.email,
      subject: 'Login Notification',
      text: `Hi ${user.name}, you logged in on ${new Date().toLocaleString()}`,
    }).catch(err => {
      console.error('Failed to send login notification email:', err);
    });

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      isVerified: user.isVerified,
    };

    res.json({
      success: true,
      token,
      user: userData,
      message: 'Logged in successfully',
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.logout = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });
    if (req.user && req.user._id) {
      await User.findByIdAndUpdate(req.user._id, {
        isOnline: false,
      });
    }

    // Send logout notification email
    if (req.user) {
      await sendEmail({
        to: req.user.email,
        subject: 'Logout Notification',
        text: `Hello ${req.user.name},\nYou have successfully logged out on ${new Date().toLocaleString()}.`,
      });
    }

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.verificationOTP = otp;
    user.verificationOTPExpires = otpExpiry;
    await user.save();

    await sendEmail({
      to: email,
      subject: 'Your new OTP Code',
      text: `Your new verification OTP is ${otp}. It expires in 10 minutes.`,
    });

    res.json({ success: true, message: 'OTP resent successfully' });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

