// controllers/chatController.js
const Chat = require('../models/Chat');

// GET /api/chat/public?limit=50&before=<ISO or ms>
exports.getPublicMessages = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
    const before = req.query.before ? new Date(req.query.before) : new Date();

    const messages = await Chat.find({
      isPublic: true,
      createdAt: { $lt: before }
    })
      .populate('sender', 'name role')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.json({ success: true, data: messages.reverse() });
  } catch (err) {
    console.error('Get public chat error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/chat/department/:departmentId?limit=50&before=<ISO or ms>
exports.getDepartmentMessages = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
    const before = req.query.before ? new Date(req.query.before) : new Date();

    const messages = await Chat.find({
      department: departmentId,
      isPublic: false,
      createdAt: { $lt: before }
    })
      .populate('sender', 'name role')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.json({ success: true, data: messages.reverse() });
  } catch (err) {
    console.error('Get department chat error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/chat/public { message }
exports.postPublicMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const chat = await Chat.create({
      message: message.trim(),
      sender: req.user._id,
      isPublic: true,
      department: null,
    });

    await chat.populate('sender', 'name role');

    return res.status(201).json({ success: true, data: chat });
  } catch (err) {
    console.error('Post public message error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/chat/department { departmentId, message }
exports.postDepartmentMessage = async (req, res) => {
  try {
    const { departmentId, message } = req.body;
    if (!departmentId) return res.status(400).json({ message: 'departmentId required' });
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const chat = await Chat.create({
      message: message.trim(),
      sender: req.user._id,
      isPublic: false,
      department: departmentId,
    });

    await chat.populate('sender', 'name role');

    return res.status(201).json({ success: true, data: chat });
  } catch (err) {
    console.error('Post department message error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
