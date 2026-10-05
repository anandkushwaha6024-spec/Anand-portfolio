const Attendance = require('../models/Attendance');
const User = require('../models/User');
const pythonFaceService = require('../services/pythonFaceService');

/**
 * Format current Date into YYYY-MM-DD and HH:mm:ss
 */
const getFormattedDateTime = (dateObj = new Date()) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');
  const timeStr = `${hours}:${minutes}:${seconds}`;

  return { dateStr, timeStr };
};

// @desc    Mark attendance manually or programmatically
// @route   POST /api/attendance/mark
// @access  Private (TEACHER, ADMIN)
const markAttendance = async (req, res, next) => {
  try {
    const { studentId, confidence, sessionId, status } = req.body;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID or Roll Number is required.'
      });
    }

    // Find student
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

    const { dateStr, timeStr } = getFormattedDateTime();

    // Check Duplicate Attendance for Today / Session
    const query = {
      student: student._id,
      date: dateStr
    };
    if (sessionId) {
      query.sessionId = sessionId;
    }

    const existingRecord = await Attendance.findOne(query);
    if (existingRecord) {
      return res.status(200).json({
        success: true,
        alreadyMarked: true,
        message: `Attendance already marked today for ${student.name} (${student.rollNumber || 'ID'}) at ${existingRecord.time}.`,
        record: existingRecord
      });
    }

    // Create New Attendance Log
    const attendance = await Attendance.create({
      student: student._id,
      studentId: student.rollNumber || student._id.toString(),
      date: dateStr,
      time: timeStr,
      status: status || 'PRESENT',
      confidence: confidence ? parseFloat(confidence) : 1.0,
      sessionId: sessionId || null,
      recordedBy: req.user ? req.user._id : null
    });

    res.status(201).json({
      success: true,
      alreadyMarked: false,
      message: `Attendance marked successfully for ${student.name}!`,
      record: {
        _id: attendance._id,
        studentId: attendance.studentId,
        studentName: student.name,
        date: attendance.date,
        time: attendance.time,
        status: attendance.status,
        confidence: attendance.confidence,
        createdAt: attendance.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Live Webcam Scanner: Recognize Face + Instantly Mark Attendance
// @route   POST /api/attendance/recognize-and-mark
// @access  Private (TEACHER, ADMIN)
const recognizeAndMarkAttendance = async (req, res, next) => {
  try {
    const { imageBase64, sessionId, threshold } = req.body;

    let candidateImageBase64 = imageBase64;
    if (req.file) {
      candidateImageBase64 = `data:image/jpeg;base64,${req.file.buffer.toString('base64')}`;
    }

    if (!candidateImageBase64) {
      return res.status(400).json({
        success: false,
        matched: false,
        message: 'Webcam snapshot image is required.'
      });
    }

    // 1. Fetch Enrolled Students from MongoDB
    const enrolledStudents = await User.find({
      isFaceRegistered: true,
      role: 'STUDENT'
    }).select('+faceEmbedding');

    if (!enrolledStudents || enrolledStudents.length === 0) {
      return res.status(404).json({
        success: false,
        matched: false,
        message: 'No face-enrolled students available for recognition.'
      });
    }

    const targetUsersPayload = enrolledStudents.map((s) => ({
      userId: s._id.toString(),
      name: s.name,
      email: s.email,
      role: s.role,
      profileImage: s.profileImage || '',
      faceEmbedding: s.faceEmbedding || []
    }));

    // 2. Call Python Face Matching Engine
    const comparisonResult = await pythonFaceService.compareFace({
      candidateImageBase64,
      targetUsers: targetUsersPayload,
      threshold: threshold ? parseFloat(threshold) : 0.70
    });

    if (!comparisonResult.matched || !comparisonResult.userId) {
      return res.status(200).json({
        success: true,
        matched: false,
        confidence: comparisonResult.similarityScore || 0.0,
        message: comparisonResult.message || 'Face not recognized.'
      });
    }

    // 3. Match Found -> Identify Student
    const student = await User.findById(comparisonResult.userId);
    const { dateStr, timeStr } = getFormattedDateTime();

    // 4. Check for duplicate attendance today
    const query = { student: student._id, date: dateStr };
    if (sessionId) query.sessionId = sessionId;

    const existingRecord = await Attendance.findOne(query);
    if (existingRecord) {
      return res.status(200).json({
        success: true,
        matched: true,
        alreadyMarked: true,
        student: {
          _id: student._id,
          name: student.name,
          rollNumber: student.rollNumber,
          department: student.department,
          profileImage: student.profileImage
        },
        confidence: comparisonResult.similarityScore,
        confidencePercentage: comparisonResult.confidencePercentage,
        message: `Attendance already marked today for ${student.name} at ${existingRecord.time}.`,
        record: existingRecord
      });
    }

    // 5. Create Attendance Record
    const attendance = await Attendance.create({
      student: student._id,
      studentId: student.rollNumber || student._id.toString(),
      date: dateStr,
      time: timeStr,
      status: 'PRESENT',
      confidence: comparisonResult.similarityScore,
      sessionId: sessionId || null,
      recordedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      matched: true,
      alreadyMarked: false,
      student: {
        _id: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
        department: student.department,
        profileImage: student.profileImage
      },
      confidence: comparisonResult.similarityScore,
      confidencePercentage: comparisonResult.confidencePercentage,
      message: `Identified ${student.name} (${student.rollNumber}). Attendance marked successfully!`,
      record: attendance
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Attendance History with search, date & department filters
// @route   GET /api/attendance/history
// @access  Private (TEACHER, ADMIN)
const getAttendanceHistory = async (req, res, next) => {
  try {
    const { date, studentId, search, status } = req.query;

    let query = {};
    if (date) query.date = date;
    if (status) query.status = status;
    if (studentId) query.studentId = studentId;

    const history = await Attendance.find(query)
      .populate('student', 'name email rollNumber department course year section profileImage')
      .populate('recordedBy', 'name email role')
      .sort({ createdAt: -1 });

    let filteredHistory = history;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredHistory = history.filter((rec) => {
        const studentName = rec.student?.name?.toLowerCase() || '';
        const rollNum = rec.studentId?.toLowerCase() || '';
        return studentName.includes(searchLower) || rollNum.includes(searchLower);
      });
    }

    res.status(200).json({
      success: true,
      count: filteredHistory.length,
      history: filteredHistory
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in student's own attendance stats & history
// @route   GET /api/attendance/student/me
// @access  Private (STUDENT)
const getStudentOwnAttendance = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    const attendanceRecords = await Attendance.find({ student: studentId })
      .sort({ date: -1, time: -1 });

    const totalClasses = attendanceRecords.length;
    const presentCount = attendanceRecords.filter((r) => r.status === 'PRESENT').length;
    const absentCount = attendanceRecords.filter((r) => r.status === 'ABSENT').length;
    const attendancePercentage = totalClasses > 0
      ? parseFloat(((presentCount / totalClasses) * 100).toFixed(2))
      : 100.0;

    res.status(200).json({
      success: true,
      stats: {
        totalClasses,
        present: presentCount,
        absent: absentCount,
        attendancePercentage
      },
      history: attendanceRecords
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard analytics (Total students, present today, absent today, percentage)
// @route   GET /api/attendance/analytics
// @access  Private (TEACHER, ADMIN)
const getAttendanceAnalytics = async (req, res, next) => {
  try {
    const { dateStr } = getFormattedDateTime();

    const totalStudents = await User.countDocuments({ role: 'STUDENT' });
    const presentTodayRecords = await Attendance.find({ date: dateStr, status: 'PRESENT' });
    const presentToday = presentTodayRecords.length;
    const absentToday = Math.max(0, totalStudents - presentToday);
    const attendancePercentage = totalStudents > 0
      ? parseFloat(((presentToday / totalStudents) * 100).toFixed(2))
      : 0.0;

    const recentAttendance = await Attendance.find({ date: dateStr })
      .populate('student', 'name rollNumber department profileImage')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      date: dateStr,
      analytics: {
        totalStudents,
        presentToday,
        absentToday,
        attendancePercentage
      },
      recentAttendance
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export Attendance report as CSV string
// @route   GET /api/attendance/export
// @access  Private (TEACHER, ADMIN)
const exportAttendanceReport = async (req, res, next) => {
  try {
    const records = await Attendance.find()
      .populate('student', 'name rollNumber department course year section')
      .sort({ date: -1, time: -1 });

    let csvContent = 'Date,Time,Student Name,Roll Number,Department,Course,Year,Section,Status,Confidence\n';

    records.forEach((r) => {
      const studentName = r.student ? `"${r.student.name}"` : 'Unknown';
      const rollNum = r.studentId || '';
      const dept = r.student?.department || '';
      const course = r.student?.course || '';
      const year = r.student?.year || '';
      const section = r.student?.section || '';

      csvContent += `${r.date},${r.time},${studentName},${rollNum},${dept},${course},${year},${section},${r.status},${r.confidence}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance_report.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markAttendance,
  recognizeAndMarkAttendance,
  getAttendanceHistory,
  getStudentOwnAttendance,
  getAttendanceAnalytics,
  exportAttendanceReport
};
