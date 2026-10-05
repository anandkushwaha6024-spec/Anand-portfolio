const User = require('../models/User');

// @desc    Create a new Student (Admin or Teacher action)
// @route   POST /api/users/student
// @access  Private (ADMIN, TEACHER)
const createStudent = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      rollNumber,
      department,
      course,
      year,
      section,
      profileImage
    } = req.body;

    if (!name || !email || !rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and roll number for the student.'
      });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: `Student with email '${email}' already exists.`
      });
    }

    const existingRoll = await User.findOne({ rollNumber: rollNumber.trim() });
    if (existingRoll) {
      return res.status(400).json({
        success: false,
        message: `Student with Roll Number '${rollNumber}' already exists.`
      });
    }

    const defaultPassword = password || `${rollNumber.trim()}@123`;

    const student = await User.create({
      name,
      email: email.toLowerCase(),
      password: defaultPassword,
      role: 'STUDENT',
      rollNumber: rollNumber.trim(),
      department: department || 'Computer Science & Engineering',
      course: course || 'B.Tech',
      year: year || '4th Year',
      section: section || 'A',
      profileImage: profileImage || ''
    });

    res.status(201).json({
      success: true,
      message: 'Student registered successfully.',
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        rollNumber: student.rollNumber,
        department: student.department,
        course: student.course,
        year: student.year,
        section: student.section,
        profileImage: student.profileImage,
        isFaceRegistered: student.isFaceRegistered,
        createdAt: student.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users or students with filters
// @route   GET /api/users
// @access  Private (ADMIN, TEACHER)
const getUsers = async (req, res, next) => {
  try {
    const { search, role, department, course, year, section, isFaceRegistered } = req.query;
    let query = {};

    if (role) {
      query.role = role.toUpperCase();
    }

    if (department) {
      query.department = department;
    }

    if (course) {
      query.course = course;
    }

    if (year) {
      query.year = year;
    }

    if (section) {
      query.section = section;
    }

    if (isFaceRegistered !== undefined) {
      query.isFaceRegistered = isFaceRegistered === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student or user by Mongo ID or Roll Number
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let user;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(id);
    } else {
      user = await User.findOne({ rollNumber: id });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Student/User not found for ID '${id}'.`
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student/user profile details
// @route   PUT /api/users/:id
// @access  Private (ADMIN, TEACHER or Self)
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, rollNumber, department, course, year, section, profileImage, role } = req.body;

    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User/Student not found.'
      });
    }

    // Permission Check: Admin can edit anyone; Teachers can edit Students; Users can edit self.
    const isSelf = req.user._id.toString() === id;
    const isAdmin = req.user.role === 'ADMIN';
    const isTeacherEditingStudent = req.user.role === 'TEACHER' && user.role === 'STUDENT';

    if (!isSelf && !isAdmin && !isTeacherEditingStudent) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to edit this account.'
      });
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (rollNumber) user.rollNumber = rollNumber.trim();
    if (department) user.department = department;
    if (course) user.course = course;
    if (year) user.year = year;
    if (section) user.section = section;
    if (profileImage !== undefined) user.profileImage = profileImage;

    if (role && isAdmin) {
      user.role = role.toUpperCase();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student or user account
// @route   DELETE /api/users/:id
// @access  Private (ADMIN only)
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User/Student not found.'
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `User '${user.name}' (${user.role}) deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students with registered face embeddings (Used by Python Face Matching Engine)
// @route   GET /api/users/enrolled-faces
// @access  Private (ADMIN, TEACHER)
const getEnrolledFaceUsers = async (req, res, next) => {
  try {
    const enrolledUsers = await User.find({
      isFaceRegistered: true
    }).select('+faceEmbedding');

    const formattedUsers = enrolledUsers.map((user) => ({
      userId: user._id.toString(),
      name: user.name,
      rollNumber: user.rollNumber || '',
      email: user.email,
      role: user.role,
      profileImage: user.profileImage || '',
      faceEmbedding: user.faceEmbedding || []
    }));

    res.status(200).json({
      success: true,
      count: formattedUsers.length,
      users: formattedUsers
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStudent,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getEnrolledFaceUsers
};
