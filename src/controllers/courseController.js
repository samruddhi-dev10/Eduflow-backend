// Course Controller logic with SQL Database integration and rich query filters
const Course = require('../models/Course');
const { sequelize, isDBConnected } = require('../config/db');
const { Op } = require('sequelize');

// In-memory course storage fallback with full catalog demo dataset
const fallbackCourses = [
  {
    id: 'c_1',
    title: 'Advanced Machine Learning with Python',
    description: 'Master deep learning architectures, reinforcement learning, and productionizing ML models with Python.',
    category: 'Data Science',
    level: 'Advanced',
    instructor: 'Dr. Sarah Jenkins',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80',
    totalLessons: 48,
    totalModules: 12,
    duration: '24h content',
    rating: 4.9,
    studentsCount: '4.5k students',
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 'c_2',
    title: 'Design Thinking Foundations',
    description: 'Learn human-centered problem solving, wireframing, prototyping, and user journey mapping.',
    category: 'Design',
    level: 'Beginner',
    instructor: 'Marcus Thorne',
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&q=80',
    totalLessons: 32,
    totalModules: 8,
    duration: '15h content',
    rating: 4.8,
    studentsCount: '2.1k students',
    createdAt: new Date('2024-02-01').toISOString()
  },
  {
    id: 'c_3',
    title: 'Strategic Project Management',
    description: 'Drive high-impact enterprise projects using Agile, Scrum, Kanban, and modern leadership frameworks.',
    category: 'Business',
    level: 'Intermediate',
    instructor: 'Elena Rodriguez',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80',
    totalLessons: 40,
    totalModules: 10,
    duration: '18h content',
    rating: 4.7,
    studentsCount: '3.8k students',
    createdAt: new Date('2024-02-10').toISOString()
  },
  {
    id: 'c_4',
    title: 'Blockchain & Future Markets',
    description: 'Understand decentralized protocols, smart contracts, Web3 economics, and crypto assets.',
    category: 'Finance',
    level: 'Advanced',
    instructor: 'Jameson Blackwood',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&q=80',
    totalLessons: 56,
    totalModules: 14,
    duration: '30h content',
    rating: 4.9,
    studentsCount: '1.9k students',
    createdAt: new Date('2024-03-01').toISOString()
  },
  {
    id: 'c_5',
    title: 'Emotional Intelligence for Leaders',
    description: 'Develop executive presence, empathy, dispute resolution skills, and resilient team management.',
    category: 'Development',
    level: 'Beginner',
    instructor: 'Dr. Linda Zhang',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&q=80',
    totalLessons: 24,
    totalModules: 6,
    duration: '10h content',
    rating: 4.6,
    studentsCount: '1.2k students',
    createdAt: new Date('2024-03-15').toISOString()
  },
  {
    id: 'c_6',
    title: 'Data-Driven Decision Making',
    description: 'Transform raw corporate data into actionable business intelligence using statistical analysis & dashboards.',
    category: 'Analytics',
    level: 'Intermediate',
    instructor: 'Robert Chen',
    thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=500&q=80',
    totalLessons: 44,
    totalModules: 11,
    duration: '20h content',
    rating: 4.8,
    studentsCount: '2.9k students',
    createdAt: new Date('2024-04-01').toISOString()
  },
  {
    id: 'c_7',
    title: 'Full-Stack Web Development Bootcamp',
    description: 'Master HTML, CSS, JavaScript, React, Node.js, and Express by building production-ready apps.',
    category: 'Development',
    level: 'Beginner',
    instructor: 'Alex Johnson',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80',
    totalLessons: 64,
    totalModules: 16,
    duration: '40h content',
    rating: 4.9,
    studentsCount: '5.4k students',
    createdAt: new Date('2024-04-10').toISOString()
  },
  {
    id: 'c_8',
    title: 'Generative AI & LLM Engineering',
    description: 'Build RAG pipelines, fine-tune open source LLMs, and deploy AI assistants with LangChain.',
    category: 'Data Science',
    level: 'Advanced',
    instructor: 'Dr. Sophia Vance',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&q=80',
    totalLessons: 60,
    totalModules: 15,
    duration: '35h content',
    rating: 4.95,
    studentsCount: '6.1k students',
    createdAt: new Date('2024-04-20').toISOString()
  },
  {
    id: 'c_9',
    title: 'Product Strategy & Growth Marketing',
    description: 'Scale products from 0 to 1 million users using data funnel optimization and modern product design.',
    category: 'Business',
    level: 'Intermediate',
    instructor: 'Sarah Connor',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&q=80',
    totalLessons: 36,
    totalModules: 9,
    duration: '16h content',
    rating: 4.75,
    studentsCount: '3.1k students',
    createdAt: new Date('2024-05-01').toISOString()
  },
  {
    id: 'c_10',
    title: 'Cybersecurity Fundamentals & Threat Intel',
    description: 'Learn ethical hacking, network defense mechanisms, zero trust architecture, and cloud security.',
    category: 'Development',
    level: 'Intermediate',
    instructor: 'Michael Brown',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&q=80',
    totalLessons: 48,
    totalModules: 12,
    duration: '22h content',
    rating: 4.85,
    studentsCount: '2.7k students',
    createdAt: new Date('2024-05-15').toISOString()
  },
  {
    id: 'c_11',
    title: 'UI/UX Design Systems & Figma Mastery',
    description: 'Architect scalable design tokens, component libraries, and interactive prototypes for web & mobile.',
    category: 'Design',
    level: 'Intermediate',
    instructor: 'Emily Carter',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&q=80',
    totalLessons: 40,
    totalModules: 10,
    duration: '18h content',
    rating: 4.8,
    studentsCount: '4.2k students',
    createdAt: new Date('2024-06-01').toISOString()
  },
  {
    id: 'c_12',
    title: 'Financial Modeling & Venture Capital',
    description: 'Master discounted cash flow analysis, cap tables, valuation techniques, and startup financing pitch decks.',
    category: 'Finance',
    level: 'Advanced',
    instructor: 'Jameson Blackwood',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&q=80',
    totalLessons: 52,
    totalModules: 13,
    duration: '28h content',
    rating: 4.9,
    studentsCount: '1.7k students',
    createdAt: new Date('2024-06-15').toISOString()
  }
];

// @desc    Get all courses (with category filter, difficulty level, search, sort, and pagination)
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
  try {
    const {
      category = 'All',
      level = 'All Levels',
      search = '',
      sort = 'Popularity',
      page = 1,
      limit = 6
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 6;
    const offset = (pageNum - 1) * limitNum;

    if (isDBConnected()) {
      const whereCondition = {};
      const dialect = (sequelize && sequelize.getDialect) ? sequelize.getDialect() : 'mysql';
      const likeOp = dialect === 'postgres' ? Op.iLike : Op.like;

      if (category && category !== 'All') {
        whereCondition.category = { [likeOp]: `%${category}%` };
      }

      if (level && level !== 'All Levels') {
        whereCondition.level = level;
      }

      if (search && search.trim() !== '') {
        const queryStr = `%${search.trim()}%`;
        whereCondition[Op.or] = [
          { title: { [likeOp]: queryStr } },
          { description: { [likeOp]: queryStr } },
          { instructor: { [likeOp]: queryStr } },
          { category: { [likeOp]: queryStr } }
        ];
      }

      let orderClause = [['createdAt', 'DESC']];
      if (sort === 'Popularity') {
        orderClause = [['rating', 'DESC'], ['studentsCount', 'DESC']];
      } else if (sort === 'Newest') {
        orderClause = [['createdAt', 'DESC']];
      } else if (sort === 'Rating') {
        orderClause = [['rating', 'DESC']];
      }

      const { count, rows } = await Course.findAndCountAll({
        where: whereCondition,
        order: orderClause,
        limit: limitNum,
        offset: offset
      });

      const totalPages = Math.ceil(count / limitNum) || 1;

      return res.status(200).json({
        success: true,
        count: rows.length,
        totalCourses: count,
        page: pageNum,
        totalPages,
        hasMore: pageNum < totalPages,
        data: rows
      });
    }

    // In-memory Fallback Filter Logic
    let filtered = [...fallbackCourses];

    if (category && category !== 'All') {
      filtered = filtered.filter(c => c.category.toLowerCase().includes(category.toLowerCase()));
    }

    if (level && level !== 'All Levels') {
      filtered = filtered.filter(c => c.level.toLowerCase() === level.toLowerCase());
    }

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }

    if (sort === 'Popularity') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'Newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'Rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    const totalCourses = filtered.length;
    const totalPages = Math.ceil(totalCourses / limitNum) || 1;
    const paginated = filtered.slice(offset, offset + limitNum);

    res.status(200).json({
      success: true,
      count: paginated.length,
      totalCourses,
      page: pageNum,
      totalPages,
      hasMore: pageNum < totalPages,
      data: paginated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all distinct course categories
// @route   GET /api/courses/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    if (isDBConnected()) {
      const categories = await Course.findAll({
        attributes: ['category'],
        group: ['category']
      });
      const catList = ['All', ...new Set(categories.map(c => c.category))];
      return res.status(200).json({ success: true, data: catList });
    }

    const catList = ['All', ...new Set(fallbackCourses.map(c => c.category))];
    res.status(200).json({ success: true, data: catList });
  } catch (error) {
    next(error);
  }
};

const generateDefaultModules = (title) => [
  {
    id: 'm_1',
    title: 'Module 1: Foundations & Core Architecture',
    lessons: [
      {
        id: 'l_1',
        title: `1.1 Introduction to ${title}`,
        duration: '15 mins',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        type: 'video',
        isCompleted: false
      },
      {
        id: 'l_2',
        title: '1.2 Environment Setup & Tools Configuration',
        duration: '20 mins',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        type: 'video',
        isCompleted: false
      },
      {
        id: 'l_3',
        title: '1.3 Fundamental Syntax & Core Concepts',
        duration: '25 mins',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        type: 'video',
        isCompleted: false
      }
    ]
  },
  {
    id: 'm_2',
    title: 'Module 2: Deep Dive & Practical Implementation',
    lessons: [
      {
        id: 'l_4',
        title: '2.1 Building Scalable Real-World Modules',
        duration: '35 mins',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        type: 'video',
        isCompleted: false
      },
      {
        id: 'l_5',
        title: '2.2 Advanced State Management & Data Flows',
        duration: '40 mins',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        type: 'video',
        isCompleted: false
      }
    ]
  },
  {
    id: 'm_3',
    title: 'Module 3: Capstone Project & Deployment',
    lessons: [
      {
        id: 'l_6',
        title: '3.1 Building the Capstone Project',
        duration: '45 mins',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        type: 'video',
        isCompleted: false
      },
      {
        id: 'l_7',
        title: '3.2 Production Deployment & Performance Optimization',
        duration: '30 mins',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        type: 'video',
        isCompleted: false
      }
    ]
  }
];

// @desc    Get single course by ID with detailed curriculum/modules
// @route   GET /api/courses/details?id=... & GET /api/courses/details/:id
// @access  Public
const getCourseById = async (req, res, next) => {
  try {
    const courseId = req.params.id || req.query.id;
    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Course ID parameter is required' });
    }

    let courseData = null;

    if (isDBConnected()) {
      const dbCourse = await Course.findByPk(courseId);
      if (dbCourse) {
        courseData = dbCourse.toJSON ? dbCourse.toJSON() : dbCourse;
      }
    }

    if (!courseData) {
      courseData = fallbackCourses.find(c => c.id === courseId || c.id === `c_${courseId}`);
    }

    if (!courseData) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (!courseData.modules || courseData.modules.length === 0) {
      courseData.modules = generateDefaultModules(courseData.title);
    }

    res.status(200).json({ success: true, data: courseData });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private / Instructor
const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, level, instructor, thumbnail, totalLessons, totalModules, duration, modules } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const courseModules = modules && modules.length > 0 ? modules : generateDefaultModules(title);

    if (isDBConnected()) {
      const newCourse = await Course.create({
        title,
        description: description || '',
        category: category || 'General',
        level: level || 'Beginner',
        instructor: instructor || req.user?.fullName || 'Eduflow Instructor',
        thumbnail: thumbnail || '',
        totalLessons: totalLessons || 10,
        totalModules: totalModules || 10,
        duration: duration || '10h content',
        modules: courseModules
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
      totalModules: totalModules || 10,
      duration: duration || '10h content',
      rating: 4.8,
      studentsCount: '1 student',
      modules: courseModules,
      createdAt: new Date().toISOString()
    };
    fallbackCourses.unshift(newCourse);
    res.status(201).json({ success: true, data: newCourse });
  } catch (error) {
    next(error);
  }
};

const {
  enrollUserInCourseByUserId,
  toggleSaveCourseForLaterByUserId,
  completeLessonInCourseByUserId,
  getDashboardDataByUserId
} = require('../utils/userStore');

// @desc    Enroll user into a course
// @route   POST /api/courses/:id/enroll
// @access  Private
const enrollCourse = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const courseId = req.params.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let targetCourse = null;
    if (isDBConnected()) {
      targetCourse = await Course.findByPk(courseId);
    }

    if (!targetCourse) {
      targetCourse = fallbackCourses.find(c => c.id === courseId || c.id === `c_${courseId}`) || {
        id: courseId,
        title: 'EduFlow Learning Course',
        instructor: 'EduFlow Faculty',
        totalLessons: 20
      };
    }

    const updatedDashboard = await enrollUserInCourseByUserId(userId, targetCourse);

    res.status(200).json({
      success: true,
      message: `Successfully enrolled in "${targetCourse.title}"`,
      enrolledAt: new Date().toISOString(),
      dashboard: updatedDashboard
    });
  } catch (error) {
    next(error);
  }
};

const formatMyLearningCard = (item) => {
  const progress = item.progress || 0;
  let actionButtonText = item.actionButtonText;
  if (!actionButtonText) {
    if (progress >= 85 && progress < 100) {
      actionButtonText = 'Finish Module';
    } else if (progress >= 40 && progress < 85) {
      actionButtonText = 'Resume Module';
    } else {
      actionButtonText = 'Continue Lesson';
    }
  }

  const hoursLeftCalc = Math.max(1, Math.round((1 - progress / 100) * 10));
  const timeLeftFormatted = item.timeLeft || (progress >= 100 ? 'Completed' : `${hoursLeftCalc}h left`);

  return {
    id: item.id || `cl_${item.courseId}`,
    courseId: item.courseId || item.id,
    title: item.title,
    category: item.category || 'General',
    instructor: item.instructor || 'EduFlow Instructor',
    progress: progress,
    completedLessons: item.completedLessons || Math.round((progress / 100) * (item.totalLessons || 20)),
    totalLessons: item.totalLessons || 20,
    timeLeft: timeLeftFormatted,
    actionButtonText: actionButtonText,
    lastAccessed: item.lastAccessed || 'Recently',
    thumbnail: item.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80',
    isCompleted: progress >= 100
  };
};

// @desc    Get user's enrolled courses (My Learning payload for Tabs: All, In Progress, Saved for Later, Completed)
// @route   GET /api/courses/my-learning
// @access  Private
const getMyLearning = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { category = 'All', sort = 'Recently Accessed', tab = 'all' } = req.query;
    const dashboard = await getDashboardDataByUserId(userId);

    let userEnrolled = (dashboard?.continueLearning || []).map(formatMyLearningCard);
    let userSaved = dashboard?.savedForLater || [];
    let userCompleted = (dashboard?.completed || []).concat(userEnrolled.filter(c => c.isCompleted));

    let inProgress = userEnrolled.filter(c => !c.isCompleted);

    // Apply category filtering
    if (category && category !== 'All') {
      inProgress = inProgress.filter(c => c.category.toLowerCase().includes(category.toLowerCase()));
      userSaved = userSaved.filter(c => (c.category || '').toLowerCase().includes(category.toLowerCase()));
    }

    // Apply sorting
    if (sort === 'Progress: High to Low') {
      inProgress.sort((a, b) => b.progress - a.progress);
    } else if (sort === 'Progress: Low to High') {
      inProgress.sort((a, b) => a.progress - b.progress);
    }

    const allCourses = [...inProgress, ...userCompleted];

    res.status(200).json({
      success: true,
      data: {
        activeCount: inProgress.length,
        showingCountText: `Showing ${allCourses.length} of ${allCourses.length + userSaved.length} courses`,
        inProgress,
        savedForLater: userSaved,
        completed: userCompleted,
        all: allCourses,
        totalEnrolled: allCourses.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle saving a course for later
// @route   POST /api/courses/:id/save
// @access  Private
const toggleSaveCourse = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const courseId = req.params.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let targetCourse = null;
    if (isDBConnected()) {
      targetCourse = await Course.findByPk(courseId);
    }

    if (!targetCourse) {
      targetCourse = fallbackCourses.find(c => c.id === courseId || c.id === `c_${courseId}`) || {
        id: courseId,
        title: 'EduFlow Course',
        category: 'General',
        duration: '5 hours'
      };
    }

    const result = await toggleSaveCourseForLaterByUserId(userId, targetCourse);

    res.status(200).json({
      success: true,
      message: result.isSaved ? 'Course saved for later' : 'Course removed from saved',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a lesson as completed & update user progress
// @route   POST /api/courses/:id/complete-lesson & POST /api/courses/:id/lessons/:lessonId/complete
// @access  Private
const completeLesson = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const courseId = req.params.id;
    const lessonId = req.body?.lessonId || req.params.lessonId || 'l_1';

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const result = await completeLessonInCourseByUserId(userId, courseId, lessonId);

    res.status(200).json({
      success: true,
      message: 'Lesson marked as completed!',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get full course player & learn page payload for Continue Lesson UI
 * @route   GET /api/courses/learn/:id & GET /api/courses/details/:id/learn
 * @access  Private / Public
 */
const getCourseLearn = async (req, res, next) => {
  try {
    const id = req.params.id;
    let courseData = null;

    if (isDBConnected()) {
      const dbCourse = await Course.findByPk(id);
      if (dbCourse) {
        courseData = dbCourse.toJSON ? dbCourse.toJSON() : dbCourse;
      }
    }

    if (!courseData) {
      courseData = fallbackCourses.find(c => c.id === id || c.id === `c_${id}`);
    }

    if (!courseData) {
      courseData = {
        id: id,
        title: 'Design Thinking Foundations',
        description: 'Welcome to the core module of our Project Management series. In this lesson, we explore the foundational principles of Design Thinking and how it integrates into modern agile workflows. We\'ll cover the five stages: Empathize, Define, Ideate, Prototype, and Test.',
        category: 'Design Thinking',
        level: 'Beginner',
        instructor: 'Marcus Thorne'
      };
    }

    const defaultModules = generateDefaultModules(courseData.title);

    const learnPayload = {
      courseId: courseData.id,
      courseTitle: courseData.title,
      category: courseData.category || 'Design Thinking',
      moduleTitle: 'Introduction',
      moduleProgress: 'Module 1 of 12',
      activeLesson: {
        lessonId: 'l_102',
        title: `Introduction to ${courseData.title}`,
        duration: '5:20',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        description: courseData.description || 'Welcome to the core module of our series. In this lesson, we explore foundational principles and practical workflows.',
        keyObjectives: [
          'Define customer pain points through empathy mapping',
          'Integrate design sprints into product roadmaps',
          'Validate early prototypes with real user testing'
        ],
        proTips: 'Always start with "How Might We" questions before jumping into mental models. It opens up creative problem spaces without premature constraints.'
      },
      playlist: [
        { id: 'l_101', title: 'Course Overview', duration: '3:45', completed: true, isLocked: false },
        { id: 'l_102', title: 'Introduction', duration: '5:20', completed: false, isLocked: false, active: true },
        { id: 'l_103', title: 'Understanding Users', duration: '12:10', completed: false, isLocked: false },
        { id: 'l_104', title: 'Ideation Techniques', duration: '08:45', completed: false, isLocked: false },
        { id: 'l_105', title: 'Prototyping Labs', duration: '25:00', completed: false, isLocked: true }
      ],
      resources: [
        { id: 'r_1', title: 'Design_Sprint_Guide.pdf', size: '2.4 MB', url: '#' },
        { id: 'r_2', title: 'Empathy_Map_Template.fig', size: '5.1 MB', url: '#' }
      ],
      modules: defaultModules,
      notes: [],
      qna: []
    };

    res.status(200).json({
      success: true,
      data: learnPayload
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCategories,
  getCourseById,
  getCourseLearn,
  createCourse,
  enrollCourse,
  getMyLearning,
  toggleSaveCourse,
  completeLesson
};

