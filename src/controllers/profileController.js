// Profile & Onboarding Controller for EduFlow
const { getProfileByUserId, updateProfileByUserId } = require('../utils/userStore');

// Pre-populated catalog of available interest topics matching UI mockups
const INTEREST_CATEGORIES = [
  {
    category: 'TECHNOLOGY',
    topics: [
      { id: 'ai_ml', name: 'AI & ML', icon: 'cpu' },
      { id: 'web_dev', name: 'Web Development', icon: 'code' },
      { id: 'cybersecurity', name: 'Cybersecurity', icon: 'shield' },
      { id: 'cloud_computing', name: 'Cloud Computing', icon: 'cloud' },
      { id: 'mobile_dev', name: 'Mobile App Development', icon: 'smartphone' }
    ]
  },
  {
    category: 'ARTS',
    topics: [
      { id: 'graphic_design', name: 'Graphic Design', icon: 'palette' },
      { id: 'photography', name: 'Photography', icon: 'camera' },
      { id: 'music_theory', name: 'Music Theory', icon: 'music' },
      { id: 'ui_ux_design', name: 'UI/UX Design', icon: 'layout' },
      { id: 'video_editing', name: 'Video Production', icon: 'video' }
    ]
  },
  {
    category: 'BUSINESS',
    topics: [
      { id: 'marketing', name: 'Marketing', icon: 'trending-up' },
      { id: 'data_analytics', name: 'Data Analytics', icon: 'bar-chart' },
      { id: 'entrepreneurship', name: 'Entrepreneurship', icon: 'lightbulb' },
      { id: 'finance', name: 'Finance & Accounting', icon: 'dollar-sign' },
      { id: 'product_management', name: 'Product Management', icon: 'briefcase' }
    ]
  },
  {
    category: 'SCIENCE & HEALTH',
    topics: [
      { id: 'physics', name: 'Physics', icon: 'atom' },
      { id: 'wellness', name: 'Wellness & Fitness', icon: 'heart' },
      { id: 'psychology', name: 'Psychology', icon: 'brain' },
      { id: 'biotechnology', name: 'Biotechnology', icon: 'activity' },
      { id: 'environmental_science', name: 'Environmental Science', icon: 'globe' }
    ]
  }
];

/**
 * Get current user profile & onboarding status
 * GET /api/profile/me
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const profile = await getProfileByUserId(userId);
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
const updatePersonalInfo = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { fullName, location, bio, avatarUrl } = req.body;
    const current = await getProfileByUserId(userId);

    const updates = {};
    if (fullName) updates.fullName = fullName;
    if (location !== undefined) updates.location = location;
    if (bio !== undefined) updates.bio = bio;
    if (avatarUrl) updates.avatarUrl = avatarUrl;
    updates.onboardingStep = Math.max(current?.onboardingStep || 1, 2);

    const profile = await updateProfileByUserId(userId, updates);

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
const getInterestOptions = async (req, res, next) => {
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
const updateInterests = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let selectedInterests = req.body.interests || req.body.topics || req.body.interestCategories || req.body.categories;
    if (!selectedInterests && Array.isArray(req.body)) {
      selectedInterests = req.body;
    }

    if (!selectedInterests) {
      selectedInterests = [];
    } else if (typeof selectedInterests === 'string') {
      selectedInterests = [selectedInterests];
    }

    if (!Array.isArray(selectedInterests)) {
      return res.status(400).json({
        success: false,
        message: 'Interests must be an array of selected interest IDs or category names'
      });
    }

    const current = await getProfileByUserId(userId);
    const profile = await updateProfileByUserId(userId, {
      interests: selectedInterests,
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
const updateGoals = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let {
      goals,
      primaryGoal,
      experienceLevel,
      learningStyle,
      weeklyCommitment,
      targetRole
    } = req.body;

    if (!goals && Array.isArray(req.body)) {
      goals = req.body;
    }

    if (!goals) {
      goals = [];
    } else if (typeof goals === 'string') {
      goals = [goals];
    }

    const updates = {
      goals,
      onboardingStep: Math.max((await getProfileByUserId(userId))?.onboardingStep || 1, 4)
    };

    if (primaryGoal !== undefined) updates.primaryGoal = primaryGoal;
    if (experienceLevel !== undefined) updates.experienceLevel = experienceLevel;
    if (learningStyle !== undefined) updates.learningStyle = learningStyle;
    if (weeklyCommitment !== undefined) updates.weeklyCommitment = weeklyCommitment;
    if (targetRole !== undefined) updates.targetRole = targetRole;

    const profile = await updateProfileByUserId(userId, updates);

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
const updateSkills = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let inputSkills = req.body.skills || req.body.skillRatings || req.body.ratings;
    if (!inputSkills && Array.isArray(req.body)) {
      inputSkills = req.body;
    }

    if (!inputSkills) {
      inputSkills = [];
    }

    if (!Array.isArray(inputSkills)) {
      return res.status(400).json({
        success: false,
        message: 'Skills must be an array of skill items'
      });
    }

    const formattedSkills = inputSkills.map((s, idx) => {
      if (typeof s === 'string') {
        return { id: `sk_${idx + 1}`, name: s, level: 'Intermediate', rating: 50 };
      }
      return {
        id: s.id || `sk_${idx + 1}`,
        name: s.name || s.skill || s.title || `Skill ${idx + 1}`,
        level: s.level || (s.rating > 75 ? 'Expert' : s.rating > 35 ? 'Intermediate' : 'Novice'),
        rating: s.rating ?? s.score ?? 50
      };
    });

    const current = await getProfileByUserId(userId);
    const profile = await updateProfileByUserId(userId, {
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
const updatePortfolio = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { portfolio } = req.body;

    const current = await getProfileByUserId(userId);
    const profile = await updateProfileByUserId(userId, {
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
const uploadAvatar = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const seed = req.body?.seed || req.body?.name || userId;
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

    const profile = await updateProfileByUserId(userId, { avatarUrl });

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
const completeOnboarding = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const profile = await updateProfileByUserId(userId, {
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

const locationsData = require('../data/locations.json');

/**
 * Get Available Global Locations & Countries (Searchable)
 * GET /api/profile/locations?search=...&country=...
 */
const getLocations = async (req, res, next) => {
  try {
    const { search, country } = req.query;
    let results = locationsData.locations || [];

    if (country) {
      const targetCountry = country.toLowerCase();
      results = results.filter(loc => loc.country.toLowerCase().includes(targetCountry));
    }

    if (search) {
      const q = search.toLowerCase().trim();
      results = results.filter(loc =>
        loc.label.toLowerCase().includes(q) ||
        loc.city.toLowerCase().includes(q) ||
        loc.country.toLowerCase().includes(q) ||
        (loc.state && loc.state.toLowerCase().includes(q))
      );
    }

    res.status(200).json({
      success: true,
      total: results.length,
      countries: locationsData.countries || [],
      data: results
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};

