const express = require('express');
const router = express.Router();
const departmentController = require('../../controllers/departmentController');
const auth = require('../../middleware/auth');       // Protect routes
const role = require('../../middleware/role');       // Role-based access control
const { body } = require('express-validator');
const validateRequest = require('../../middleware/validateRequest');
const { permissions } = require('../../middleware/permission');

router.use((req, _res, next) => {
  console.log('[dept router]', req.method, req.originalUrl);
  next();
});
router.get('/public', departmentController.getAllDepartments);
// Create department - Admin only
router.post(
  '/',
  auth,
  role('admin'),
  [
    body('name').notEmpty().withMessage('Department name is required'),
  ],
  validateRequest,
  departmentController.createDepartment
);

// Get all departments - Admin & Coordinator & User can access
router.get('/', auth, departmentController.getDepartments);
// router.get('/public', departmentController.getAllDepartments);

// Assign leads - Admin only
router.put(
  '/assign-leads',
  auth,
  role('admin'),
  [
    body('departmentId').notEmpty().withMessage('Department ID is required'),
    body('leads').isArray().withMessage('Leads must be an array of user IDs'),
  ],
  validateRequest,
  departmentController.assignLeads
);
router.get('/map', auth,role('admin', 'coordinator'), departmentController.getAllDepartments);


// Department hierarchy - Admin & Coordinator only
router.get('/hierarchy', auth, role('admin', 'coordinator'), departmentController.getDepartmentHierarchy);

// Department performance - Admin & Coordinator only
router.get('/performance', auth, role('admin', 'coordinator'), departmentController.getDepartmentPerformance);

// Update department - Admin only
router.put(
  '/:id',
  auth,
  role('admin'),
  [
    body('name').notEmpty().withMessage('Department name is required'),
  ],
  validateRequest,
  departmentController.updateDepartment
);

// Delete department - Admin only
router.delete('/:id', auth, role('admin'), departmentController.deleteDepartment);

// Get department by ID - LAST (generic)
router.get('/:id', auth, departmentController.getDepartmentById);

module.exports = router;
