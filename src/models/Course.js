const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: 'General'
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    instructor: {
      type: String,
      default: 'Eduflow Instructor'
    },
    thumbnail: {
      type: String,
      default: ''
    },
    totalLessons: {
      type: Number,
      default: 10
    },
    rating: {
      type: Number,
      default: 4.8
    },
    studentsCount: {
      type: String,
      default: '1k students'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Course', courseSchema);
