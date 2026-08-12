const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProfile,
  updatePersonalInfo,
  getInterestOptions,
  getLocations,
  updateInterests,
  updateGoals,
  updateSkills,
  updatePortfolio,
  uploadAvatar,
  completeOnboarding
} = require('../controllers/profileController');

// Profile routes
router.get('/me', protect, getProfile);
router.put('/personal-info', protect, updatePersonalInfo);
router.get('/interests-options', protect, getInterestOptions);
router.get('/locations', getLocations); // Location options for create profile page
router.put('/interests', protect, updateInterests);
router.put('/goals', protect, updateGoals);
router.put('/skills', protect, updateSkills);
router.put('/portfolio', protect, updatePortfolio);
router.post('/avatar', protect, uploadAvatar);
router.post('/complete', protect, completeOnboarding);

module.exports = router;
