// Centralized Error Handling Middleware

const errorHandler = (err, req, res, next) => {
  console.error('❌ Server Error:', err.stack || err.message);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
