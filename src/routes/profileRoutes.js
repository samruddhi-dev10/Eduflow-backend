const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProfile,
  updatePersonalInfo,
  updateGoals,
  getInterestOptions,
  updateInterests,
  updateSkills,
  uploadAvatar,
  completeOnboarding
} = require('../controllers/profileController');

// All profile endpoints are protected by JWT authentication
router.get('/me', protect, getProfile);
router.put('/personal-info', protect, updatePersonalInfo);
router.get('/interests-options', protect, getInterestOptions);
router.put('/goals', protect, updateGoals);
router.put('/interests', protect, updateInterests);
router.put('/skills', protect, updateSkills);
router.post('/avatar', protect, uploadAvatar);
router.post('/complete', protect, completeOnboarding);

module.exports = router;
