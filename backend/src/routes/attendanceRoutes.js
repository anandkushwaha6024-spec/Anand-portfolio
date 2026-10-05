const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
  markAttendance,
  recognizeAndMarkAttendance,
  getAttendanceHistory,
  getStudentOwnAttendance,
  getAttendanceAnalytics,
  exportAttendanceReport
} = require('../controllers/attendanceController');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.use(protect);

// Student Portal Routes
router.get('/student/me', authorize('STUDENT', 'ADMIN', 'TEACHER'), getStudentOwnAttendance);

// Teacher & Admin Routes
router.post('/mark', authorize('ADMIN', 'TEACHER'), markAttendance);
router.post('/recognize-and-mark', authorize('ADMIN', 'TEACHER'), upload.single('image'), recognizeAndMarkAttendance);
router.get('/history', authorize('ADMIN', 'TEACHER'), getAttendanceHistory);
router.get('/analytics', authorize('ADMIN', 'TEACHER'), getAttendanceAnalytics);
router.get('/export', authorize('ADMIN', 'TEACHER'), exportAttendanceReport);

module.exports = router;
