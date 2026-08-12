const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token for a given user payload
 * @param {Object|string} payload - User information or user ID
 * @param {string} [expiresIn] - Expiration time string (e.g. '1d', '30d')
 * @returns {string} Signed JWT token
 */
const generateToken = (payload, expiresIn) => {
  const secret = process.env.JWT_SECRET || 'eduflow_fallback_secret_key';
  const expiry = expiresIn || process.env.JWT_EXPIRES_IN || '30d';

  // If payload is primitive string/number, wrap into an object
  const data = typeof payload === 'object' ? payload : { id: payload };

  return jwt.sign(data, secret, {
    expiresIn: expiry
  });
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token string
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'eduflow_fallback_secret_key';
  return jwt.verify(token, secret);
};

/**
 * Generate a signed refresh token for a given user payload
 * @param {Object|string} payload - User information or user ID
 * @param {string} [expiresIn] - Expiration time string (e.g. '7d', '30d')
 * @returns {string} Signed JWT refresh token
 */
const generateRefreshToken = (payload, expiresIn) => {
  const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || 'eduflow_fallback_refresh_secret';
  const expiry = expiresIn || '7d';

  const data = typeof payload === 'object' ? payload : { id: payload };

  return jwt.sign(data, secret, {
    expiresIn: expiry
  });
};

/**
 * Verify and decode a refresh token
 * @param {string} token - Refresh token string
 * @returns {Object} Decoded payload
 */
const verifyRefreshToken = (token) => {
  const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || 'eduflow_fallback_refresh_secret';
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken
};

