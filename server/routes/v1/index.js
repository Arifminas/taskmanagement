const express = require('express');
const router = express.Router();

// Import module-specific route files
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const taskRoutes = require('./taskRoutes');
const departmentRoutes = require('./departmentRoutes');
const chatRoutes = require('./chatRoutes');
const reportRoutes = require('./reportRoutes');
const assetRoutes = require('./assetRoutes');
const branchRoutes = require('./branchRoutes');
const staffRoutes = require('./staffRoutes');
const transferRoutes = require('./transferRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const notificationRoutes = require('./notificationRoutes');
const searchRoutes = require('./searchRoutes');



// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/departments', departmentRoutes);
router.use('/chat', chatRoutes);
router.use('/reports', reportRoutes);
router.use('/assets', assetRoutes);
router.use('/branches', branchRoutes);
router.use('/staff', staffRoutes);
router.use('/transfers', transferRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/notifications', notificationRoutes);
router.use('/search', searchRoutes);





module.exports = router;
