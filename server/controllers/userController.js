const User = require('../models/User');

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
const bcrypt = require('bcryptjs');


exports.updateCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword, ...updates } = req.body;

    const user = await User.findById(userId).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to change password' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      user.password = newPassword; // will hash on save
    }

    Object.assign(user, updates);

    await user.save();

    user.password = undefined;
    res.json({ success: true, data: user });
  } catch (err) {
    console.error('Update current user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

