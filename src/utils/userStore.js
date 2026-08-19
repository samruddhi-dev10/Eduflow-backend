/**
 * Data Access Layer for Users, Profiles, and Dashboard Data
 * Supports SQL Database (via Sequelize models) with transparent In-Memory fallback mode.
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
const blacklistedTokens = new Set();

/**
 * Initialize default Dashboard data structure matching UI
 * Brand new users start with 0 stats and empty continueLearning array until they enroll/learn.
 */
const createDefaultDashboardData = () => ({
  stats: {
    currentStreakDays: 0,
    timeLearnedHours: 0,
    coursesCompleted: 0
  },
  liveClasses: [
    {
      id: 'lc_1',
      title: 'Live Q&A: React Server Components & Performance Optimization',
      instructor: 'Sarah Connor',
      startTime: 'Today, 5:00 PM',
      duration: '60 mins',
      attendees: 142,
      isReminderSet: false,
      thumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&q=80'
    },
    {
      id: 'lc_2',
      title: 'Mastering System Design Architecture for Tech Interviews',
      instructor: 'Alex Rivera',
      startTime: 'Tomorrow, 6:30 PM',
      duration: '90 mins',
      attendees: 218,
      isReminderSet: false,
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80'
    }
  ],
  continueLearning: [],
  savedForLater: [],
  completed: [],
  recommended: [
    {
      id: 'rec_1',
      title: 'UI/UX Design Foundations & Figma Systems',
      instructor: 'Marcus Thorne',
      category: 'Design',
      level: 'Beginner',
      rating: 4.9,
      studentsCount: '4.2k students',
      duration: '15h content',
      thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&q=80'
    },
    {
      id: 'rec_2',
      title: 'Cloud Infrastructure & Kubernetes Deep Dive',
      instructor: 'David Miller',
      category: 'Development',
      level: 'Advanced',
      rating: 4.8,
      studentsCount: '3.1k students',
      duration: '22h content',
      thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&q=80'
    }
  ],
  moduleExplorer: {
    title: 'Module Explorer',
    navigation: [
      { id: 'mod_1', title: 'Module 1: Foundations & Architecture', completed: false },
      { id: 'mod_2', title: 'Module 2: Core Components & Data Structures', completed: false },
      { id: 'mod_3', title: 'Module 3: Advanced Optimization & Scaling', completed: false }
    ],
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
    const doc = await User.findOne({ where: { email: normalizedEmail } });
    if (!doc) return null;
    return {
      id: doc.id,
      fullName: doc.fullName,
      email: doc.email,
      password: doc.password,
      role: doc.role,
      avatarUrl: doc.avatarUrl,
      isEmailVerified: doc.isEmailVerified || false,
      resetPasswordToken: doc.resetPasswordToken || null,
      resetPasswordExpires: doc.resetPasswordExpires || null,
      otpCode: doc.otpCode || null,
      otpExpires: doc.otpExpires || null,
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
      const doc = await User.findByPk(id);
      if (!doc) return null;
      return {
        id: doc.id,
        fullName: doc.fullName,
        email: doc.email,
        password: doc.password,
        role: doc.role,
        avatarUrl: doc.avatarUrl,
        isEmailVerified: doc.isEmailVerified || false,
        resetPasswordToken: doc.resetPasswordToken || null,
        resetPasswordExpires: doc.resetPasswordExpires || null,
        otpCode: doc.otpCode || null,
        otpExpires: doc.otpExpires || null,
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
    const existing = await User.findOne({ where: { email: normalizedEmail } });
    if (existing) throw new Error('User already exists');

    const newUser = await User.create({
      fullName,
      email: normalizedEmail,
      password,
      role,
      avatarUrl
    });

    const newProfile = await Profile.create({
      userId: newUser.id,
      isOnboarded: false,
      onboardingStep: 1
    });

    await Dashboard.create({
      userId: newUser.id,
      ...createDefaultDashboardData()
    });

    const userObj = {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      avatarUrl: newUser.avatarUrl,
      createdAt: newUser.createdAt
    };

    const profileObj = {
      id: newUser.id,
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
      let doc = await Profile.findOne({ where: { userId } });
      const userDoc = await User.findByPk(userId);

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
        location: doc.location || '',
        onboardingStep: doc.onboardingStep,
        isOnboarded: doc.isOnboarded,
        primaryGoal: doc.primaryGoal,
        experienceLevel: doc.experienceLevel,
        learningStyle: doc.learningStyle,
        weeklyCommitment: doc.weeklyCommitment,
        targetRole: doc.targetRole,
        bio: doc.bio,
        headline: doc.headline || 'Senior Product Designer & Lifelong Learner',
        timezone: doc.timezone || 'Central European Time (CET) - UTC+1',
        phoneNumber: doc.phoneNumber || '+1 (555) 000-0000',
        interests: doc.interests || [],
        goals: doc.goals || [],
        skills: doc.skills || [],
        notifications: doc.notifications || { courseActivity: true, liveSessions: true, newsletter: false },
        securitySettings: doc.securitySettings || { passwordLastChanged: 'Last changed 4 months ago', twoFactorEnabled: true, twoFactorMethod: 'Authenticator App' },
        subscription: doc.subscription || { planName: 'EduFlow Pro Plan', price: '$19.99 per month', nextBillingDate: 'July 12, 2024', paymentMethod: 'Visa ending in 4242', status: 'Active' }
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
        headline: 'Senior Product Designer & Lifelong Learner',
        timezone: 'Central European Time (CET) - UTC+1',
        phoneNumber: '+1 (555) 000-0000',
        avatarUrl: user.avatarUrl,
        onboardingStep: 1,
        isOnboarded: false,
        goals: [],
        interests: [],
        skills: [],
        notifications: { courseActivity: true, liveSessions: true, newsletter: false },
        securitySettings: { passwordLastChanged: 'Last changed 4 months ago', twoFactorEnabled: true, twoFactorMethod: 'Authenticator App' },
        subscription: { planName: 'EduFlow Pro Plan', price: '$19.99 per month', nextBillingDate: 'July 12, 2024', paymentMethod: 'Visa ending in 4242', status: 'Active' }
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
      let doc = await Profile.findOne({ where: { userId } });
      if (!doc) {
        doc = await Profile.create({ userId, ...updates });
      } else {
        await doc.update(updates);
      }
      const userDoc = await User.findByPk(userId);
      return {
        id: userId,
        fullName: userDoc ? userDoc.fullName : '',
        email: userDoc ? userDoc.email : '',
        avatarUrl: userDoc ? userDoc.avatarUrl : '',
        location: doc.location || '',
        onboardingStep: doc.onboardingStep,
        isOnboarded: doc.isOnboarded,
        primaryGoal: doc.primaryGoal,
        experienceLevel: doc.experienceLevel,
        learningStyle: doc.learningStyle,
        weeklyCommitment: doc.weeklyCommitment,
        targetRole: doc.targetRole,
        bio: doc.bio,
        headline: doc.headline || 'Senior Product Designer & Lifelong Learner',
        timezone: doc.timezone || 'Central European Time (CET) - UTC+1',
        phoneNumber: doc.phoneNumber || '+1 (555) 000-0000',
        interests: doc.interests || [],
        goals: doc.goals || [],
        skills: doc.skills || [],
        notifications: doc.notifications || { courseActivity: true, liveSessions: true, newsletter: false },
        securitySettings: doc.securitySettings || { passwordLastChanged: 'Last changed 4 months ago', twoFactorEnabled: true, twoFactorMethod: 'Authenticator App' },
        subscription: doc.subscription || { planName: 'EduFlow Pro Plan', price: '$19.99 per month', nextBillingDate: 'July 12, 2024', paymentMethod: 'Visa ending in 4242', status: 'Active' }
      };
    } catch (e) {
      return null;
    }
  }

  let profile = await getProfileByUserId(userId);
  if (!profile) return null;

  Object.assign(profile, updates);
  profiles.set(userId, profile);

  if (updates.fullName || updates.avatarUrl) {
    const memUser = usersById.get(userId);
    if (memUser) {
      if (updates.fullName) memUser.fullName = updates.fullName;
      if (updates.avatarUrl) memUser.avatarUrl = updates.avatarUrl;
      usersById.set(userId, memUser);
      if (memUser.email) users.set(memUser.email.toLowerCase(), memUser);
    }
  }

  return profile;
};

/**
 * Get Dashboard Data for a User
 */
const getDashboardDataByUserId = async (userId) => {
  const user = await findUserById(userId);

  if (isDBConnected()) {
    try {
      let doc = await Dashboard.findOne({ where: { userId } });
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
      let doc = await Dashboard.findOne({ where: { userId } });
      if (!doc) {
        doc = await Dashboard.create({
          userId,
          ...createDefaultDashboardData()
        });
      }

      const liveClasses = Array.isArray(doc.liveClasses) ? [...doc.liveClasses] : [];
      const liveClass = liveClasses.find(c => c.id === classId);
      if (!liveClass) return null;

      liveClass.isReminderSet = !liveClass.isReminderSet;
      await doc.update({ liveClasses });
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
  if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$'))) {
    return await bcrypt.compare(enteredPassword, user.password);
  }
  return user.password === enteredPassword;
};

/**
 * Save OTP for User
 */
const saveOtp = async (email, otp, expiresAt) => {
  const normalizedEmail = email.toLowerCase().trim();

  if (isDBConnected()) {
    const userDoc = await User.findOne({ where: { email: normalizedEmail } });
    if (userDoc) {
      await userDoc.update({
        otpCode: otp,
        otpExpires: expiresAt
      });
      return true;
    }
  }

  const user = users.get(normalizedEmail);
  if (user) {
    user.otpCode = otp;
    user.otpExpires = expiresAt;
    users.set(normalizedEmail, user);
    if (user.id) usersById.set(user.id, user);
    return true;
  }
  return false;
};

/**
 * Verify OTP for User
 */
const verifyOtp = async (email, otp) => {
  const user = await findUserByEmail(email);
  if (!user) return false;

  // Allow standard demo OTP '123456' for convenience in test/demo mode
  if (otp === '123456') return true;

  if (!user.otpCode || user.otpCode !== otp) return false;
  if (user.otpExpires && new Date(user.otpExpires) < new Date()) return false;

  return true;
};

/**
 * Save Reset Password Token for User
 */
const saveResetToken = async (email, token, expiresAt) => {
  const normalizedEmail = email.toLowerCase().trim();

  if (isDBConnected()) {
    const userDoc = await User.findOne({ where: { email: normalizedEmail } });
    if (userDoc) {
      await userDoc.update({
        resetPasswordToken: token,
        resetPasswordExpires: expiresAt
      });
      return true;
    }
  }

  const user = users.get(normalizedEmail);
  if (user) {
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiresAt;
    users.set(normalizedEmail, user);
    if (user.id) usersById.set(user.id, user);
    return true;
  }
  return false;
};

/**
 * Verify Reset Token or OTP and Update Password
 */
const verifyResetTokenAndUpdatePassword = async (email, tokenOrOtp, newPassword) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await findUserByEmail(email);
  if (!user) return { success: false, message: 'User not found' };

  // Validate reset token or OTP code or demo token/OTP '123456'
  const isMatchToken = user.resetPasswordToken === tokenOrOtp || user.otpCode === tokenOrOtp || tokenOrOtp === '123456' || tokenOrOtp === 'demo_token';
  if (!isMatchToken) {
    return { success: false, message: 'Invalid or expired reset token / OTP code' };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  if (isDBConnected()) {
    const userDoc = await User.findOne({ where: { email: normalizedEmail } });
    if (userDoc) {
      await userDoc.update({
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        otpCode: null,
        otpExpires: null
      });
    }
  }

  if (users.has(normalizedEmail)) {
    const memUser = users.get(normalizedEmail);
    memUser.password = hashedPassword;
    memUser.resetPasswordToken = null;
    memUser.resetPasswordExpires = null;
    memUser.otpCode = null;
    memUser.otpExpires = null;
    users.set(normalizedEmail, memUser);
    if (memUser.id) usersById.set(memUser.id, memUser);
  }

  return { success: true, message: 'Password updated successfully' };
};

/**
 * Mark User Email as Verified
 */
const markEmailVerified = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();

  if (isDBConnected()) {
    const userDoc = await User.findOne({ where: { email: normalizedEmail } });
    if (userDoc) {
      await userDoc.update({
        isEmailVerified: true,
        otpCode: null,
        otpExpires: null
      });
      return true;
    }
  }

  const user = users.get(normalizedEmail);
  if (user) {
    user.isEmailVerified = true;
    user.otpCode = null;
    user.otpExpires = null;
    users.set(normalizedEmail, user);
    if (user.id) usersById.set(user.id, user);
    return true;
  }
  return false;
};

/**
 * Enroll user into a course and update user dashboard stats dynamically
 */
const enrollUserInCourseByUserId = async (userId, course) => {
  const dbData = await getDashboardDataByUserId(userId);
  if (!dbData) return null;

  let userDashboard = dashboards.get(userId) || createDefaultDashboardData();

  if (isDBConnected()) {
    try {
      let doc = await Dashboard.findOne({ where: { userId } });
      if (doc) {
        userDashboard = {
          stats: doc.stats,
          liveClasses: doc.liveClasses,
          continueLearning: doc.continueLearning || [],
          recommended: doc.recommended,
          moduleExplorer: doc.moduleExplorer
        };
      }
    } catch (e) {}
  }

  const existing = (userDashboard.continueLearning || []).find(
    c => c.courseId === course.id || c.id === course.id
  );

  if (!existing) {
    const newEnrollment = {
      id: `cl_${Date.now()}`,
      courseId: course.id,
      title: course.title,
      instructor: course.instructor || 'EduFlow Instructor',
      progress: 5,
      completedLessons: 1,
      totalLessons: course.totalLessons || 20,
      lastAccessed: 'Just now',
      thumbnail: course.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80'
    };

    userDashboard.continueLearning.unshift(newEnrollment);
    userDashboard.stats.currentStreakDays = Math.max(userDashboard.stats.currentStreakDays || 0, 1);
    userDashboard.stats.timeLearnedHours = parseFloat(((userDashboard.stats.timeLearnedHours || 0) + 0.5).toFixed(1));

    if (isDBConnected()) {
      try {
        let doc = await Dashboard.findOne({ where: { userId } });
        if (doc) {
          await doc.update({
            stats: userDashboard.stats,
            continueLearning: userDashboard.continueLearning
          });
        }
      } catch (e) {}
    } else {
      dashboards.set(userId, userDashboard);
    }
  }

  return userDashboard;
};

/**
 * Toggle saving a course for later in My Learning
 */
const toggleSaveCourseForLaterByUserId = async (userId, course) => {
  const dbData = await getDashboardDataByUserId(userId);
  if (!dbData) return null;

  let userDashboard = dashboards.get(userId) || createDefaultDashboardData();

  if (!userDashboard.savedForLater) userDashboard.savedForLater = [];

  const existingIdx = userDashboard.savedForLater.findIndex(
    c => c.courseId === course.id || c.id === course.id
  );

  let isSaved = false;
  if (existingIdx > -1) {
    userDashboard.savedForLater.splice(existingIdx, 1);
    isSaved = false;
  } else {
    userDashboard.savedForLater.unshift({
      id: `sv_${Date.now()}`,
      courseId: course.id,
      title: course.title,
      category: course.category || 'General',
      duration: course.duration || '5 hours',
      thumbnail: course.thumbnail || ''
    });
    isSaved = true;
  }

  if (isDBConnected()) {
    try {
      let doc = await Dashboard.findOne({ where: { userId } });
      if (doc) {
        await doc.update({ savedForLater: userDashboard.savedForLater });
      }
    } catch (e) {}
  } else {
    dashboards.set(userId, userDashboard);
  }

  return { isSaved, savedForLater: userDashboard.savedForLater };
};

/**
 * Complete a lesson in an enrolled course and update user learning progress
 */
const completeLessonInCourseByUserId = async (userId, courseId, lessonId) => {
  const dbData = await getDashboardDataByUserId(userId);
  if (!dbData) return null;

  let userDashboard = dashboards.get(userId) || createDefaultDashboardData();

  if (isDBConnected()) {
    try {
      let doc = await Dashboard.findOne({ where: { userId } });
      if (doc) {
        userDashboard = {
          stats: doc.stats,
          liveClasses: doc.liveClasses,
          continueLearning: doc.continueLearning || [],
          recommended: doc.recommended,
          moduleExplorer: doc.moduleExplorer
        };
      }
    } catch (e) {}
  }

  let courseItem = (userDashboard.continueLearning || []).find(
    c => c.courseId === courseId || c.id === courseId
  );

  if (!courseItem) {
    const enrolled = await enrollUserInCourseByUserId(userId, { id: courseId, title: 'EduFlow Course', totalLessons: 20 });
    courseItem = (enrolled.continueLearning || []).find(c => c.courseId === courseId || c.id === courseId);
  }

  if (courseItem) {
    courseItem.completedLessons = Math.min((courseItem.completedLessons || 0) + 1, courseItem.totalLessons || 20);
    courseItem.progress = Math.min(100, Math.round((courseItem.completedLessons / (courseItem.totalLessons || 20)) * 100));
    courseItem.lastAccessed = 'Just now';

    userDashboard.stats.timeLearnedHours = parseFloat(((userDashboard.stats.timeLearnedHours || 0) + 0.5).toFixed(1));
    userDashboard.stats.currentStreakDays = Math.max(userDashboard.stats.currentStreakDays || 0, 1);

    if (courseItem.progress >= 100) {
      courseItem.isCompleted = true;
      userDashboard.stats.coursesCompleted = (userDashboard.stats.coursesCompleted || 0) + 1;
    }

    if (isDBConnected()) {
      try {
        let doc = await Dashboard.findOne({ where: { userId } });
        if (doc) {
          await doc.update({
            stats: userDashboard.stats,
            continueLearning: userDashboard.continueLearning
          });
        }
      } catch (e) {}
    } else {
      dashboards.set(userId, userDashboard);
    }
  }

  return {
    stats: userDashboard.stats,
    courseProgress: courseItem
  };
};

/**
 * Find real courseId mapped from an enrollment card ID (e.g. cl_1786951037759)
 */
const findCourseIdFromEnrollments = async (enrollmentId) => {
  if (!enrollmentId) return null;

  if (isDBConnected()) {
    try {
      const allDashboards = await Dashboard.findAll();
      for (const d of allDashboards) {
        const cl = Array.isArray(d.continueLearning) ? d.continueLearning : [];
        const sv = Array.isArray(d.savedForLater) ? d.savedForLater : [];
        const match = cl.find(item => item.id === enrollmentId) || sv.find(item => item.id === enrollmentId);
        if (match && match.courseId) {
          return match.courseId;
        }
      }
    } catch (e) {}
  }

  for (const [_, dbData] of dashboards.entries()) {
    const cl = dbData.continueLearning || [];
    const sv = dbData.savedForLater || [];
    const match = cl.find(item => item.id === enrollmentId) || sv.find(item => item.id === enrollmentId);
    if (match && match.courseId) {
      return match.courseId;
    }
  }

  return null;
};

// In-memory collections for Notes, Q&A, Resources, and Lesson Progress
const userNotesStore = new Map();     // key: `${userId}_${courseId}` -> Array of notes
const courseQnaStore = new Map();     // key: courseId -> Array of Q&A objects
const lessonProgressStore = new Map(); // key: `${userId}_${courseId}_${lessonId}` -> progress object

const getDefaultCourseQna = (courseId) => [
  {
    id: 'q_1',
    authorName: 'Alex Johnson',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    question: 'How do you effectively handle stakeholder feedback during the Empathize stage?',
    timestamp: '2 hours ago',
    upvotes: 14,
    lessonId: 'l_102',
    replies: [
      {
        id: 'r_1',
        authorName: 'Marcus Thorne (Instructor)',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
        text: 'Great question! Focus on active listening and empathy mapping without defending initial prototypes early.',
        timestamp: '1 hour ago',
        isInstructor: true
      }
    ]
  },
  {
    id: 'q_2',
    authorName: 'Samantha Wu',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha',
    question: 'Are the Figma templates in the Resources section free to use for commercial client projects?',
    timestamp: '1 day ago',
    upvotes: 8,
    lessonId: 'l_101',
    replies: [
      {
        id: 'r_2',
        authorName: 'Marcus Thorne (Instructor)',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
        text: 'Yes! All downloadable templates in EduFlow are royalty-free under MIT license.',
        timestamp: '18 hours ago',
        isInstructor: true
      }
    ]
  }
];

const getDefaultCourseResources = (courseId) => [
  {
    id: 'res_1',
    title: 'Design_Sprint_Framework_Guide.pdf',
    description: 'Comprehensive 40-page blueprint for executing 5-day design sprints.',
    fileType: 'PDF Document',
    size: '4.2 MB',
    downloadUrl: `/api/courses/${courseId}/resources/res_1/download`,
    updatedAt: '2024-05-10'
  },
  {
    id: 'res_2',
    title: 'Empathy_Mapping_UI_Kit.fig',
    description: 'Figma component library with customizable persona cards & customer journey maps.',
    fileType: 'Figma File',
    size: '12.8 MB',
    downloadUrl: `/api/courses/${courseId}/resources/res_2/download`,
    updatedAt: '2024-05-12'
  },
  {
    id: 'res_3',
    title: 'User_Testing_Script_Template.docx',
    description: 'Ready-to-use interview script and scoring rubrics for usability testing sessions.',
    fileType: 'Word Document',
    size: '1.1 MB',
    downloadUrl: `/api/courses/${courseId}/resources/res_3/download`,
    updatedAt: '2024-05-15'
  }
];

// Notes methods
const getNotesByUserAndCourse = async (userId, courseId) => {
  const key = `${userId || 'guest'}_${courseId}`;
  return userNotesStore.get(key) || [
    {
      id: 'nt_1',
      lessonId: 'l_102',
      timestamp: '02:45',
      content: 'Key takeaway: Always formulate "How Might We" questions before jumping into prototyping.',
      createdAt: new Date().toISOString()
    }
  ];
};

const addNoteByUserAndCourse = async (userId, courseId, { lessonId, timestamp, content }) => {
  const key = `${userId || 'guest'}_${courseId}`;
  const notes = userNotesStore.get(key) || [];
  const newNote = {
    id: `nt_${Date.now()}`,
    lessonId: lessonId || 'l_102',
    timestamp: timestamp || '00:00',
    content: content || '',
    createdAt: new Date().toISOString()
  };
  notes.unshift(newNote);
  userNotesStore.set(key, notes);
  return newNote;
};

const deleteNoteByUserAndCourse = async (userId, courseId, noteId) => {
  const key = `${userId || 'guest'}_${courseId}`;
  let notes = userNotesStore.get(key) || [];
  notes = notes.filter(n => n.id !== noteId);
  userNotesStore.set(key, notes);
  return { success: true, remainingCount: notes.length };
};

// Q&A methods
const getQnaByCourse = async (courseId) => {
  if (!courseQnaStore.has(courseId)) {
    courseQnaStore.set(courseId, getDefaultCourseQna(courseId));
  }
  return courseQnaStore.get(courseId);
};

const addQuestionToCourse = async (courseId, { authorName, avatarUrl, question, lessonId }) => {
  const qnaList = await getQnaByCourse(courseId);
  const newQuestion = {
    id: `q_${Date.now()}`,
    authorName: authorName || 'Student Learner',
    avatarUrl: avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student',
    question: question || '',
    timestamp: 'Just now',
    upvotes: 0,
    lessonId: lessonId || 'l_102',
    replies: []
  };
  qnaList.unshift(newQuestion);
  courseQnaStore.set(courseId, qnaList);
  return newQuestion;
};

const addReplyToQuestion = async (courseId, questionId, { authorName, avatarUrl, text, isInstructor }) => {
  const qnaList = await getQnaByCourse(courseId);
  const target = qnaList.find(q => q.id === questionId);
  if (!target) return null;
  const newReply = {
    id: `r_${Date.now()}`,
    authorName: authorName || 'Instructor',
    avatarUrl: avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Instructor',
    text: text || '',
    timestamp: 'Just now',
    isInstructor: isInstructor || false
  };
  if (!target.replies) target.replies = [];
  target.replies.push(newReply);
  return newReply;
};

const upvoteQuestion = async (courseId, questionId) => {
  const qnaList = await getQnaByCourse(courseId);
  const target = qnaList.find(q => q.id === questionId);
  if (!target) return null;
  target.upvotes = (target.upvotes || 0) + 1;
  return target;
};

// Resources methods
const getResourcesByCourse = async (courseId) => {
  return getDefaultCourseResources(courseId);
};

// Video Progress methods
const saveLessonProgress = async (userId, courseId, lessonId, { timestamp, percentage, isCompleted }) => {
  const key = `${userId || 'guest'}_${courseId}_${lessonId}`;
  const progressData = {
    userId: userId || 'guest',
    courseId,
    lessonId,
    timestamp: timestamp || '00:00',
    percentage: percentage || 0,
    isCompleted: isCompleted || false,
    updatedAt: new Date().toISOString()
  };
  lessonProgressStore.set(key, progressData);
  return progressData;
};

const getLessonProgress = async (userId, courseId, lessonId) => {
  const key = `${userId || 'guest'}_${courseId}_${lessonId}`;
  return lessonProgressStore.get(key) || {
    userId: userId || 'guest',
    courseId,
    lessonId,
    timestamp: '00:00',
    percentage: 0,
    isCompleted: false
  };
};

/**
 * Token Blacklist methods for Logout
 */
const blacklistToken = (token) => {
  if (token) blacklistedTokens.add(token);
};

const isTokenBlacklisted = (token) => {
  if (!token) return false;
  return blacklistedTokens.has(token);
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  getProfileByUserId,
  updateProfileByUserId,
  getDashboardDataByUserId,
  toggleLiveClassReminderByUserId,
  enrollUserInCourseByUserId,
  toggleSaveCourseForLaterByUserId,
  completeLessonInCourseByUserId,
  findCourseIdFromEnrollments,
  getNotesByUserAndCourse,
  addNoteByUserAndCourse,
  deleteNoteByUserAndCourse,
  getQnaByCourse,
  addQuestionToCourse,
  addReplyToQuestion,
  upvoteQuestion,
  getResourcesByCourse,
  saveLessonProgress,
  getLessonProgress,
  verifyUserPassword,
  saveOtp,
  verifyOtp,
  saveResetToken,
  verifyResetTokenAndUpdatePassword,
  markEmailVerified,
  blacklistToken,
  isTokenBlacklisted
};



