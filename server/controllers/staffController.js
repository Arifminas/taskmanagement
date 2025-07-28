const Staff = require('../models/Staff');

// Get all staff
exports.getStaff = async (req, res) => {
  try {
    const staff = await Staff.find()
      .populate('branch', 'name');
    res.json({ success: true, data: staff });
  } catch (err) {
    console.error('Get staff error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create staff
exports.createStaff = async (req, res) => {
  try {
    const newStaff = new Staff(req.body);
    await newStaff.save();
    res.status(201).json({ success: true, data: newStaff });
  } catch (err) {
    console.error('Create staff error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update staff
exports.updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json({ success: true, data: staff });
  } catch (err) {
    console.error('Update staff error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete staff
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json({ success: true, message: 'Staff deleted' });
  } catch (err) {
    console.error('Delete staff error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
