/**
 * Data Access Layer for Users, Profiles, and Dashboard Data
 * Supports MongoDB (via Mongoose models) with transparent In-Memory fallback mode.
 */

const bcrypt = require('bcryptjs');
const { isDBConnected } = require('../config/db');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Dashboard = require('../models/Dashboard');

// In-memory fallbacks when DB is offline
const users = new Map();
const usersById = new Map();
const profiles = new Map();
const dashboards = new Map();

/**
 * Initialize default Dashboard data structure matching UI
 */
const createDefaultDashboardData = () => ({
  stats: {
    currentStreakDays: 0,
    timeLearnedHours: 0,
    coursesCompleted: 0
  },
  liveClasses: [],
  continueLearning: [],
  recommended: [],
  moduleExplorer: {
    title: 'Module Explorer',
    navigation: [],
    resourceDownloadUrl: '/api/dashboard/download-resources'
  }
});

/**
 * Find user by email
 */
const findUserByEmail = async (email) => {
  if (!email) return null;
  const normalizedEmail = email.toLowerCase().trim();

  if (isDBConnected()) {
    const doc = await User.findOne({ email: normalizedEmail });
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      fullName: doc.fullName,
      email: doc.email,
      password: doc.password,
      role: doc.role,
      avatarUrl: doc.avatarUrl,
      createdAt: doc.createdAt
    };
  }

  return users.get(normalizedEmail) || null;
};

/**
 * Find user by ID
 */
const findUserById = async (id) => {
  if (!id) return null;

  if (isDBConnected()) {
    try {
      const doc = await User.findById(id);
      if (!doc) return null;
      return {
        id: doc._id.toString(),
        fullName: doc.fullName,
        email: doc.email,
        password: doc.password,
        role: doc.role,
        avatarUrl: doc.avatarUrl,
        createdAt: doc.createdAt
      };
    } catch (e) {
      return null;
    }
  }

  return usersById.get(id) || null;
};

/**
 * Create a new user and initialize empty profile & dashboard data
 */
const createUser = async ({ fullName, email, password, role = 'student' }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName || normalizedEmail)}`;

  if (isDBConnected()) {
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) throw new Error('User already exists');

    const newUser = await User.create({
      fullName,
      email: normalizedEmail,
      password,
      role,
      avatarUrl
    });

    const newProfile = await Profile.create({
      userId: newUser._id,
      isOnboarded: false,
      onboardingStep: 1
    });

    await Dashboard.create({
      userId: newUser._id,
      ...createDefaultDashboardData()
    });

    const userObj = {
      id: newUser._id.toString(),
      fullName: newUser.fullName,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      avatarUrl: newUser.avatarUrl,
      createdAt: newUser.createdAt
    };

    const profileObj = {
      id: newUser._id.toString(),
      fullName: newUser.fullName,
      email: newUser.email,
      avatarUrl: newUser.avatarUrl,
      onboardingStep: newProfile.onboardingStep,
      isOnboarded: newProfile.isOnboarded,
      goals: [],
      interests: [],
      skills: []
    };

    return { user: userObj, profile: profileObj };
  }

  // In-memory fallback
  if (users.has(normalizedEmail)) {
    throw new Error('User already exists');
  }

  const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: userId,
    fullName,
    email: normalizedEmail,
    password: hashedPassword,
    role,
    avatarUrl,
    createdAt: new Date().toISOString()
  };

  users.set(normalizedEmail, user);
  usersById.set(userId, user);

  const profile = {
    id: userId,
    fullName,
    email: normalizedEmail,
    location: '',
    bio: '',
    avatarUrl,
    onboardingStep: 1,
    isOnboarded: false,
    goals: [],
    interests: [],
    skills: [],
    portfolio: null
  };

  profiles.set(userId, profile);
  return { user, profile };
};

/**
 * Get profile by user ID
 */
const getProfileByUserId = async (userId) => {
  if (!userId) return null;

  if (isDBConnected()) {
    try {
      let doc = await Profile.findOne({ userId });
      const userDoc = await User.findById(userId);

      if (!doc && userDoc) {
        doc = await Profile.create({
          userId,
          isOnboarded: false,
          onboardingStep: 1
        });
      }

      if (!doc) return null;

      return {
        id: userId,
        fullName: userDoc ? userDoc.fullName : '',
        email: userDoc ? userDoc.email : '',
        avatarUrl: userDoc ? userDoc.avatarUrl : '',
        onboardingStep: doc.onboardingStep,
        isOnboarded: doc.isOnboarded,
        primaryGoal: doc.primaryGoal,
        experienceLevel: doc.experienceLevel,
        learningStyle: doc.learningStyle,
        weeklyCommitment: doc.weeklyCommitment,
        targetRole: doc.targetRole,
        bio: doc.bio,
        interests: doc.interests
      };
    } catch (e) {
      return null;
    }
  }

  let profile = profiles.get(userId);
  if (!profile) {
    const user = await findUserById(userId);
    if (user) {
      profile = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        location: '',
        bio: '',
        avatarUrl: user.avatarUrl,
        onboardingStep: 1,
        isOnboarded: false,
        goals: [],
        interests: [],
        skills: [],
        portfolio: null
      };
      profiles.set(userId, profile);
    }
  }
  return profile;
};

/**
 * Update profile data for a user
 */
const updateProfileByUserId = async (userId, updates) => {
  if (isDBConnected()) {
    try {
      const doc = await Profile.findOneAndUpdate({ userId }, { $set: updates }, { new: true, upsert: true });
      const userDoc = await User.findById(userId);
      return {
        id: userId,
        fullName: userDoc ? userDoc.fullName : '',
        email: userDoc ? userDoc.email : '',
        avatarUrl: userDoc ? userDoc.avatarUrl : '',
        onboardingStep: doc.onboardingStep,
        isOnboarded: doc.isOnboarded,
        primaryGoal: doc.primaryGoal,
        experienceLevel: doc.experienceLevel,
        learningStyle: doc.learningStyle,
        weeklyCommitment: doc.weeklyCommitment,
        targetRole: doc.targetRole,
        bio: doc.bio,
        interests: doc.interests
      };
    } catch (e) {
      return null;
    }
  }

  let profile = await getProfileByUserId(userId);
  if (!profile) return null;

  Object.assign(profile, updates);
  profiles.set(userId, profile);
  return profile;
};

/**
 * Get Dashboard Data for a User
 */
const getDashboardDataByUserId = async (userId) => {
  const user = await findUserById(userId);

  if (isDBConnected()) {
    try {
      let doc = await Dashboard.findOne({ userId });
      if (!doc) {
        doc = await Dashboard.create({
          userId,
          ...createDefaultDashboardData()
        });
      }

      const firstName = user?.fullName ? user.fullName.split(' ')[0] : (user?.email ? user.email.split('@')[0] : 'learner');

      return {
        user: {
          id: userId,
          fullName: user?.fullName || firstName,
          firstName
        },
        banner: {
          welcomeMessage: `Welcome back, ${firstName}!`,
          motivationalText: "Welcome to Eduflow! Explore courses and start your learning journey today."
        },
        stats: doc.stats,
        liveClasses: doc.liveClasses,
        continueLearning: doc.continueLearning,
        recommended: doc.recommended,
        moduleExplorer: doc.moduleExplorer
      };
    } catch (e) {
      console.error('Error fetching DB dashboard data:', e);
    }
  }

  let dbData = dashboards.get(userId);

  if (!dbData) {
    dbData = createDefaultDashboardData();
    dashboards.set(userId, dbData);
  }

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : (user?.email ? user.email.split('@')[0] : 'learner');

  return {
    user: {
      id: userId,
      fullName: user?.fullName || firstName,
      firstName
    },
    banner: {
      welcomeMessage: `Welcome back, ${firstName}!`,
      motivationalText: "You're doing great! You completed 4 lessons this week. Keep the momentum going to finish Project Management by Friday."
    },
    stats: dbData.stats,
    liveClasses: dbData.liveClasses,
    continueLearning: dbData.continueLearning,
    recommended: dbData.recommended,
    moduleExplorer: dbData.moduleExplorer
  };
};

/**
 * Toggle Reminder for a Live Class
 */
const toggleLiveClassReminderByUserId = async (userId, classId) => {
  if (isDBConnected()) {
    try {
      let doc = await Dashboard.findOne({ userId });
      if (!doc) {
        doc = await Dashboard.create({
          userId,
          ...createDefaultDashboardData()
        });
      }

      const liveClass = doc.liveClasses.find(c => c.id === classId);
      if (!liveClass) return null;

      liveClass.isReminderSet = !liveClass.isReminderSet;
      await doc.save();
      return liveClass;
    } catch (e) {
      return null;
    }
  }

  let dbData = dashboards.get(userId);
  if (!dbData) {
    dbData = createDefaultDashboardData();
    dashboards.set(userId, dbData);
  }

  const liveClass = dbData.liveClasses.find(c => c.id === classId);
  if (!liveClass) return null;

  liveClass.isReminderSet = !liveClass.isReminderSet;
  dashboards.set(userId, dbData);
  return liveClass;
};

/**
 * Verify User Password safely (works for hashed or stored passwords)
 */
const verifyUserPassword = async (user, enteredPassword) => {
  if (!user || !enteredPassword) return false;
  if (user.password && user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
    return await bcrypt.compare(enteredPassword, user.password);
  }
  return user.password === enteredPassword;
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  getProfileByUserId,
  updateProfileByUserId,
  getDashboardDataByUserId,
  toggleLiveClassReminderByUserId,
  verifyUserPassword
};
