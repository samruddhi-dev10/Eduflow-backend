// Profile & Onboarding Controller for EduFlow

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

// In-memory mock profile storage
const userProfiles = {
  usr_eduflow_101: {
    id: 'usr_eduflow_101',
    fullName: 'Alex Smith',
    email: 'alex.learning@example.com',
    location: 'San Francisco, CA',
    bio: 'Passionate about web development and UI/UX design.',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eduflow',
    onboardingStep: 1,
    isOnboarded: false,
    goals: ['career_upskill', "master_web_dev"],
    interests: ['ai_ml', 'web_dev', 'graphic_design'],
    skills: [
      { id: 'sk_1', name: 'Web Development', level: 'Intermediate', rating: 65 },
      { id: 'sk_2', name: 'Public Speaking', level: 'Novice', rating: 25 },
      { id: 'sk_3', name: 'UI/UX Design', level: 'Expert', rating: 90 }
    ]
  }
};

/**
 * Get current user profile & onboarding status
 * GET /api/profile/me
 */
const getProfile = (req, res, next) => {
  try {
    const userId = req.user?.id || 'usr_eduflow_101';
    let profile = userProfiles[userId];

    if (!profile) {
      // Create default profile if not present
      profile = {
        id: userId,
        fullName: req.user?.fullName || 'Alex Smith',
        email: req.user?.email || 'learner@example.com',
        location: '',
        bio: '',
        avatarUrl: req.user?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + userId,
        onboardingStep: 1,
        isOnboarded: false,
        goals: [],
        interests: [],
        skills: []
      };
      userProfiles[userId] = profile;
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Step 1: Personal Info
 * PUT /api/profile/personal-info
 */
const updatePersonalInfo = (req, res, next) => {
  try {
    const userId = req.user?.id || 'usr_eduflow_101';
    const { fullName, location, bio, avatarUrl } = req.body;

    if (!userProfiles[userId]) {
      userProfiles[userId] = { id: userId, email: req.user?.email || 'learner@example.com' };
    }

    const profile = userProfiles[userId];
    if (fullName) profile.fullName = fullName;
    if (location !== undefined) profile.location = location;
    if (bio !== undefined) profile.bio = bio;
    if (avatarUrl) profile.avatarUrl = avatarUrl;
    profile.onboardingStep = Math.max(profile.onboardingStep || 1, 2);

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
 * Update Step 2: Learning Goals
 * PUT /api/profile/goals
 */
const updateGoals = (req, res, next) => {
  try {
    const userId = req.user?.id || 'usr_eduflow_101';
    const { goals } = req.body;

    if (!Array.isArray(goals)) {
      return res.status(400).json({
        success: false,
        message: 'Goals must be an array of strings'
      });
    }

    if (!userProfiles[userId]) {
      userProfiles[userId] = { id: userId };
    }

    const profile = userProfiles[userId];
    profile.goals = goals;
    profile.onboardingStep = Math.max(profile.onboardingStep || 1, 3);

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
 * Update Step 3: Areas of Interest
 * PUT /api/profile/interests
 */
const updateInterests = (req, res, next) => {
  try {
    const userId = req.user?.id || 'usr_eduflow_101';
    const { interests } = req.body;

    if (!Array.isArray(interests)) {
      return res.status(400).json({
        success: false,
        message: 'Interests must be an array of topic IDs'
      });
    }

    if (!userProfiles[userId]) {
      userProfiles[userId] = { id: userId };
    }

    const profile = userProfiles[userId];
    profile.interests = interests;
    profile.onboardingStep = Math.max(profile.onboardingStep || 1, 4);

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
 * Update Step 4: Skill Assessment Ratings
 * PUT /api/profile/skills
 */
const updateSkills = (req, res, next) => {
  try {
    const userId = req.user?.id || 'usr_eduflow_101';
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: 'Skills must be an array of skill objects'
      });
    }

    if (!userProfiles[userId]) {
      userProfiles[userId] = { id: userId };
    }

    const profile = userProfiles[userId];
    profile.skills = skills.map((s, idx) => ({
      id: s.id || `sk_${idx + 1}`,
      name: s.name,
      level: s.level || (s.rating > 75 ? 'Expert' : s.rating > 35 ? 'Intermediate' : 'Novice'),
      rating: s.rating ?? 50
    }));
    profile.onboardingStep = Math.max(profile.onboardingStep || 1, 5);

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
 * Upload or Generate Avatar Picture
 * POST /api/profile/avatar
 */
const uploadAvatar = (req, res, next) => {
  try {
    const userId = req.user?.id || 'usr_eduflow_101';
    const seed = req.body?.seed || req.body?.name || userId;
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

    if (userProfiles[userId]) {
      userProfiles[userId].avatarUrl = avatarUrl;
    }

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
 * Step 5: Finalize & Complete Onboarding Review
 * POST /api/profile/complete
 */
const completeOnboarding = (req, res, next) => {
  try {
    const userId = req.user?.id || 'usr_eduflow_101';

    if (!userProfiles[userId]) {
      userProfiles[userId] = { id: userId };
    }

    const profile = userProfiles[userId];
    profile.isOnboarded = true;
    profile.onboardingStep = 5;

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
  updateGoals,
  getInterestOptions,
  updateInterests,
  updateSkills,
  uploadAvatar,
  completeOnboarding
};
