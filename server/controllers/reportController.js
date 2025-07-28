const Task = require('../models/Task');
const mongoose = require('mongoose');

// Utility to parse date range from query (daily, weekly, monthly or custom)
const getDateRange = (period) => {
  const now = new Date();
  let fromDate;

  switch (period) {
    case 'daily':
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'weekly':
      // Last 7 days
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
      break;
    case 'monthly':
      // Start of month
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    default:
      fromDate = null;
  }
  return { fromDate, toDate: now };
};

// Main report function
exports.getReport = async (req, res) => {
  try {
    const user = req.user;
    const { period = 'monthly', departmentId, userId } = req.query;

    // Date filter
    const { fromDate, toDate } = getDateRange(period);

    let match = {};

    // Apply date filtering if available
    if (fromDate && toDate) {
      match.createdAt = { $gte: fromDate, $lte: toDate };
    }

    // Role-based filtering
    if (user.role === 'coordinator') {
      // Coordinator sees only their departments tasks
      // Assuming req.user.department contains assigned departments (array or single)
      // Adjust if multiple departments per coordinator
      if (user.department) {
        match.department = mongoose.Types.ObjectId(user.department);
      }
    } else if (user.role === 'user') {
      // User sees only own tasks
      match.assignee = user._id;
    } else if (user.role === 'admin') {
      // Admin can filter by departmentId or userId if provided
      if (departmentId) match.department = mongoose.Types.ObjectId(departmentId);
      if (userId) match.assignee = mongoose.Types.ObjectId(userId);
    }

    // Aggregate report: group by status, department, and user
    const report = await Task.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'departments',
          localField: 'department',
          foreignField: '_id',
          as: 'departmentInfo',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assignee',
          foreignField: '_id',
          as: 'assigneeInfo',
        },
      },
      {
        $unwind: { path: '$departmentInfo', preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: '$assigneeInfo', preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: {
            status: '$status',
            department: '$departmentInfo.name',
            assignee: '$assigneeInfo.name',
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.department': 1, '_id.assignee': 1, '_id.status': 1 },
      },
    ]);

    res.json({ success: true, period, data: report });
  } catch (err) {
    console.error('Report generation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
