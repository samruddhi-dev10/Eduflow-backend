const rateLimit = require('express-rate-limit');

/**
 * General API Rate Limiter
 * Limits each IP to 100 requests per 15 minutes window
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

/**
 * Sensitive Auth Rate Limiter
 * Limits each IP to 15 login/register attempts per 15 minutes window
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});

module.exports = {
  apiLimiter,
  authLimiter
};
