const User = require('../models/User');
const pythonFaceService = require('../services/pythonFaceService');

/**
 * Helper to convert Base64 string to Buffer
 */
const base64ToBuffer = (base64String) => {
  const cleanBase64 = base64String.includes(',')
    ? base64String.split(',')[1]
    : base64String;
  return Buffer.from(cleanBase64, 'base64');
};

// @desc    Detect face in submitted image frame
// @route   POST /api/face/detect
// @access  Private (ADMIN, TEACHER)
const detectFace = async (req, res, next) => {
  try {
    let imageBuffer;

    if (req.file) {
      imageBuffer = req.file.buffer;
    } else if (req.body.imageBase64) {
      imageBuffer = base64ToBuffer(req.body.imageBase64);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Image file or base64 image data is required.'
      });
    }

    const result = await pythonFaceService.detectFace(imageBuffer);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Register & enroll student face vector embedding into MongoDB
// @route   POST /api/face/register
// @access  Private (ADMIN, TEACHER)
const registerStudentFace = async (req, res, next) => {
  try {
    const { studentId, imageBase64 } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID or Roll Number is required.'
      });
    }

    let imageBuffer;
    if (req.file) {
      imageBuffer = req.file.buffer;
    } else if (imageBase64) {
      imageBuffer = base64ToBuffer(imageBase64);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Image file or base64 webcam frame is required.'
      });
    }

    // Find student in database by Mongo ID or Roll Number
    let student;
    if (studentId.match(/^[0-9a-fA-F]{24}$/)) {
      student = await User.findById(studentId);
    } else {
      student = await User.findOne({ rollNumber: studentId });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found for ID '${studentId}'.`
      });
    }

    // Send frame to Python microservice to generate 128D embedding
    const encodeResult = await pythonFaceService.encodeFace(imageBuffer);

    if (!encodeResult.success || !encodeResult.embedding || encodeResult.embedding.length === 0) {
      return res.status(400).json({
        success: false,
        message: encodeResult.message || 'Face detection failed. Ensure a single clear face is present.'
      });
    }

    // Update student face embedding vector in MongoDB
    student.faceEmbedding = encodeResult.embedding;
    student.isFaceRegistered = true;

    // Optional: save profile image if base64 provided
    if (imageBase64 && !student.profileImage) {
      student.profileImage = imageBase64;
    }

    await student.save();

    res.status(200).json({
      success: true,
      message: `Face registered successfully for ${student.name} (${student.rollNumber || 'ID'}).`,
      student: {
        _id: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
        email: student.email,
        isFaceRegistered: student.isFaceRegistered,
        imageQuality: encodeResult.imageQuality || 'GOOD'
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  detectFace,
  registerStudentFace
};
