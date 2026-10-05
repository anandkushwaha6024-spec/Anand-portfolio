const User = require('../models/User');
const { generateToken } = require('../utils/token');

// @desc    Register a new user (Student, Teacher, or Admin)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, rollNumber, department, course, year, section, profileImage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.'
      });
    }

    if (rollNumber) {
      const existingRoll = await User.findOne({ rollNumber });
      if (existingRoll) {
        return res.status(400).json({
          success: false,
          message: 'Student with this roll number already exists.'
        });
      }
    }

    const userRole = role && ['ADMIN', 'TEACHER', 'STUDENT'].includes(role.toUpperCase())
      ? role.toUpperCase()
      : 'STUDENT';

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      rollNumber: rollNumber || undefined,
      department: department || 'Computer Science & Engineering',
      course: course || 'B.Tech',
      year: year || '4th Year',
      section: section || 'A',
      profileImage: profileImage || ''
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        department: user.department,
        course: user.course,
        year: user.year,
        section: user.section,
        profileImage: user.profileImage,
        isFaceRegistered: user.isFaceRegistered
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & return JWT token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    // Select password explicitly since it's unselected in schema
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password incorrect.'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        department: user.department,
        course: user.course,
        year: user.year,
        section: user.section,
        profileImage: user.profileImage,
        isFaceRegistered: user.isFaceRegistered
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
