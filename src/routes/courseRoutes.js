const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCategories,
  getCourseById,
  getCourseLearn,
  createCourse,
  enrollCourse,
  getMyLearning,
  toggleSaveCourse,
  completeLesson
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

// Course Catalog & Metadata
router.get('/', getCourses);
router.get('/categories', getCategories);
router.get('/my-learning', protect, getMyLearning);

// Course Creation
router.post('/create', protect, createCourse);

// Course Learn / Player Page (Continue Lesson)
router.get('/learn/:id', getCourseLearn);
router.get('/details/:id/learn', getCourseLearn);

// Single Course Details
router.get('/details/:id', getCourseById);

// Course Actions
router.post('/enroll/:id', protect, enrollCourse);
router.post('/save/:id', protect, toggleSaveCourse);
router.post('/complete-lesson/:id', protect, completeLesson);

module.exports = router;

