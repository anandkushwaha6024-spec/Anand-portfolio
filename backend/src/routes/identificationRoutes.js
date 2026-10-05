const express = require('express');
const router = express.Router();
const multer = require('multer');

const { recognizeFace } = require('../controllers/identificationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.use(protect);

// Live Face Recognition Endpoint (Teachers and Admins)
router.post('/recognize', authorize('ADMIN', 'TEACHER'), upload.single('image'), recognizeFace);
router.post('/scan', authorize('ADMIN', 'TEACHER'), upload.single('image'), recognizeFace);

module.exports = router;
