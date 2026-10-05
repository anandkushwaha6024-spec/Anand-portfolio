# Face Identification System - React Frontend

Modern, responsive React single page application built with Vite, Tailwind CSS, React Router DOM, Axios, and Recharts.

## Directory Layout
```
frontend/
├── src/
│   ├── components/  # Reusable UI components (Navbar, Sidebar, Tables, Modals)
│   ├── context/     # AuthContext & AttendanceContext global state
│   ├── hooks/       # Custom React hooks (useAuth, useWebcam)
│   ├── pages/       # Page components (Login, Register, Dashboards, Live Scanner)
│   ├── routes/      # Application router & protected routes
│   ├── services/    # Axios HTTP client configuration
│   ├── utils/       # Date formatters & helpers
│   ├── App.jsx      # Root component
│   └── main.jsx     # Vite DOM entrypoint
├── .env.example     # Environment variable template
├── index.html       # HTML entry template
├── tailwind.config.js
├── vite.config.js
└── package.json     # Dependencies & dev scripts
```

## Available Scripts
- `npm run dev`: Start Vite development server
- `npm run build`: Build production production assets into `dist/`
- `npm run preview`: Preview production build locally
