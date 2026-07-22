const express = require('express');
const router = express.Router();
const { getCourses, getCourseById, createCourse } = require('../controllers/courseController');

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', createCourse);

module.exports = router;
