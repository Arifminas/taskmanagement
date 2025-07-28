const Task = require('../models/Task');
const User = require('../models/User');

exports.getDashboardData = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user._id;

    let taskFilter = {};
    let userFilter = {};

    if (role === 'coordinator') {
      taskFilter.department = req.user.department;
      userFilter.department = req.user.department;
    } else if (role === 'user') {
      taskFilter.assignees = userId;
      userFilter._id = userId;
    }
    // admin: no filters = all data

    // Aggregate tasks by status
    const taskCountsAgg = await Task.aggregate([
      { $match: taskFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert aggregation result to an object with defaults
    const tasksByStatus = { pending: 0, ongoing: 0, completed: 0 };
    taskCountsAgg.forEach(tc => {
      tasksByStatus[tc._id] = tc.count;
    });

    // Count overdue tasks
    const now = new Date();
    const overdueCount = await Task.countDocuments({
      ...taskFilter,
      dueDate: { $lt: now },
      status: { $ne: 'completed' },
    });

    // Fetch users matching userFilter
    const users = await User.find(userFilter).select('name email lastLogin location').lean();

    // Define "online" threshold — last 5 minutes
    const onlineThreshold = new Date(Date.now() - 5 * 60 * 1000);

    // Mark users online/offline based on lastLogin
    const usersWithStatus = users.map(u => ({
      ...u,
      isOnline: u.lastLogin && u.lastLogin > onlineThreshold,
    }));

    // Count total users & online users
    const usersCount = users.length;
    const activeUsersCount = usersWithStatus.filter(u => u.isOnline).length;

    // Recent tasks (limit 5)
    const recentTasks = await Task.find(taskFilter)
      .populate('assignees', 'name email')
      .populate('department', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.json({
      success: true,
      data: {
        role,
        tasksByStatus,
        overdueCount,
        usersCount,
        activeUsersCount,
        usersWithStatus, // send full users list with online status for frontend
        recentTasks,
      },
    });
  } catch (err) {
    console.error('Dashboard data fetch error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getActiveUsers = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user._id;
    const userDept = req.user.department;

    let filter = {};

    if (role === 'coordinator') {
      filter.department = userDept;
    } else if (role === 'user') {
      filter._id = userId;
    }
    // admin will get all users — no filter

    // Fetch selected user fields
    const users = await User.find(filter)
      .select('name email isOnline lastLogin location')
      .lean();

    // Users who logged in within last 5 minutes are considered online
    const ONLINE_THRESHOLD_MINUTES = 5;
    const onlineThreshold = new Date(Date.now() - ONLINE_THRESHOLD_MINUTES * 60 * 1000);

    const activeUsers = users.map((u) => ({
      ...u,
      isOnline: u.lastLogin && new Date(u.lastLogin) > onlineThreshold
    }));

    res.status(200).json({ success: true, data: activeUsers });
  } catch (err) {
    console.error('Active users fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};