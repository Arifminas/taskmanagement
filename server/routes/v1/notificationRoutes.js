// routes/v1/notificationRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/notificationController');
const auth = require('../../middleware/auth');

router.use(auth);

router.post('/', ctrl.create);
router.get('/', ctrl.list);
router.put('/:id/read', ctrl.markRead);
router.put('/read-all', ctrl.markAllRead);

// Push subscription endpoints
router.post('/subscribe', ctrl.subscribe);
router.post('/unsubscribe', ctrl.unsubscribe);

module.exports = router;
