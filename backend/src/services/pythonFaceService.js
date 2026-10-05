const axios = require('axios');
const FormData = require('form-data');

class PythonFaceService {
  constructor() {
    this.baseURL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
  }

  /**
   * Send image frame to Python service for face detection & quality analysis
   * @param {Buffer} imageBuffer - Raw binary image buffer
   */
  async detectFace(imageBuffer) {
    try {
      const formData = new FormData();
      formData.append('image', imageBuffer, { filename: 'frame.jpg', contentType: 'image/jpeg' });

      const response = await axios.post(`${this.baseURL}/detect`, formData, {
        headers: formData.getHeaders(),
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error('[Python Face Service Error - /detect]:', error.message);
      return {
        success: false,
        faceDetected: false,
        message: `Python face detection service error: ${error.message}`
      };
    }
  }

  /**
   * Send image frame to Python service to extract 128D facial feature vector embedding
   * @param {Buffer} imageBuffer - Raw binary image buffer
   */
  async encodeFace(imageBuffer) {
    try {
      const formData = new FormData();
      formData.append('image', imageBuffer, { filename: 'frame.jpg', contentType: 'image/jpeg' });

      const response = await axios.post(`${this.baseURL}/encode`, formData, {
        headers: formData.getHeaders(),
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error('[Python Face Service Error - /encode]:', error.message);
      return {
        success: false,
        faceDetected: false,
        message: `Python face encoding service error: ${error.message}`,
        embedding: []
      };
    }
  }

  /**
   * Compare candidate embedding or base64 frame against enrolled target users
   * @param {Object} payload - { candidateEmbedding, candidateImageBase64, targetUsers, threshold }
   */
  async compareFace(payload) {
    try {
      const response = await axios.post(`${this.baseURL}/compare`, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      return response.data;
    } catch (error) {
      console.error('[Python Face Service Error - /compare]:', error.message);
      return {
        success: false,
        matched: false,
        message: `Python face comparison service error: ${error.message}`,
        similarityScore: 0.0
      };
    }
  }
}

module.exports = new PythonFaceService();
