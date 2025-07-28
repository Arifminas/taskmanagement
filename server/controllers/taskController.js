const Task = require('../models/Task');
const Comment = require('../models/Comment');
const multer = require('multer');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const TaskHistory = require('../models/TaskHistory');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const path = require('path');
const Notification = require('../models/Notification');


const s3 = new S3Client({ region: process.env.AWS_REGION });
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.getTasks = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'admin') {
      filter = {};
    } else if (req.user.role === 'coordinator') {
      if (!req.user.department) {
        return res.status(400).json({ message: 'Coordinator has no department assigned' });
      }
      filter.department = req.user.department;
    } else if (req.user.role === 'user') {
      filter.assignees = req.user._id;
    } else {
      return res.status(403).json({ message: 'Role not authorized to view tasks' });
    }

    const tasks = await Task.find(filter)
      .populate('department', 'name')
      .populate('assignees', 'name email')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name email' },
      });

    return res.json({ success: true, data: tasks });
  } catch (err) {
    console.error('Get tasks error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


exports.createTask = async (req, res) => {
  try {
    const { title, description, department, assignees, dueDate, priority, progress = 0, subtasks = [] } = req.body;


    const task = new Task({
      title,
      description,
      department,
      assignees,
      dueDate,
      priority,
      progress,
      subtasks,
      createdBy: req.user._id,
    });

    await task.save();

    if (Array.isArray(assignees)) {
      for (const userId of assignees) {
        const user = await User.findById(userId);
        if (user) {
          sendEmail({
            to: user.email,
            subject: 'New Task Assigned',
            text: `You have been assigned a new task: ${title}. Please check your task list.`,
          }).catch(err => console.error('Email error:', err));

          const notification = await Notification.create({
            user: user._id,
            message: `You have been assigned a new task: ${title}`,
          });

          const io = req.app.get('io');
          io.to(user._id.toString()).emit('newNotification', notification);
        }
      }
    }

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const requesterId = req.user._id.toString();
    const assigneeIds = (task.assignees || []).map(id => id.toString());

    // 🛡️ Only assigned users can update
    if (req.user.role === 'user' && !assigneeIds.includes(requesterId)) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // 🔒 Block completed task editing
    if (task.status === 'completed') {
      return res.status(400).json({ message: 'Completed tasks cannot be edited' });
    }

    // ✅ Handle direct progress input
    if (req.body.progress !== undefined) {
      const progress = parseInt(req.body.progress, 10);
      if (isNaN(progress) || progress < 0 || progress > 100) {
        return res.status(400).json({ message: 'Progress must be between 0–100' });
      }
      task.progress = progress;
    }

    // 🔁 Handle subtasks update and calculate average progress
   if (req.body.subtasks) {
  task.subtasks = req.body.subtasks;

  const total = task.subtasks.length;

  const sum = task.subtasks.reduce((acc, st) => {
    // Use subtask.progress if available, else 100 if completed, else 0
    return acc + (typeof st.progress === 'number'
      ? st.progress
      : st.completed
      ? 100
      : 0);
  }, 0);

  // Final task progress: average of all subtask progress
  task.progress =
    total > 0
      ? Math.round(sum / total)
      : typeof req.body.progress === 'number'
      ? req.body.progress
      : 0;
}


    // ✏️ Apply all other fields (except subtasks & progress)
    Object.keys(req.body).forEach(key => {
      if (!['subtasks', 'progress'].includes(key)) {
        task[key] = req.body[key];
      }
    });

    await task.save();

    // 📬 Notify all assignees except updater
    const io = req.app?.get('io'); // Socket.IO instance
    const notified = new Set();

    for (const userId of task.assignees) {
      const uid = userId.toString();
      if (uid !== requesterId && !notified.has(uid)) {
        const user = await User.findById(uid);
        if (user?.email) {
          // Email content
          const emailText = `
Hello ${user.name},

The task "${task.title}" assigned to you has been updated by ${req.user.name}.

📌 Status: ${task.status}
⚡ Priority: ${task.priority}
📅 Due date: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
📈 Progress: ${task.progress}%

Please check the task details in the system.

Regards,  
Task Management System
          `;

          // 📧 Send email
          sendEmail({
            to: user.email,
            subject: `Task Updated: ${task.title}`,
            text: emailText,
          }).catch(err => console.error('Email send error:', err));

          // 🔔 Real-time notification
          if (io) {
            io.to(uid).emit('taskUpdated', {
              taskId: task._id,
              title: task.title,
              updatedBy: req.user.name,
              type: 'update',
              timestamp: new Date(),
            });
          }

          notified.add(uid);
        }
      }
    }

    return res.json({ success: true, data: task });
  } catch (err) {
    console.error('Update task error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete tasks' });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    return res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    console.error('Delete task error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadAttachment = [
  upload.array('attachments', 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const taskId = req.body.taskId || req.params.id;
      if (!taskId) return res.status(400).json({ message: 'Task ID required' });

      const task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ message: 'Task not found' });

      const uploadedUrls = [];

      for (const file of req.files) {
        const fileKey = `tasks/${taskId}/${crypto.randomBytes(16).toString('hex')}${path.extname(file.originalname)}`;

        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
          // ACL: 'public-read'
        };

        await s3.send(new PutObjectCommand(params));

        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
        uploadedUrls.push(fileUrl);
      }

      task.attachments = task.attachments.concat(uploadedUrls);
      await task.save();

      res.status(200).json({ success: true, data: task });
    } catch (error) {
      console.error('Upload attachment error:', error);
      res.status(500).json({ message: 'Server error uploading attachments' });
    }
  }
];

// Categories (static for now)
const categories = ['Bug', 'Feature', 'Improvement', 'Research'];

exports.getTaskCategories = async (req, res) => {
  try {
    return res.json({ success: true, data: categories });
  } catch (err) {
    console.error('Get categories error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Task history
exports.getTaskHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await TaskHistory.find({ task: id })
      .populate('performedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (err) {
    console.error('Get task history error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Comments Controller

exports.getCommentsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const comments = await Comment.find({ task: taskId })
      .populate('user', 'name email')
      .lean();

    // Build nested comment structure
    const commentMap = {};
    comments.forEach(c => {
      c.replies = [];
      commentMap[c._id] = c;
    });

    const roots = [];
    comments.forEach(c => {
      if (c.parentComment) {
        if (commentMap[c.parentComment]) {
          commentMap[c.parentComment].replies.push(c);
        }
      } else {
        roots.push(c);
      }
    });

    res.json({ success: true, data: roots });
  } catch (err) {
    console.error('Get comments error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { comment, parentComment } = req.body;

    if (!comment) return res.status(400).json({ message: 'Comment text is required' });

    const newComment = new Comment({
      task: taskId,
      user: req.user._id,
      comment,
      parentComment: parentComment || null,
    });

    await newComment.save();

    const populatedComment = await Comment.findById(newComment._id).populate('user', 'name email');

    res.status(201).json({ success: true, data: populatedComment });
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignees', 'name email')
      .populate('department', 'name')
      .populate('comments');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json({ success: true, data: task });
  } catch (err) {
    console.error('Get task by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role === 'user' && !task.assignees.includes(req.user._id)) {

      return res.status(403).json({ message: 'Not authorized to update this task' });
    }
    if (task.status === 'completed') {
      return res.status(400).json({ message: 'Completed tasks cannot be edited' });
    }

    task.status = status;
    await task.save();

    // TODO: Send email notification for status change

    res.json({ success: true, data: task });
  } catch (err) {
    console.error('Update task status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports. calculateProgress = (subtasks) => {
  if (!subtasks.length) return 0;
  const total = subtasks.length;
  const sum = subtasks.reduce((acc, st) =>
    acc + (typeof st.progress === 'number' ? st.progress : st.completed ? 100 : 0), 0);
  return Math.round(sum / total);
};

exports.getRecommendedTasks = async (req, res) => {
  try {
    const user = req.user;

    const recommendations = await Task.find({
      department: user.department,
      status: { $ne: 'completed' },
      assignees: { $ne: user._id },
    })
      .sort({ createdAt: -1 }) // Recent first
      .limit(5)
      .populate('department', 'name')
      .populate('assignees', 'name email');

    res.status(200).json({ success: true, data: recommendations });
  } catch (error) {
    console.error('AI Recommendation Error:', error);
    res.status(500).json({ message: 'Failed to fetch recommended tasks' });
  }
};