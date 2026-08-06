const { body, validationResult } = require('express-validator');

/**
 * Handle Validation Results Middleware
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  }
  next();
};

/**
 * User Registration Validation Schema
 */
const validateRegister = [
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('fullName').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  validate
];

/**
 * User Login Validation Schema
 */
const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

module.exports = {
  validateRegister,
  validateLogin
};
