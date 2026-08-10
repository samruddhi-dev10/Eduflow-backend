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
    }
  },
  {
    timestamps: true
  }
);

module.exports = Profile;
