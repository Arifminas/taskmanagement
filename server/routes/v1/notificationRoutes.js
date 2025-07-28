const express = require('express');
const router = express.Router();
const { createNotification, getUserNotifications, markAsRead } = require('../../controllers/notificationController');
const protect = require('../../middleware/auth');

router.post('/', protect, createNotification);
router.get('/', protect, getUserNotifications);
router.put('/:id/read', protect, markAsRead);

module.exports = router;
