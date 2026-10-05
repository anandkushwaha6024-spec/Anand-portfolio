const User = require('../models/User');
const IdentificationHistory = require('../models/IdentificationHistory');
const pythonService = require('../services/pythonService');

// Helper to convert base64 image string to buffer
const getBufferFromInput = (req) => {
  if (req.file) {
    return {
      buffer: req.file.buffer,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype
    };
  }

  if (req.body && req.body.imageBase64) {
    let base64Data = req.body.imageBase64;
    if (base64Data.includes(',')) {
      base64Data = base64Data.split(',')[1];
    }
    const buffer = Buffer.from(base64Data, 'base64');
    return {
      buffer,
      originalname: 'webcam_capture.jpg',
      mimetype: 'image/jpeg'
    };
  }

  return null;
};

// @desc    Enroll facial biometric data for current user
// @route   POST /api/face/enroll
// @access  Private
const enrollFace = async (req, res, next) => {
  try {
    const input = getBufferFromInput(req);

    if (!input) {
      return res.status(400).json({
        success: false,
        message: 'No image provided. Please upload an image file or capture a photo using your webcam.'
      });
    }

    const userId = req.body.userId || req.user._id;

    // Only Admin can enroll face for another user
    if (req.user.role !== 'ADMIN' && req.user._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only enroll face biometric data for your own account.'
      });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found.'
      });
    }

    // Call Python AI microservice to detect face & extract embedding vector
    const pyResponse = await pythonService.encodeFace(input.buffer, input.originalname, input.mimetype);

    if (!pyResponse.success || !pyResponse.embedding || pyResponse.embedding.length === 0) {
      return res.status(400).json({
        success: false,
        faceDetected: pyResponse.faceDetected || false,
        message: pyResponse.message || 'Face enrollment failed. Ensure only one clear face is visible in the frame.'
      });
    }

    // Save vector embedding securely in MongoDB
    targetUser.faceEmbedding = pyResponse.embedding;
    targetUser.isFaceEnrolled = true;
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: `Face enrolled successfully for ${targetUser.name}!`,
      user: {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        isFaceEnrolled: targetUser.isFaceEnrolled
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Identify a face against enrolled users database
// @route   POST /api/face/identify
// @access  Private
const identifyFace = async (req, res, next) => {
  try {
    const input = getBufferFromInput(req);

    if (!input) {
      return res.status(400).json({
        success: false,
        message: 'No candidate face image provided. Please capture a camera frame or upload an image.'
      });
    }

    // Fetch all users with face embeddings enabled
    const enrolledUsers = await User.find({ isFaceEnrolled: true }).select('+faceEmbedding');

    if (!enrolledUsers || enrolledUsers.length === 0) {
      // Log attempt to history
      await IdentificationHistory.create({
        identifiedBy: req.user._id,
        result: 'NO_MATCH',
        similarityScore: 0.0,
        confidencePercentage: 0.0,
        message: 'No enrolled face records exist in the database.'
      });

      return res.status(200).json({
        success: true,
        matched: false,
        message: 'Face not recognized. No enrolled face biometric records are currently registered in the system.',
        similarityScore: 0.0,
        confidencePercentage: 0.0
      });
    }

    // Extract candidate embedding first
    const encodeRes = await pythonService.encodeFace(input.buffer, input.originalname, input.mimetype);

    if (!encodeRes.success || !encodeRes.embedding || encodeRes.embedding.length === 0) {
      const resultType = encodeRes.message.includes('Multiple') ? 'MULTIPLE_FACES' : 'NO_FACE';

      await IdentificationHistory.create({
        identifiedBy: req.user._id,
        result: resultType,
        similarityScore: 0.0,
        confidencePercentage: 0.0,
        message: encodeRes.message
      });

      return res.status(400).json({
        success: false,
        matched: false,
        result: resultType,
        message: encodeRes.message,
        similarityScore: 0.0,
        confidencePercentage: 0.0
      });
    }

    // Compare candidate embedding with enrolled user vectors
    const compareRes = await pythonService.compareFace({
      candidateEmbedding: encodeRes.embedding,
      targetUsers: enrolledUsers,
      threshold: 0.70
    });

    const isMatch = compareRes.matched && compareRes.matchedUser;
    const resultType = isMatch ? 'SUCCESS' : 'NO_MATCH';

    const historyRecord = await IdentificationHistory.create({
      userId: isMatch ? compareRes.matchedUser.userId : null,
      identifiedBy: req.user._id,
      result: resultType,
      similarityScore: compareRes.similarityScore || 0.0,
      confidencePercentage: compareRes.confidencePercentage || 0.0,
      matchedUser: isMatch ? compareRes.matchedUser : null,
      message: compareRes.message,
      timestamp: new Date()
    });

    if (isMatch) {
      res.status(200).json({
        success: true,
        matched: true,
        matchedUser: compareRes.matchedUser,
        userId: compareRes.matchedUser.userId,
        similarityScore: compareRes.similarityScore,
        confidencePercentage: compareRes.confidencePercentage,
        timestamp: historyRecord.timestamp,
        message: `Match found! Identified user: ${compareRes.matchedUser.name}`
      });
    } else {
      res.status(200).json({
        success: true,
        matched: false,
        matchedUser: null,
        userId: null,
        similarityScore: compareRes.similarityScore || 0.0,
        confidencePercentage: compareRes.confidencePercentage || 0.0,
        timestamp: historyRecord.timestamp,
        message: 'Face not recognized.'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete facial biometric enrollment for user
// @route   DELETE /api/face/:userId
// @access  Private (Admin or Self)
const deleteFace = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (req.user.role !== 'ADMIN' && req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only delete your own enrolled biometric data.'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    user.faceEmbedding = [];
    user.isFaceEnrolled = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Enrolled face biometric data deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  enrollFace,
  identifyFace,
  deleteFace
};
