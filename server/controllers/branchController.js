const Branch = require('../models/Branch');

// Get all branches
exports.getBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    res.json({ success: true, data: branches });
  } catch (err) {
    console.error('Get branches error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single branch by ID
exports.getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    res.json({ success: true, data: branch });
  } catch (err) {
    console.error('Get branch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new branch
exports.createBranch = async (req, res) => {
  try {
    const { name, address, contactNumber } = req.body;
    const existing = await Branch.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Branch name already exists' });

    const branch = new Branch({ name, address, contactNumber });
    await branch.save();
    res.status(201).json({ success: true, data: branch });
  } catch (err) {
    console.error('Create branch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update branch
exports.updateBranch = async (req, res) => {
  try {
    const updates = req.body;
    const branch = await Branch.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    res.json({ success: true, data: branch });
  } catch (err) {
    console.error('Update branch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete branch
exports.deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    res.json({ success: true, message: 'Branch deleted' });
  } catch (err) {
    console.error('Delete branch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
