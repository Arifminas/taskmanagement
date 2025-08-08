const { model } = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('department', 'name');
    res.json({ success: true, data: users });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('department', 'name');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ success: true, data: user });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create user (Admin only)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const user = new User({ name, email, password, role, department });
    await user.save();

    res.status(201).json({ success: true, data: user });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user (Admin only)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Authorization: only admin or user himself
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    const { password, ...updates } = req.body;

    const user = await User.findById(userId).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent email change unless admin
    if (updates.email && req.user.role !== 'admin') {
      delete updates.email;
    }

    // Assign non-password fields
    Object.assign(user, updates);

    // Handle password update and hashing if provided
    if (password) {
      user.password = password; // will hash on save
    }

    await user.save();

    user.password = undefined; // remove password from response
    res.json({ success: true, data: user });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete users' });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// Update current user's profile


// GET /api/v1/users/me
exports.getCurrentUser = async (req, res) => {
  try {
    console.log('getCurrentUser: req.user =', req.user);
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('department', 'name'); // optional
    console.log('getCurrentUser: fetched user =', user);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    console.error('❌ getCurrentUser error stack:', err);
    return res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack.split('\n').slice(0,3)
    });
  }
};

// PUT /api/v1/users/me
exports.updateCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { currentPassword, newPassword, ...updates } = req.body;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required' });
      }
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }
      user.password = newPassword;
    }

    Object.assign(user, updates);
    await user.save();
    user.password = undefined;

    res.json({ success: true, data: user });
  } catch (err) {
    console.error('❌ updateCurrentUser error stack:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};