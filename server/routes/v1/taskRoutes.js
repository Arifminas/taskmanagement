const express = require('express');
const router = express.Router();
const taskController = require('../../controllers/taskController');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');






router.use(auth);  // protects all routes

router.get('/', taskController.getTasks);

router.post('/', role('admin', 'coordinator'), taskController.createTask);

router.put('/:id',auth, role('admin', 'coordinator', 'user'), taskController.updateTask);
router.get('/:id', role('admin', 'coordinator'),taskController.getTaskById); 
router.patch('/:id/status', role('admin', 'coordinator', 'user'), taskController.updateTaskStatus);

router.delete('/:id', role('admin'), taskController.deleteTask);
router.get('/:id/history', auth, taskController.getTaskHistory);
router.get('/:taskId/comments', auth, taskController.getCommentsByTask);
router.post('/:taskId/comments', auth, taskController.addComment);
router.get('/:taskId/comments',auth, taskController.getCommentsByTask);
router.get('/:taskId/history', taskController.getTaskHistory);
router.get('/recommendations', taskController.getRecommendedTasks);
// router.put('/:id', auth, role('admin', 'coordinator'), taskController.updateTask);

// router.use(auth);

// router.get('/', taskController.getTasks);

// router.post('/', role('admin', 'coordinator'), taskController.createTask);

// router.put('/:id', role('admin', 'coordinator', 'user'), taskController.updateTask);
// router.get('/categories', taskController.getTaskCategories);

// router.delete('/:id', role('admin'), taskController.deleteTask);
 router.post('/upload-attachments', role('admin', 'coordinator', 'user'), taskController.uploadAttachment);


module.exports = router;
