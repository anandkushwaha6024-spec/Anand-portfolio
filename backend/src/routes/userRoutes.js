const express = require('express');
const router = express.Router();
const {
  createStudent,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getEnrolledFaceUsers
} = require('../controllers/userController');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// All routes require login
router.use(protect);

// Student registration by Admin or Teacher
router.post('/student', authorize('ADMIN', 'TEACHER'), createStudent);

// Get enrolled students with face vector embeddings (for AI scanner matching)
router.get('/enrolled-faces', authorize('ADMIN', 'TEACHER'), getEnrolledFaceUsers);

// Get list of users/students with search & filter
router.get('/', authorize('ADMIN', 'TEACHER'), getUsers);

// Get single user by ID or Roll Number
router.get('/:id', getUserById);

// Update user details
router.put('/:id', updateUser);

// Delete user account (Admin only)
router.delete('/:id', authorize('ADMIN'), deleteUser);

module.exports = router;
