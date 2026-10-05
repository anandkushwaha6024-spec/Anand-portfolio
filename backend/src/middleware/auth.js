const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes: Validates Bearer Token in Authorization header
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret_key_face_attendance_2026'
      );

      // Attach authenticated user profile to req (excluding password & heavy face vectors)
      req.user = await User.findById(decoded.id).select('-password -faceEmbedding');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User account associated with this token no longer exists.'
        });
      }

      next();
    } catch (error) {
      console.error('[Auth Middleware Error]:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid or expired token.'
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, missing authorization header.'
    });
  }
};

module.exports = { protect };
