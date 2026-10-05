# Face Identification System - Backend API Service

Express.js REST API service for user authentication, student management, attendance recording, role authorization, and integration with the Python Face Recognition service.

## Directory Layout
```
backend/
├── src/
│   ├── config/        # Database connection & env config
│   ├── controllers/   # Auth, Student, Attendance & Admin controllers
│   ├── middleware/    # JWT Auth, Role Guard & Error Handling
│   ├── models/        # User, Student & Attendance Mongoose schemas
│   ├── routes/        # Express route definitions
│   ├── services/      # Python AI service communication client
│   ├── utils/         # Helper functions & JWT signers
│   ├── app.js         # Express Application setup
│   └── server.js      # Server entrypoint
├── .env.example       # Environment key template
└── package.json       # Project dependencies & scripts
```

## Available Scripts
- `npm run dev`: Start backend API server with nodemon reload
- `npm start`: Run backend API server in production mode
- `npm run seed`: Populate database with initial Admin, Teacher, and Student demo data
