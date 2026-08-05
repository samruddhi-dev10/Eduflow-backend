// Profile & Onboarding Controller for EduFlow
const { getProfileByUserId, updateProfileByUserId } = require('../utils/userStore');

// Pre-populated catalog of available interest topics matching UI mockups
const INTEREST_CATEGORIES = [
  {
    category: 'TECHNOLOGY',
    topics: [
      { id: 'ai_ml', name: 'AI & ML', icon: 'cpu' },
      { id: 'web_dev', name: 'Web Development', icon: 'code' },
      { id: 'cybersecurity', name: 'Cybersecurity', icon: 'shield' }
    ]
  },
  {
    category: 'ARTS',
    topics: [
      { id: 'graphic_design', name: 'Graphic Design', icon: 'palette' },
      { id: 'photography', name: 'Photography', icon: 'camera' },
      { id: 'music_theory', name: 'Music Theory', icon: 'music' }
    ]
  },
  {
    category: 'BUSINESS',
    topics: [
      { id: 'marketing', name: 'Marketing', icon: 'trending-up' },
      { id: 'data_analytics', name: 'Data Analytics', icon: 'bar-chart' },
      { id: 'entrepreneurship', name: 'Entrepreneurship', icon: 'lightbulb' }
    ]
  },
  {
    category: 'SCIENCE & HEALTH',
    topics: [
      { id: 'physics', name: 'Physics', icon: 'atom' },
      { id: 'wellness', name: 'Wellness', icon: 'heart' },
      { id: 'psychology', name: 'Psychology', icon: 'brain' }
    ]
  }
];

/**
 * Get current user profile & onboarding status
 * GET /api/profile/me
 */
const getProfile = (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const profile = getProfileByUserId(userId);
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Step 1: Personal Info
 * PUT /api/profile/personal-info
 */
const updatePersonalInfo = (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { fullName, location, bio, avatarUrl } = req.body;
    const current = getProfileByUserId(userId);

    const updates = {};
    if (fullName) updates.fullName = fullName;
    if (location !== undefined) updates.location = location;
    if (bio !== undefined) updates.bio = bio;
    if (avatarUrl) updates.avatarUrl = avatarUrl;
    updates.onboardingStep = Math.max(current?.onboardingStep || 1, 2);

    const profile = updateProfileByUserId(userId, updates);

    res.status(200).json({
      success: true,
      message: 'Personal info updated successfully',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Available Interest Options & Categories
 * GET /api/profile/interests-options
 */
const getInterestOptions = (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: INTEREST_CATEGORIES
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Step 2: Areas of Interest
 * PUT /api/profile/interests
 */
const updateInterests = (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { interests } = req.body;

    if (!Array.isArray(interests)) {
      return res.status(400).json({
        success: false,
        message: 'Interests must be an array of topic IDs'
      });
    }

    const current = getProfileByUserId(userId);
    const profile = updateProfileByUserId(userId, {
      interests,
      onboardingStep: Math.max(current?.onboardingStep || 1, 3)
    });

    res.status(200).json({
      success: true,
      message: 'Interests updated successfully',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Step 3: Learning Goals
 * PUT /api/profile/goals
 */
const updateGoals = (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { goals } = req.body;

    if (!Array.isArray(goals)) {
      return res.status(400).json({
        success: false,
        message: 'Goals must be an array of strings'
      });
    }

    const current = getProfileByUserId(userId);
    const profile = updateProfileByUserId(userId, {
      goals,
      onboardingStep: Math.max(current?.onboardingStep || 1, 4)
    });

    res.status(200).json({
      success: true,
      message: 'Learning goals updated successfully',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Step 4: Skill Assessment Ratings
 * PUT /api/profile/skills
 */
const updateSkills = (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: 'Skills must be an array of skill objects'
      });
    }

    const formattedSkills = skills.map((s, idx) => ({
      id: s.id || `sk_${idx + 1}`,
      name: s.name,
      level: s.level || (s.rating > 75 ? 'Expert' : s.rating > 35 ? 'Intermediate' : 'Novice'),
      rating: s.rating ?? 50
    }));

    const current = getProfileByUserId(userId);
    const profile = updateProfileByUserId(userId, {
      skills: formattedSkills,
      onboardingStep: Math.max(current?.onboardingStep || 1, 5)
    });

    res.status(200).json({
      success: true,
      message: 'Skills assessment updated successfully',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Step 5: Portfolio Information
 * PUT /api/profile/portfolio
 */
const updatePortfolio = (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { portfolio } = req.body;

    const current = getProfileByUserId(userId);
    const profile = updateProfileByUserId(userId, {
      portfolio,
      onboardingStep: Math.max(current?.onboardingStep || 1, 6)
    });

    res.status(200).json({
      success: true,
      message: 'Portfolio updated successfully',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload or Generate Avatar Picture
 * POST /api/profile/avatar
 */
const uploadAvatar = (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const seed = req.body?.seed || req.body?.name || userId;
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

    const profile = updateProfileByUserId(userId, { avatarUrl });

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      avatarUrl
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Step 6: Finalize & Complete Onboarding Review
 * POST /api/profile/complete
 */
const completeOnboarding = (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const profile = updateProfileByUserId(userId, {
      isOnboarded: true,
      onboardingStep: 6
    });

    res.status(200).json({
      success: true,
      message: 'Onboarding completed successfully! Welcome to EduFlow.',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updatePersonalInfo,
  getInterestOptions,
  updateInterests,
  updateGoals,
  updateSkills,
  updatePortfolio,
  uploadAvatar,
  completeOnboarding
};
