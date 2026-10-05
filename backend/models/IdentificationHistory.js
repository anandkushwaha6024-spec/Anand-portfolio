const mongoose = require('mongoose');

const identificationHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    identifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    result: {
      type: String,
      enum: ['SUCCESS', 'NO_MATCH', 'MULTIPLE_FACES', 'NO_FACE', 'ERROR'],
      required: true
    },
    similarityScore: {
      type: Number,
      default: 0.0
    },
    confidencePercentage: {
      type: Number,
      default: 0.0
    },
    matchedUser: {
      userId: String,
      name: String,
      email: String,
      profileImage: String
    },
    message: {
      type: String,
      default: ''
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('IdentificationHistory', identificationHistorySchema);
