const express = require('express');
const router = express.Router();
const {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  sendOtp,
  verifyOtp,
  refreshToken,
  socialLogin,
  logoutUser
} = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  validateLogin,
  validateRegister,
  validateResetPassword,
  validateSendOtp,
  validateVerifyOtp,
  validateRefreshToken
} = require('../middleware/validators');

// Auth Routes
router.post('/login', authLimiter, validateLogin, loginUser);
router.post('/register', authLimiter, validateRegister, registerUser);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, validateResetPassword, resetPassword);
router.post('/send-otp', authLimiter, validateSendOtp, sendOtp);
router.post('/verify-otp', authLimiter, validateVerifyOtp, verifyOtp);
router.post('/verify-email', authLimiter, validateVerifyOtp, verifyOtp);
router.post('/refresh-token', authLimiter, validateRefreshToken, refreshToken);
router.post('/social-login', authLimiter, socialLogin);
router.post('/logout', logoutUser);

module.exports = router;

