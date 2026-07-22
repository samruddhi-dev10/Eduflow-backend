const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Interactive API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root Welcome Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Eduflow Backend API!',
    swaggerDocs: 'http://localhost:' + PORT + '/api-docs',
    documentation: {
      auth: {
        login: 'POST /api/auth/login',
        forgotPassword: 'POST /api/auth/forgot-password',
        socialLogin: 'POST /api/auth/social-login',
        register: 'POST /api/auth/register'
      },
      courses: {
        getAll: 'GET /api/courses',
        create: 'POST /api/courses'
      }
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📑 Interactive Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
