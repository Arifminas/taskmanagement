const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');
const checkUserOrAdmin = require('../../middleware/checkUserOrAdmin');
const checkPermission = require('../../middleware/permission');

router.use(auth);  // protect all routes
router.get('/me', userController.getCurrentUser);
router.put('/me', userController.updateCurrentUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);

router.put('/:id', checkUserOrAdmin, userController.updateUser);
router.delete('/:id',role('admin'), userController.deleteUser);




module.exports = router;
