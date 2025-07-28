const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/dashboardController');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');

router.use(auth);

router.get('/', dashboardController.getDashboardData);
router.get('/dashboard', auth, dashboardController.getDashboardData);
router.get('/active-users', auth, dashboardController.getActiveUsers);

module.exports = router;
