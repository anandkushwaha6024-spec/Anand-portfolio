const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    role: {
      type: String,
      enum: ['ADMIN', 'TEACHER', 'STUDENT'],
      default: 'STUDENT'
    },
    rollNumber: {
      type: String,
      sparse: true,
      unique: true,
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
    profileImage: {
      type: String,
      default: ''
    },
    faceEmbedding: {
      type: [Number],
      default: [],
      select: false // Not loaded by default to keep API responses lightweight
    },
    isFaceRegistered: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Password Hash Pre-Save Hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match Password Method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Database Index for Fast Role Queries (email & rollNumber already indexed via unique: true)
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
