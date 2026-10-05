const User = require('../models/User');
const IdentificationHistory = require('../models/IdentificationHistory');

// @desc    Get all users (with search and role filter)
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res, next) => {
  try {
    const { search, role, isFaceEnrolled } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (isFaceEnrolled !== undefined) {
      query.isFaceEnrolled = isFaceEnrolled === 'true';
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${req.params.id} not found.`
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

// @desc    Update user details
// @route   PUT /api/users/:id
// @access  Private
const updateUser = async (req, res, next) => {
  try {
    const { name, email, role, profileImage } = req.body;
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    // Only Admin can modify role or edit other users
    if (req.user.role !== 'ADMIN' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only update your own profile.'
      });
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (profileImage !== undefined) user.profileImage = profileImage;

    // Only Admin can change user roles
    if (role && req.user.role === 'ADMIN') {
      if (['USER', 'ADMIN'].includes(role)) {
        user.role = role;
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isFaceEnrolled: user.isFaceEnrolled,
        profileImage: user.profileImage,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin or Self)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    if (req.user.role !== 'ADMIN' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only delete your own account.'
      });
    }

    // Clean up identification logs associated with this user
    await IdentificationHistory.deleteMany({
      $or: [{ userId: user._id }, { identifiedBy: user._id }]
    });

    await User.findByIdAndDelete(user._id);

    res.status(200).json({
      success: true,
      message: 'User account and associated records deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
