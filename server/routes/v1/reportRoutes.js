const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/reportController');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');

// All routes protected
router.use(auth);

// Example: all roles can access report, but data filtered by role inside controller
router.get('/', reportController.getReport);

module.exports = router;
