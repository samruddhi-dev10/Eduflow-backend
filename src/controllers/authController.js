// Auth Controller logic for Eduflow Login & Auth Flow
const {
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken
} = require('../utils/generateToken');
const {
  findUserByEmail,
  findUserById,
  createUser,
  getProfileByUserId,
  verifyUserPassword,
  saveOtp,
  verifyOtp: verifyOtpStore,
  saveResetToken,
  verifyResetTokenAndUpdatePassword,
  markEmailVerified,
  blacklistToken
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
      isEmailVerified: existingUser.isEmailVerified || false,
      isOnboarded: profile ? profile.isOnboarded : false,
      onboardingStep: profile ? profile.onboardingStep : 1
    };

    const expiresIn = rememberMe ? '30d' : '1d';
    const token = generateToken({ id: existingUser.id, email: existingUser.email }, expiresIn);
    const refreshToken = generateRefreshToken({ id: existingUser.id, email: existingUser.email }, '7d');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      refreshToken,
      expiresIn,
      user: userPayload
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - Request Reset Link / OTP
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

    // Generate reset token and demo OTP
    const resetToken = 'rst_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

    await saveResetToken(email, resetToken, expiresAt);
    await saveOtp(email, otpCode, expiresAt);

    res.status(200).json({
      success: true,
      message: 'Password reset instructions sent to ' + email,
      resetToken,
      otp: otpCode // Provided in response for easy testing / demo UI
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password Confirmation
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { email, token, otp, newPassword, password } = req.body;
    const targetPassword = newPassword || password;
    const tokenOrOtp = token || otp || req.body.resetToken;

    if (!email || !targetPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and newPassword'
      });
    }

    if (!tokenOrOtp) {
      return res.status(400).json({
        success: false,
        message: 'Reset token or OTP code is required'
      });
    }

    const result = await verifyResetTokenAndUpdatePassword(email, tokenOrOtp, targetPassword);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send OTP code for email verification
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address'
      });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await saveOtp(email, otpCode, expiresAt);

    res.status(200).json({
      success: true,
      message: 'OTP verification code sent to ' + email,
      otp: otpCode // Returned for testing / demo UI
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP code & confirm Email
// @route   POST /api/auth/verify-otp & POST /api/auth/verify-email
// @access  Public
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp, code } = req.body;
    const otpCode = otp || code;

    if (!email || !otpCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and OTP code'
      });
    }

    const isValid = await verifyOtpStore(email, otpCode);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP code'
      });
    }

    await markEmailVerified(email);
    const existingUser = await findUserByEmail(email);

    let token = null;
    let refreshToken = null;
    if (existingUser) {
      token = generateToken({ id: existingUser.id, email: existingUser.email }, '30d');
      refreshToken = generateRefreshToken({ id: existingUser.id, email: existingUser.email }, '7d');
    }

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      isEmailVerified: true,
      token,
      refreshToken,
      user: existingUser ? {
        id: existingUser.id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        isEmailVerified: true
      } : null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh JWT Token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: tokenInput } = req.body;

    if (!tokenInput) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    const decoded = verifyRefreshToken(tokenInput);
    const existingUser = await findUserById(decoded.id);

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token, user not found'
      });
    }

    const newAccessToken = generateToken({ id: existingUser.id, email: existingUser.email }, '1d');
    const newRefreshToken = generateRefreshToken({ id: existingUser.id, email: existingUser.email }, '7d');

    res.status(200).json({
      success: true,
      token: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: '1d'
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token'
    });
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
      isEmailVerified: true,
      isOnboarded: profile ? profile.isOnboarded : false,
      onboardingStep: profile ? profile.onboardingStep : 1
    };

    const token = generateToken({ id: existingUser.id, email: existingUser.email }, '30d');
    const refreshTokenVal = generateRefreshToken({ id: existingUser.id, email: existingUser.email }, '7d');

    res.status(200).json({
      success: true,
      message: `Successfully authenticated via ${provider}`,
      token,
      refreshToken: refreshTokenVal,
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
      isEmailVerified: false,
      isOnboarded: profile.isOnboarded,
      onboardingStep: profile.onboardingStep
    };

    const token = generateToken({ id: user.id, email: user.email }, '30d');
    const refreshTokenVal = generateRefreshToken({ id: user.id, email: user.email }, '7d');

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      refreshToken: refreshTokenVal,
      user: userPayload
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user session (server-side invalidation)
// @route   POST /api/auth/logout
// @access  Public / Private
const logoutUser = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (req.body && req.body.token) {
      token = req.body.token;
    }
    if (req.body && req.body.refreshToken) {
      blacklistToken(req.body.refreshToken);
    }

    if (token) {
      blacklistToken(token);
    }

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
  resetPassword,
  sendOtp,
  verifyOtp,
  refreshToken,
  socialLogin,
  registerUser,
  logoutUser
};

