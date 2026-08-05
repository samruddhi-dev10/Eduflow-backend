const express = require('express');
const router = express.Router();
const {
  loginUser,
  registerUser,
  forgotPassword,
  socialLogin,
  logoutUser
} = require('../controllers/authController');

// Routes matching the EduFlow Login Page UI
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/forgot-password', forgotPassword);
router.post('/social-login', socialLogin);
router.post('/logout', logoutUser);

module.exports = router;
