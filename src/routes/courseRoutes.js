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
  completeLesson,
  getCourseNotes,
  createCourseNote,
  deleteCourseNote,
  getCourseQna,
  createCourseQuestion,
  replyCourseQuestion,
  upvoteCourseQuestion,
  getCourseResources,
  downloadCourseResource,
  getLessonDetails,
  updateLessonProgress
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
router.get('/details', getCourseById);
router.get('/details/:id', getCourseById);
router.get('/:id', getCourseById);

// Course Actions
router.post('/enroll/:id', protect, enrollCourse);
router.post('/save/:id', protect, toggleSaveCourse);
router.post('/complete-lesson/:id', protect, completeLesson);

// Notes APIs (Notes Tab)
router.get('/:id/notes', protect, getCourseNotes);
router.post('/:id/notes', protect, createCourseNote);
router.delete('/:id/notes/:noteId', protect, deleteCourseNote);

// Q&A APIs (Q&A Discussion Tab)
router.get('/:id/qna', getCourseQna);
router.post('/:id/qna', protect, createCourseQuestion);
router.post('/:id/qna/:questionId/reply', protect, replyCourseQuestion);
router.post('/:id/qna/:questionId/upvote', protect, upvoteCourseQuestion);

// Course Resources APIs (Resources Tab & Download Resources Button)
router.get('/:id/resources', getCourseResources);
router.get('/:id/resources/:resourceId/download', downloadCourseResource);

// Lesson Switching & Playback Progress APIs
router.get('/:id/lessons/:lessonId', getLessonDetails);
router.post('/:id/lessons/:lessonId/progress', protect, updateLessonProgress);

module.exports = router;

