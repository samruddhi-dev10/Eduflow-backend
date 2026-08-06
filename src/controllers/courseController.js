// Course Controller logic with Database integration
const Course = require('../models/Course');
const { isDBConnected } = require('../config/db');

// In-memory course storage fallback
const courses = [];

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
  try {
    if (isDBConnected()) {
      const dbCourses = await Course.find();
      return res.status(200).json({
        success: true,
        count: dbCourses.length,
        data: dbCourses
      });
    }

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res, next) => {
  try {
    if (isDBConnected()) {
      const course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
      return res.status(200).json({ success: true, data: course });
    }

    const course = courses.find(c => c.id === req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private / Instructor
const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, level, instructor, thumbnail, totalLessons } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    if (isDBConnected()) {
      const newCourse = await Course.create({
        title,
        description: description || '',
        category: category || 'General',
        level: level || 'Beginner',
        instructor: instructor || req.user?.fullName || 'Eduflow Instructor',
        thumbnail: thumbnail || '',
        totalLessons: totalLessons || 10
      });
      return res.status(201).json({ success: true, data: newCourse });
    }

    const newCourse = {
      id: `c_${Date.now()}`,
      title,
      description: description || '',
      category: category || 'General',
      level: level || 'Beginner',
      instructor: instructor || req.user?.fullName || 'Eduflow Instructor',
      thumbnail: thumbnail || '',
      totalLessons: totalLessons || 10,
      createdAt: new Date().toISOString()
    };
    courses.push(newCourse);
    res.status(201).json({ success: true, data: newCourse });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse
};
