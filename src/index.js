const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Eduflow Backend API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Example API Endpoint for Frontend Colleague
app.get('/api/v1/courses', (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      { id: 1, title: 'Introduction to Node.js', instructor: 'Backend Developer' },
      { id: 2, title: 'Frontend Integration', instructor: 'Frontend Developer' }
    ]
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
