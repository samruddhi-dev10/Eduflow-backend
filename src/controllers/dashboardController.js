// Dashboard Controller logic for EduFlow LMS
const {
  getDashboardDataByUserId,
  toggleLiveClassReminderByUserId
} = require('../utils/userStore');

/**
 * @desc    Get complete Composite Dashboard Payload
 * @route   GET /api/dashboard
 * @access  Private
 */
const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const dashboard = await getDashboardDataByUserId(userId);
    res.status(200).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get User Learning Stats Counters
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
const getStats = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const dashboard = await getDashboardDataByUserId(userId);
    res.status(200).json({
      success: true,
      data: dashboard.stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Upcoming Live Classes
 * @route   GET /api/dashboard/live-classes
 * @access  Private
 */
const getLiveClasses = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const dashboard = await getDashboardDataByUserId(userId);
    res.status(200).json({
      success: true,
      data: dashboard.liveClasses
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle Reminder for a Live Class
 * @route   POST /api/dashboard/live-classes/:id/reminder
 * @access  Private
 */
const toggleLiveClassReminder = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const updatedClass = await toggleLiveClassReminderByUserId(userId, req.params.id);
    if (!updatedClass) {
      return res.status(404).json({ success: false, message: 'Live class not found' });
    }

    res.status(200).json({
      success: true,
      message: `Reminder ${updatedClass.isReminderSet ? 'set' : 'removed'} for ${updatedClass.title}`,
      data: updatedClass
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Continue Learning / In-Progress Courses
 * @route   GET /api/dashboard/continue-learning
 * @access  Private
 */
const getContinueLearning = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const dashboard = await getDashboardDataByUserId(userId);
    res.status(200).json({
      success: true,
      data: dashboard.continueLearning
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Recommended Courses
 * @route   GET /api/dashboard/recommended
 * @access  Private
 */
const getRecommendedCourses = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const dashboard = await getDashboardDataByUserId(userId);
    res.status(200).json({
      success: true,
      data: dashboard.recommended
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Module Explorer Navigation
 * @route   GET /api/dashboard/module-explorer
 * @access  Private
 */
const getModuleExplorer = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const dashboard = await getDashboardDataByUserId(userId);
    res.status(200).json({
      success: true,
      data: dashboard.moduleExplorer
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Download Learning Resources
 * @route   GET /api/dashboard/download-resources
 * @access  Private
 */
const downloadResources = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    res.status(200).json({
      success: true,
      message: 'Learning resource bundle prepared for download',
      downloadUrl: 'https://eduflow-resources.s3.amazonaws.com/learning-bundle.zip',
      fileName: 'eduflow_course_resources.zip'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData,
  getStats,
  getLiveClasses,
  toggleLiveClassReminder,
  getContinueLearning,
  getRecommendedCourses,
  getModuleExplorer,
  downloadResources
};
