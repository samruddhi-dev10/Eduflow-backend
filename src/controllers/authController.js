// Auth Controller logic

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: 'usr_' + Date.now(),
        name: name || 'Eduflow User',
        email,
        role: role || 'student'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: 'sample_jwt_token_eduflow_' + Date.now(),
      user: {
        id: 'usr_12345',
        email,
        role: 'student'
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser
};
