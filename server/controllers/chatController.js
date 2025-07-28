const Chat = require('../models/Chat');

// Get public chat messages (with optional pagination)
exports.getPublicMessages = async (req, res) => {
  try {
    const messages = await Chat.find({ isPublic: true })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 }); // oldest first
    res.json({ success: true, data: messages });
  } catch (err) {
    console.error('Get public chat error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get department chat messages
exports.getDepartmentMessages = async (req, res) => {
  try {
    const departmentId = req.params.departmentId;
    const messages = await Chat.find({ department: departmentId, isPublic: false })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    console.error('Get department chat error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Post a chat message (public or department)
exports.postMessage = async (req, res) => {
  try {
    const { message, isPublic, department } = req.body;

    if (!message || (!isPublic && !department)) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    const chatMessage = new Chat({
      message,
      sender: req.user._id,
      isPublic: !!isPublic,
      department: department || null,
    });

    await chatMessage.save();

    const populatedMessage = await chatMessage.populate('sender', 'name role').execPopulate();

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (err) {
    console.error('Post chat message error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
