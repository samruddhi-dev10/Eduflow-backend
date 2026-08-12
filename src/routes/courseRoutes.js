const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCategories,
  getCourseById,
  createCourse,
  enrollCourse,
  getMyLearning,
  toggleSaveCourse,
  completeLesson
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getCourses);
router.get('/categories', getCategories);
router.get('/my-learning', protect, getMyLearning);
router.get('/:id', getCourseById);
router.post('/', protect, createCourse);
router.post('/:id/enroll', protect, enrollCourse);
router.post('/:id/save', protect, toggleSaveCourse);
router.post('/:id/complete-lesson', protect, completeLesson);
router.post('/:id/lessons/:lessonId/complete', protect, completeLesson);

module.exports = router;

