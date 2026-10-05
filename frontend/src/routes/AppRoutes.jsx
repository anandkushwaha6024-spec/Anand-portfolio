import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Students from '../pages/Students';
import LiveAttendanceScanner from '../pages/LiveAttendanceScanner';
import AttendanceHistory from '../pages/AttendanceHistory';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl">{children}</main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes (Wrapped with Navbar & Sidebar Layout) */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'TEACHER', 'STUDENT']} />}>
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/attendance/history" element={<Layout><AttendanceHistory /></Layout>} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'TEACHER']} />}>
        <Route path="/students" element={<Layout><Students /></Layout>} />
        <Route path="/attendance/live" element={<Layout><LiveAttendanceScanner /></Layout>} />
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
