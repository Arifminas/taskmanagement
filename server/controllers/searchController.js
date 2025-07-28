// server/controllers/searchController.js
const Task = require('../models/Task');
const User = require('../models/User');
const Notification = require('../models/Notification');


exports.globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const query = { $regex: q, $options: 'i' };

    const [tasks, users, notifications] = await Promise.all([
      Task.find({ title: query }).select('title status priority dueDate').limit(10),
      User.find({ name: query }).select('name email role').limit(10),
      Notification.find({ message: query }).select('message isRead createdAt').limit(10),
    ]);

    res.json({
      success: true,
      data: {
        tasks,
        users,
        notifications,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
};





exports.searchAll = async (req, res) => {
  try {
    const query = req.query.q || '';
    const regex = new RegExp(query, 'i');

    const tasks = await Task.find({ title: regex }).limit(10);
    const users = await User.find({ name: regex }).limit(10);
    const notifications = await Notification.find({ message: regex }).limit(10);

    res.json({
      success: true,
      data: { tasks, users, notifications }
    });
  } catch (err) {
    console.error('Search all error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.searchTasks = async (req, res) => {
  try {
    const query = req.query.q || '';
    const regex = new RegExp(query, 'i');
    const tasks = await Task.find({ title: regex }).limit(10);
    res.json({ success: true, data: tasks });
  } catch (err) {
    console.error('Search tasks error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const query = req.query.q || '';
    const regex = new RegExp(query, 'i');
    const users = await User.find({ name: regex }).limit(10);
    res.json({ success: true, data: users });
  } catch (err) {
    console.error('Search users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.searchNotifications = async (req, res) => {
  try {
    const query = req.query.q || '';
    const regex = new RegExp(query, 'i');
    const notifications = await Notification.find({ message: regex }).limit(10);
    res.json({ success: true, data: notifications });
  } catch (err) {
    console.error('Search notifications error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
