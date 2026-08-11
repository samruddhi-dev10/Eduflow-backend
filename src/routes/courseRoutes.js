const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCategories,
  getCourseById,
  createCourse,
  enrollCourse
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getCourses);
router.get('/categories', getCategories);
router.get('/:id', getCourseById);
router.post('/', protect, createCourse);
router.post('/:id/enroll', protect, enrollCourse);

module.exports = router;
