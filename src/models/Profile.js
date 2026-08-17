const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Profile = sequelize.define(
  'Profile',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true
    },
    isOnboarded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    onboardingStep: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    primaryGoal: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    experienceLevel: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    learningStyle: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    weeklyCommitment: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    targetRole: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    bio: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    interests: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    goals: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    skills: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    headline: {
      type: DataTypes.STRING,
      defaultValue: 'Senior Product Designer & Lifelong Learner'
    },
    timezone: {
      type: DataTypes.STRING,
      defaultValue: 'Central European Time (CET) - UTC+1'
    },
    phoneNumber: {
      type: DataTypes.STRING,
      defaultValue: '+1 (555) 000-0000'
    },
    notifications: {
      type: DataTypes.JSON,
      defaultValue: {
        courseActivity: true,
        liveSessions: true,
        newsletter: false
      }
    },
    securitySettings: {
      type: DataTypes.JSON,
      defaultValue: {
        passwordLastChanged: 'Last changed 4 months ago',
        twoFactorEnabled: true,
        twoFactorMethod: 'Authenticator App'
      }
    },
    subscription: {
      type: DataTypes.JSON,
      defaultValue: {
        planName: 'EduFlow Pro Plan',
        price: '$19.99 per month',
        nextBillingDate: 'July 12, 2024',
        paymentMethod: 'Visa ending in 4242',
        status: 'Active'
      }
    }
  },
  {
    timestamps: true,
    tableName: 'profiles'
  }
);

module.exports = Profile;
