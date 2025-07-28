const TransferHistory = require('../models/TransferHistory');
const Staff = require('../models/Staff');

// Get all transfer history records
exports.getTransfers = async (req, res) => {
  try {
    const transfers = await TransferHistory.find()
      .populate('staff', 'name')
      .populate('fromBranch', 'name')
      .populate('toBranch', 'name')
      .sort({ transferDate: -1 });
    res.json({ success: true, data: transfers });
  } catch (err) {
    console.error('Get transfers error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new transfer record and update staff branch
exports.createTransfer = async (req, res) => {
  try {
    const { staffId, fromBranchId, toBranchId, remarks } = req.body;

    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    // Create transfer history
    const transfer = new TransferHistory({
      staff: staffId,
      fromBranch: fromBranchId || staff.branch,
      toBranch: toBranchId,
      remarks,
      transferDate: new Date(),
    });
    await transfer.save();

    // Update staff branch
    staff.branch = toBranchId;
    await staff.save();

    res.status(201).json({ success: true, data: transfer });
  } catch (err) {
    console.error('Create transfer error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
