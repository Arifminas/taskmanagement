const permissions = require('../config/permissions');

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.user.role;  // assuming auth middleware already sets req.user

    if (!permissions[userRole]) {
      return res.status(403).json({ message: 'Role not recognized' });
    }

    if (!permissions[userRole].includes(requiredPermission)) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    next();
  };
};

module.exports = checkPermission;
