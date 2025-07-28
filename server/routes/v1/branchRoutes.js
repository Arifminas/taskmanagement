const express = require('express');
const router = express.Router();
const branchController = require('../../controllers/branchController');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');

// Protect all routes
router.use(auth);

// Only admin can manage branches
router.use(role('admin'));

router.get('/', branchController.getBranches);
router.get('/:id', branchController.getBranchById);
router.post('/', branchController.createBranch);
router.put('/:id', branchController.updateBranch);
router.delete('/:id', branchController.deleteBranch);

module.exports = router;
