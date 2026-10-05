const jwt = require('jsonwebtoken');

/**
 * Generate a JWT Bearer Token for authenticated users
 * @param {string} id - Mongo User ObjectId string
 * @returns {string} - Signed JWT token string
 */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'fallback_secret_key_face_attendance_2026',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    }
  );
};

module.exports = { generateToken };
