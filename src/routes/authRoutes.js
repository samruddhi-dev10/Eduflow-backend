const express = require('express');
const router = express.Router();
const {
  loginUser,
  registerUser,
  forgotPassword,
  socialLogin,
  logoutUser
} = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateLogin, validateRegister } = require('../middleware/validators');

// Routes matching the EduFlow Login Page UI
router.post('/login', authLimiter, validateLogin, loginUser);
router.post('/register', authLimiter, validateRegister, registerUser);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/social-login', authLimiter, socialLogin);
router.post('/logout', logoutUser);

module.exports = router;
