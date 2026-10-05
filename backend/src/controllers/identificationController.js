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

// @desc    Recognize candidate face snapshot against enrolled student database
// @route   POST /api/identifications/recognize
// @access  Private (TEACHER, ADMIN)
const recognizeFace = async (req, res, next) => {
  try {
    const { imageBase64, threshold } = req.body;

    let candidateImageBase64 = imageBase64;
    if (req.file) {
      candidateImageBase64 = `data:image/jpeg;base64,${req.file.buffer.toString('base64')}`;
    }

    if (!candidateImageBase64) {
      return res.status(400).json({
        success: false,
        matched: false,
        message: 'Webcam image snapshot (base64 or file upload) is required.'
      });
    }

    // 1. Fetch all enrolled students that have face vectors registered in MongoDB
    const enrolledStudents = await User.find({
      isFaceRegistered: true,
      role: 'STUDENT'
    }).select('+faceEmbedding');

    if (!enrolledStudents || enrolledStudents.length === 0) {
      return res.status(404).json({
        success: false,
        matched: false,
        message: 'No enrolled student face vectors found in database. Please register students first.'
      });
    }

    // 2. Format target user embeddings for Python Face Engine
    const targetUsersPayload = enrolledStudents.map((student) => ({
      userId: student._id.toString(),
      name: student.name,
      email: student.email,
      role: student.role,
      profileImage: student.profileImage || '',
      faceEmbedding: student.faceEmbedding || []
    }));

    // 3. Call Python Microservice /compare
    const comparisonResult = await pythonFaceService.compareFace({
      candidateImageBase64,
      targetUsers: targetUsersPayload,
      threshold: threshold ? parseFloat(threshold) : 0.70
    });

    if (!comparisonResult.matched || !comparisonResult.userId) {
      return res.status(200).json({
        success: true,
        matched: false,
        studentId: null,
        confidence: comparisonResult.similarityScore || 0.0,
        confidencePercentage: comparisonResult.confidencePercentage || 0.0,
        message: comparisonResult.message || 'Face not recognized.'
      });
    }

    // 4. Match found! Retrieve full student profile
    const matchedStudent = await User.findById(comparisonResult.userId);

    res.status(200).json({
      success: true,
      matched: true,
      studentId: matchedStudent._id,
      rollNumber: matchedStudent.rollNumber,
      student: {
        _id: matchedStudent._id,
        name: matchedStudent.name,
        rollNumber: matchedStudent.rollNumber,
        email: matchedStudent.email,
        department: matchedStudent.department,
        course: matchedStudent.course,
        year: matchedStudent.year,
        section: matchedStudent.section,
        profileImage: matchedStudent.profileImage
      },
      confidence: comparisonResult.similarityScore,
      confidencePercentage: comparisonResult.confidencePercentage,
      message: `${matchedStudent.name} (${matchedStudent.rollNumber}) identified successfully with ${comparisonResult.confidencePercentage}% confidence.`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recognizeFace
};
