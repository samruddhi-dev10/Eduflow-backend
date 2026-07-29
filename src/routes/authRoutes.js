const express = require('express');
const router = express.Router();
const {
  loginUser,
  registerUser,
  forgotPassword,
  socialLogin
} = require('../controllers/authController');

// Routes matching the EduFlow Login Page UI
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/forgot-password', forgotPassword);
router.post('/social-login', socialLogin);

module.exports = router;
