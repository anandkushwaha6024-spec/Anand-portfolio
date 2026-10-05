const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/face_attendance_db';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[MongoDB] Database connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to standard URI (${mongoUri}): ${error.message}`);
    console.log(`[MongoDB] Initializing in-memory fallback database (mongodb-memory-server)...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const fallbackUri = mongod.getUri();

      const conn = await mongoose.connect(fallbackUri);
      console.log(`[MongoDB Memory Server] Connected to in-memory database at ${fallbackUri}`);
      return conn;
    } catch (memError) {
      console.error(`[MongoDB Error] Failed to initialize in-memory fallback database: ${memError.message}`);
      console.warn(`[MongoDB Instructions] Please start local MongoDB service or configure MONGO_URI in backend/.env`);
    }
  }
};

module.exports = connectDB;
