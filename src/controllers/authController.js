// Auth Controller logic for Eduflow Login & Auth Flow
const { generateToken } = require('../utils/generateToken');

// @desc    Login user with Email & Password
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email address and password'
      });
    }

    // 2. User info payload
    const user = {
      id: 'usr_eduflow_101',
      name: 'Learner User',
      email,
      role: 'student',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eduflow'
    };

    const expiresIn = rememberMe ? '30d' : '1d';
    const token = generateToken(user, expiresIn);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      expiresIn,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - Request Reset Link
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your registered email address'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to ' + email
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Social Login (Google / Apple / LinkedIn)
// @route   POST /api/auth/social-login
// @access  Public
const socialLogin = async (req, res, next) => {
  try {
    const { provider, providerToken } = req.body;

    if (!provider || !providerToken) {
      return res.status(400).json({
        success: false,
        message: 'Provider and providerToken are required'
      });
    }

    const user = {
      id: `usr_${provider.toLowerCase()}_202`,
      name: `${provider} User`,
      email: `user@${provider.toLowerCase()}.com`,
      role: 'student'
    };

    const token = generateToken(user, '30d');

    res.status(200).json({
      success: true,
      message: `Successfully authenticated via ${provider}`,
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const name = req.body.name || req.body.fullName || req.body.username;
    const { email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    const user = {
      id: 'usr_' + Date.now(),
      name,
      email,
      role: 'student'
    };

    const token = generateToken(user, '30d');

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginUser,
  forgotPassword,
  socialLogin,
  registerUser
};
