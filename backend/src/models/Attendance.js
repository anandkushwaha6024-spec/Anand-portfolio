const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required']
    },
    studentId: {
      type: String,
      required: [true, 'Student Roll Number or ID is required'],
      index: true
    },
    date: {
      type: String,
      required: [true, 'Date string (YYYY-MM-DD) is required'],
      index: true
    },
    time: {
      type: String,
      required: [true, 'Time string (HH:mm:ss) is required']
    },
    status: {
      type: String,
      enum: ['PRESENT', 'ABSENT', 'LATE'],
      default: 'PRESENT'
    },
    confidence: {
      type: Number,
      default: 1.0,
      min: 0.0,
      max: 1.0
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassSession',
      default: null
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Prevent Duplicate Attendance for the same student on the same date for a session
attendanceSchema.index({ student: 1, date: 1, sessionId: 1 }, { unique: true });
attendanceSchema.index({ date: 1, status: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
