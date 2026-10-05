const axios = require('axios');
const FormData = require('form-data');

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

/**
 * Sends image buffer to Python microservice /encode endpoint to detect face and extract vector embedding.
 */
const encodeFace = async (fileBuffer, originalname = 'face.jpg', mimetype = 'image/jpeg') => {
  try {
    const formData = new FormData();
    formData.append('image', fileBuffer, {
      filename: originalname,
      contentType: mimetype
    });

    const response = await axios.post(`${PYTHON_SERVICE_URL}/encode`, formData, {
      headers: {
        ...formData.getHeaders()
      },
      timeout: 10000
    });

    return response.data;
  } catch (error) {
    console.error('[Python Service Error - encodeFace]:', error.response?.data || error.message);
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return {
        success: false,
        faceDetected: false,
        message: 'Python Face Recognition Service is currently offline or unreachable at ' + PYTHON_SERVICE_URL,
        embedding: []
      };
    }
    return {
      success: false,
      faceDetected: false,
      message: error.response?.data?.message || 'Failed to communicate with Python Face Service.',
      embedding: []
    };
  }
};

/**
 * Sends candidate image or embedding along with enrolled user target embeddings to Python /compare endpoint.
 */
const compareFace = async ({ candidateEmbedding, candidateImageBase64, targetUsers, threshold = 0.70 }) => {
  try {
    const payload = {
      candidateEmbedding: candidateEmbedding || null,
      candidateImageBase64: candidateImageBase64 || null,
      targetUsers: targetUsers.map(user => ({
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || '',
        faceEmbedding: user.faceEmbedding
      })),
      threshold
    };

    const response = await axios.post(`${PYTHON_SERVICE_URL}/compare`, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 12000
    });

    return response.data;
  } catch (error) {
    console.error('[Python Service Error - compareFace]:', error.response?.data || error.message);
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return {
        success: false,
        matched: false,
        message: 'Python Face Recognition Service is currently offline or unreachable.',
        similarityScore: 0.0
      };
    }
    return {
      success: false,
      matched: false,
      message: error.response?.data?.message || 'Failed to perform face vector comparison.',
      similarityScore: 0.0
    };
  }
};

module.exports = {
  encodeFace,
  compareFace
};
