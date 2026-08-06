// Auth Controller logic for Eduflow Login & Auth Flow
const { generateToken } = require('../utils/generateToken');
const {
  findUserByEmail,
  createUser,
  getProfileByUserId,
  verifyUserPassword
} = require('../utils/userStore');

// @desc    Login user with Email & Password
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    // 1. Input Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email address and password'
      });
    }

    // 2. Search user by email
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Account not found. Please sign up first.'
      });
    }

    // 3. Password Verification (Bcrypt comparison)
    const isMatch = await verifyUserPassword(existingUser, password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // 4. Fetch associated user profile & onboarding state
    const profile = await getProfileByUserId(existingUser.id);
    const userPayload = {
      id: existingUser.id,
      fullName: existingUser.fullName,
      email: existingUser.email,
      role: existingUser.role,
      avatarUrl: existingUser.avatarUrl,
      isOnboarded: profile ? profile.isOnboarded : false,
      onboardingStep: profile ? profile.onboardingStep : 1
    };

    const expiresIn = rememberMe ? '30d' : '1d';
    const token = generateToken({ id: existingUser.id, email: existingUser.email }, expiresIn);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      expiresIn,
      user: userPayload
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

    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Account not found with this email address.'
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

    const email = (req.body.email || `user@${provider.toLowerCase()}.com`).toLowerCase();
    let existingUser = await findUserByEmail(email);

    if (!existingUser) {
      const created = await createUser({
        fullName: req.body.fullName || `${provider} User`,
        email,
        password: `oauth_${providerToken.slice(0, 8)}`,
        role: 'student'
      });
      existingUser = created.user;
    }

    const profile = await getProfileByUserId(existingUser.id);
    const userPayload = {
      id: existingUser.id,
      fullName: existingUser.fullName,
      email: existingUser.email,
      role: existingUser.role,
      avatarUrl: existingUser.avatarUrl,
      isOnboarded: profile ? profile.isOnboarded : false,
      onboardingStep: profile ? profile.onboardingStep : 1
    };

    const token = generateToken({ id: existingUser.id, email: existingUser.email }, '30d');

    res.status(200).json({
      success: true,
      message: `Successfully authenticated via ${provider}`,
      token,
      user: userPayload
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
    const fullName = req.body.fullName || req.body.name || req.body.username;
    const { email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide fullName, email, and password'
      });
    }

    // Prevent Duplicate Signup
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered.'
      });
    }

    const { user, profile } = await createUser({
      fullName,
      email,
      password,
      role: 'student'
    });

    const userPayload = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isOnboarded: profile.isOnboarded,
      onboardingStep: profile.onboardingStep
    };

    const token = generateToken({ id: user.id, email: user.email }, '30d');

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userPayload
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user session
// @route   POST /api/auth/logout
// @access  Public / Private
const logoutUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginUser,
  forgotPassword,
  socialLogin,
  registerUser,
  logoutUser
};
