const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');

const seedDatabase = async () => {
  try {
    await connectDB();

    // Check if Admin exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      await User.create({
        name: 'System Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'ADMIN'
      });
      console.log('[Seed] Created default Admin user (admin@example.com / admin123)');
    } else {
      console.log('[Seed] Admin user already exists.');
    }

    // Check if Standard User exists
    const userExists = await User.findOne({ email: 'user@example.com' });
    if (!userExists) {
      await User.create({
        name: 'Alex Johnson',
        email: 'user@example.com',
        password: 'user123',
        role: 'USER'
      });
      console.log('[Seed] Created default Standard user (user@example.com / user123)');
    } else {
      console.log('[Seed] Standard user already exists.');
    }

    console.log('[Seed] Database seed completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    process.exit(1);
  }
};

seedDatabase();
