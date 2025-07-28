const express = require('express');
const router = express.Router();
const chatController = require('../../controllers/chatController');
const auth = require('../../middleware/auth');

// All routes require auth
router.use(auth);

// Public chat
router.get('/public', chatController.getPublicMessages);
router.post('/public', chatController.postMessage);

// Department chat
router.get('/department/:departmentId', chatController.getDepartmentMessages);
router.post('/department', chatController.postMessage);

module.exports = router;
