const { verifyToken } = require('../utils/generateToken');
const { findUserById, getProfileByUserId, isTokenBlacklisted } = require('../utils/userStore');

/**
 * Protect routes - Verification middleware for JWT Bearer token in Authorization header
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header: "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      if (isTokenBlacklisted(token)) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, token has been logged out'
        });
      }

      // Verify token
      const decoded = verifyToken(token);

      // Attach updated user and profile payload to request
      const existingUser = await findUserById(decoded.id);
      const profile = decoded.id ? await getProfileByUserId(decoded.id) : null;

      req.user = existingUser ? {
        id: existingUser.id,
        fullName: existingUser.fullName,
        email: existingUser.email,
        role: existingUser.role,
        avatarUrl: existingUser.avatarUrl,
        isOnboarded: profile ? profile.isOnboarded : false,
        onboardingStep: profile ? profile.onboardingStep : 1
      } : decoded;

      return next();
    } catch (error) {
      console.error('❌ Auth Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid or expired'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
};

module.exports = { protect };
