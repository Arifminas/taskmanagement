// server/routes/v1/searchRoutes.js
const express = require('express');
const router = express.Router();
const { globalSearch } = require('../../controllers/searchController');
const protect = require('../../middleware/auth');
const searchController = require('../../controllers/searchController');
const { searchAll, searchTasks, searchUsers, searchNotifications } =require('../../controllers/searchController');

router.get('/', protect, globalSearch);
router.get('/', protect, searchAll);
router.get('/all', protect, searchAll); // alias
router.get('/tasks', protect,searchTasks);
router.get('/users', protect, searchUsers);
router.get('/notifications', protect, searchNotifications);

module.exports = router;    
