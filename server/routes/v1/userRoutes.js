const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const checkUserOrAdmin = require('../../middleware/checkUserOrAdmin');
const checkPermission = require('../../middleware/permission');

router.use(auth);  // protect all routes

// Admin only for user management
// Admin only routes
// router.get('/', role('admin'), checkPermission('read_user'), userController.getAllUsers);
// router.get('/:id', role('admin'), checkPermission('read_user'), userController.getUserById);
// router.post('/', role('admin'), checkPermission('create_user'), userController.createUser);
// router.delete('/:id', role('admin'), checkPermission('delete_user'), userController.deleteUser);

// Update route allows admin or the user himself
// router.put('/:id', checkUserOrAdmin, checkPermission('update_user'), userController.updateUser);

router.put('/me', userController.updateCurrentUser); // user updates own profile
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', checkUserOrAdmin, userController.updateUser);
router.delete('/:id',role('admin'), userController.deleteUser);



module.exports = router;
