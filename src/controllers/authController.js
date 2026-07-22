// Auth Controller logic for Eduflow Login & Auth Flow

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

    // 2. Mock User check (Will connect to DB later)
    // Example: check email format / password match
    const expiresIn = rememberMe ? '30d' : '1d';

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: `jwt_token_sample_${Date.now()}`,
      expiresIn,
      user: {
        id: 'usr_eduflow_101',
        name: 'Learner User',
        email,
        role: 'student',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eduflow'
      }
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

    res.status(200).json({
      success: true,
      message: `Successfully authenticated via ${provider}`,
      token: `jwt_token_${provider}_${Date.now()}`,
      user: {
        id: `usr_${provider}_202`,
        name: `${provider} User`,
        email: `user@${provider.toLowerCase()}.com`,
        role: 'student'
      }
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
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: 'usr_' + Date.now(),
        name,
        email,
        role: 'student'
      }
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
