const express = require('express');
const router = express.Router();
const transferController = require('../../controllers/transferController');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');

// Protect all routes
router.use(auth);

// Only admin can manage transfers
router.use(role('admin'));

router.get('/', transferController.getTransfers);
router.post('/', transferController.createTransfer);

module.exports = router;
