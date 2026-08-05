/**
 * Shared In-Memory Data Store for Users & Profiles
 * Serves as the single source of truth for auth, profile, and onboarding data.
 */

const users = new Map(); // email.toLowerCase() -> user object
const usersById = new Map(); // userId -> user object
const profiles = new Map(); // userId -> profile object

/**
 * Find user by email
 * @param {string} email 
 */
const findUserByEmail = (email) => {
  if (!email) return null;
  return users.get(email.toLowerCase().trim()) || null;
};

/**
 * Find user by ID
 * @param {string} id 
 */
const findUserById = (id) => {
  if (!id) return null;
  return usersById.get(id) || null;
};

/**
 * Create a new user and initialize empty profile
 * @param {Object} userData 
 */
const createUser = ({ fullName, email, password, role = 'student' }) => {
  const normalizedEmail = email.toLowerCase().trim();
  if (users.has(normalizedEmail)) {
    throw new Error('User already exists');
  }

  const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName || normalizedEmail)}`;

  const user = {
    id: userId,
    fullName,
    email: normalizedEmail,
    password, // Stored password
    role,
    avatarUrl,
    createdAt: new Date().toISOString()
  };

  users.set(normalizedEmail, user);
  usersById.set(userId, user);

  // Initialize corresponding user profile
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
 * @param {string} userId 
 */
const getProfileByUserId = (userId) => {
  if (!userId) return null;
  let profile = profiles.get(userId);
  if (!profile) {
    const user = findUserById(userId);
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
 * @param {string} userId 
 * @param {Object} updates 
 */
const updateProfileByUserId = (userId, updates) => {
  let profile = getProfileByUserId(userId);
  if (!profile) return null;

  Object.assign(profile, updates);
  profiles.set(userId, profile);
  return profile;
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  getProfileByUserId,
  updateProfileByUserId
};
