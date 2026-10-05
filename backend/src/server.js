const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from root or local .env
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Face Identification Backend Server Running           `);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'} `);
  console.log(`  URL: http://localhost:${PORT}                       `);
  console.log(`  Python Service Target: ${process.env.PYTHON_SERVICE_URL || 'http://localhost:8000'}`);
  console.log(`=======================================================`);
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Rejection]:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]:', err.message);
});
