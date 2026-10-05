const express = require('express');
const router = express.Router();
const { enrollFace, identifyFace, deleteFace } = require('../controllers/faceController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Accept single image upload field named 'image', or base64 string in JSON body
router.post('/enroll', protect, upload.single('image'), enrollFace);
router.post('/identify', protect, upload.single('image'), identifyFace);
router.delete('/:userId', protect, deleteFace);

module.exports = router;
