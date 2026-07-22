// Course Controller logic

const courses = [
  { id: 'c1', title: 'Fullstack Node.js & React', instructor: 'Samruddhi', duration: '8 weeks' },
  { id: 'c2', title: 'Data Structures & Algorithms', instructor: 'Eduflow Team', duration: '10 weeks' }
];

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = (req, res, next) => {
  try {
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
const getCourseById = (req, res, next) => {
  try {
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
const createCourse = (req, res, next) => {
  try {
    const { title, instructor, duration } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    const newCourse = {
      id: `c${courses.length + 1}`,
      title,
      instructor: instructor || 'Eduflow Instructor',
      duration: duration || '4 weeks'
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
