const mongoose = require('mongoose');

const classSessionSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true
    },
    department: {
      type: String,
      default: 'Computer Science & Engineering'
    },
    course: {
      type: String,
      default: 'B.Tech'
    },
    year: {
      type: String,
      default: '4th Year'
    },
    section: {
      type: String,
      default: 'A'
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    startTime: {
      type: Date,
      default: Date.now
    },
    endTime: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

classSessionSchema.index({ teacher: 1, isActive: 1 });

module.exports = mongoose.model('ClassSession', classSessionSchema);
