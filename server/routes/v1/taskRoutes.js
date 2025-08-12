const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const taskController = require('../../controllers/taskController');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');

// Protect everything in this router
router.use(auth);

/**
 * Non-parameter routes FIRST
 */
router.get('/recommendations', taskController.getRecommendedTasks);
router.post('/upload-attachments', role('admin', 'coordinator', 'user'), taskController.uploadAttachment);
router.get('/', taskController.getTasks);
router.post('/', role('admin', 'coordinator'), taskController.createTask);

/**
 * Comment & history (extra segment, safe)
 */
router.get('/:taskId/comments', taskController.getCommentsByTask);
router.post('/:taskId/comments', taskController.addComment);
router.get('/:id/history', taskController.getTaskHistory);

/**
 * Validate :id is a Mongo ObjectId
 */
router.param('id', (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid task id' });
  }
  next();
});

/**
 * Parameter routes LAST
 */
router.get('/:id', role('admin', 'coordinator'), taskController.getTaskById);
router.put('/:id', role('admin', 'coordinator', 'user'), taskController.updateTask);
router.patch('/:id/status', role('admin', 'coordinator', 'user'), taskController.updateTaskStatus);
router.delete('/:id', role('admin'), taskController.deleteTask);

module.exports = router;
