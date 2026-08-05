const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const profileRoutes = require('./routes/profileRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  'http://localhost:4173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
        register: 'POST /api/auth/register',
        logout: 'POST /api/auth/logout',
        forgotPassword: 'POST /api/auth/forgot-password',
        socialLogin: 'POST /api/auth/social-login'
      },
      profile: {
        getProfile: 'GET /api/profile/me (Protected)',
        updatePersonalInfo: 'PUT /api/profile/personal-info (Protected)',
        getInterestsOptions: 'GET /api/profile/interests-options (Protected)',
        updateInterests: 'PUT /api/profile/interests (Protected)',
        updateGoals: 'PUT /api/profile/goals (Protected)',
        updateSkills: 'PUT /api/profile/skills (Protected)',
        updatePortfolio: 'PUT /api/profile/portfolio (Protected)',
        uploadAvatar: 'POST /api/profile/avatar (Protected)',
        completeOnboarding: 'POST /api/profile/complete (Protected)'
      },
      courses: {
        getAll: 'GET /api/courses',
        create: 'POST /api/courses (Protected)'
      }
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/profile', profileRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

const os = require('os');

const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalIp();
  console.log(`🚀 Server running on:`);
  console.log(`   - Local:   http://localhost:${PORT}`);
  console.log(`   - Network: http://${localIp}:${PORT}`);
  console.log(`📑 Interactive Swagger Docs available at:`);
  console.log(`   - Local:   http://localhost:${PORT}/api-docs`);
  console.log(`   - Network: http://${localIp}:${PORT}/api-docs`);
});
