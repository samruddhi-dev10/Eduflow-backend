const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    isOnboarded: {
      type: Boolean,
      default: false
    },
    onboardingStep: {
      type: Number,
      default: 1
    },
    primaryGoal: {
      type: String,
      default: ''
    },
    experienceLevel: {
      type: String,
      default: ''
    },
    learningStyle: {
      type: String,
      default: ''
    },
    weeklyCommitment: {
      type: String,
      default: ''
    },
    targetRole: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    interests: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Profile', profileSchema);
