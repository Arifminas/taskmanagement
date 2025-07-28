const { validationResult } = require('express-validator');

const validateRequest= (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Format errors as an array of messages
    const extractedErrors = errors.array().map(err => ({
      param: err.param,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      errors: extractedErrors,
    });
  }

  next();
};

module.exports = validateRequest;
