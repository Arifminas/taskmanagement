const express = require('express');
const router = express.Router();
const chatController = require('../../controllers/chatController');
const auth = require('../../middleware/auth');

router.use(auth);

// Public chat
router.get('/public', chatController.getPublicMessages);
router.post('/public', chatController.postPublicMessage);

// Department chat
router.get('/department/:departmentId', chatController.getDepartmentMessages);
router.post('/department', chatController.postDepartmentMessage);

module.exports = router;
