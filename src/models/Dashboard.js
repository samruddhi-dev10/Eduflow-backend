const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    stats: {
      currentStreakDays: { type: Number, default: 12 },
      timeLearnedHours: { type: Number, default: 24.5 },
      coursesCompleted: { type: Number, default: 8 }
    },
    liveClasses: [
      {
        id: String,
        timeLabel: String,
        title: String,
        instructor: String,
        action: String,
        meetingUrl: String,
        isReminderSet: { type: Boolean, default: false }
      }
    ],
    continueLearning: [
      {
        id: String,
        courseId: String,
        title: String,
        moduleLabel: String,
        progressPercent: Number,
        lessonsLeft: Number,
        totalLessons: Number,
        completedLessons: Number,
        thumbnail: String
      }
    ],
    recommended: [
      {
        id: String,
        title: String,
        rating: Number,
        studentsCount: String,
        category: String,
        level: String,
        icon: String
      }
    ],
    moduleExplorer: {
      title: { type: String, default: 'Module Explorer' },
      navigation: [
        { id: String, title: String, active: Boolean }
      ],
      resourceDownloadUrl: { type: String, default: '/api/dashboard/download-resources' }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Dashboard', dashboardSchema);
