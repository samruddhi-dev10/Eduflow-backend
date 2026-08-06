const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getDashboardData,
  getStats,
  getLiveClasses,
  toggleLiveClassReminder,
  getContinueLearning,
  getRecommendedCourses,
  getModuleExplorer,
  downloadResources
} = require('../controllers/dashboardController');

// All dashboard endpoints are protected by JWT authentication
router.get('/', protect, getDashboardData);
router.get('/stats', protect, getStats);
router.get('/live-classes', protect, getLiveClasses);
router.post('/live-classes/:id/reminder', protect, toggleLiveClassReminder);
router.get('/continue-learning', protect, getContinueLearning);
router.get('/recommended', protect, getRecommendedCourses);
router.get('/module-explorer', protect, getModuleExplorer);
router.get('/download-resources', protect, downloadResources);

module.exports = router;
