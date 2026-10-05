const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const connectDB = require('../config/db');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seeding Database] Clearing existing demo records...');
    await User.deleteMany();
    await Attendance.deleteMany();

    console.log('[Seeding Database] Creating demo users...');

    // 1. Create Admin Demo Account
    const admin = await User.create({
      name: 'Dr. Rajesh Sharma (Admin)',
      email: 'admin@college.edu',
      password: 'admin123',
      role: 'ADMIN',
      department: 'Computer Science & Engineering'
    });

    // 2. Create Teacher Demo Account
    const teacher = await User.create({
      name: 'Prof. Sunita Verma',
      email: 'teacher@college.edu',
      password: 'teacher123',
      role: 'TEACHER',
      department: 'Computer Science & Engineering'
    });

    // 3. Create Student Demo Account
    const student1 = await User.create({
      name: 'Anand Kushwaha',
      email: 'student@college.edu',
      password: 'student123',
      role: 'STUDENT',
      rollNumber: '2026-CS-001',
      department: 'Computer Science & Engineering',
      course: 'B.Tech',
      year: '4th Year',
      section: 'A'
    });

    const student2 = await User.create({
      name: 'Rohan Gupta',
      email: 'rohan@college.edu',
      password: 'rohan123',
      role: 'STUDENT',
      rollNumber: '2026-CS-042',
      department: 'Information Technology',
      course: 'B.Tech',
      year: '4th Year',
      section: 'B'
    });

    console.log('=======================================================');
    console.log('  Database Seeding Completed Successfully!             ');
    console.log('=======================================================');
    console.log('  Demo Accounts Created:                               ');
    console.log('  - ADMIN:   admin@college.edu   / admin123           ');
    console.log('  - TEACHER: teacher@college.edu / teacher123         ');
    console.log('  - STUDENT: student@college.edu / student123         ');
    console.log('=======================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seeding Error]:', error.message);
    process.exit(1);
  }
};

seedData();
