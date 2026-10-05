const express = require('express');
const router = express.Router();
const multer = require('multer');

const { detectFace, registerStudentFace } = require('../controllers/faceController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// Multer memory storage configuration for receiving camera frames in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.use(protect);

router.post('/detect', authorize('ADMIN', 'TEACHER'), upload.single('image'), detectFace);
router.post('/register', authorize('ADMIN', 'TEACHER'), upload.single('image'), registerStudentFace);

module.exports = router;
