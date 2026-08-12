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

/**
 * Reset Password Validation Schema
 */
const validateResetPassword = [
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  validate
];

/**
 * Send OTP Validation Schema
 */
const validateSendOtp = [
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  validate
];

/**
 * Verify OTP Validation Schema
 */
const validateVerifyOtp = [
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('otp').notEmpty().withMessage('OTP code is required'),
  validate
];

/**
 * Refresh Token Validation Schema
 */
const validateRefreshToken = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  validate
];

module.exports = {
  validateRegister,
  validateLogin,
  validateResetPassword,
  validateSendOtp,
  validateVerifyOtp,
  validateRefreshToken
};

