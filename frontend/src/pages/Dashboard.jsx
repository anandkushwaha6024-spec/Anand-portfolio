import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import DashboardCard from '../components/DashboardCard';
import AttendanceTable from '../components/AttendanceTable';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  Percent,
  Camera,
  CheckCircle,
  Clock,
  BarChart2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

const Dashboard = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [studentStats, setStudentStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (role === 'ADMIN' || role === 'TEACHER') {
          const res = await apiClient.get('/attendance/analytics');
          if (res.data.success) {
            setAnalytics(res.data.analytics);
            setRecentLogs(res.data.recentAttendance || []);
          }
        } else if (role === 'STUDENT') {
          const res = await apiClient.get('/attendance/student/me');
          if (res.data.success) {
            setStudentStats(res.data.stats);
            setRecentLogs(res.data.history || []);
          }
        }
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [role]);

  // Chart data formatting
  const chartData = [
    { name: 'Present', count: analytics?.presentToday || 0 },
    { name: 'Absent', count: analytics?.absentToday || 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-900/40 via-slate-900 to-indigo-900/40 p-6 shadow-xl backdrop-blur-md">
        <div>
          <h2 className="text-xl font-extrabold text-white">
            Welcome back, {user?.name || 'User'}!
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Role: <span className="font-semibold text-blue-400">{role}</span> | Department: {user?.department || 'CSE'}
          </p>
        </div>

        {(role === 'ADMIN' || role === 'TEACHER') && (
          <Button onClick={() => navigate('/attendance/live')} className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Start Live Attendance Scanner
          </Button>
        )}
      </div>

      {/* ADMIN / TEACHER STAT CARDS */}
      {(role === 'ADMIN' || role === 'TEACHER') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Enrolled Students"
            value={analytics?.totalStudents ?? 0}
            subtitle="Registered in system"
            icon={Users}
            color="blue"
          />
          <DashboardCard
            title="Present Today"
            value={analytics?.presentToday ?? 0}
            subtitle="Identified via face camera"
            icon={UserCheck}
            color="emerald"
          />
          <DashboardCard
            title="Absent Today"
            value={analytics?.absentToday ?? 0}
            subtitle="Pending attendance"
            icon={UserX}
            color="rose"
          />
          <DashboardCard
            title="Attendance Rate"
            value={`${analytics?.attendancePercentage ?? 0}%`}
            subtitle="Today's total ratio"
            icon={Percent}
            color="purple"
          />
        </div>
      )}

      {/* STUDENT STAT CARDS */}
      {role === 'STUDENT' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total Classes Conducted"
            value={studentStats?.totalClasses ?? 0}
            subtitle="Semester sessions"
            icon={Clock}
            color="blue"
          />
          <DashboardCard
            title="Classes Attended"
            value={studentStats?.present ?? 0}
            subtitle="Marked Present"
            icon={CheckCircle}
            color="emerald"
          />
          <DashboardCard
            title="Classes Missed"
            value={studentStats?.absent ?? 0}
            subtitle="Marked Absent"
            icon={UserX}
            color="rose"
          />
          <DashboardCard
            title="Your Attendance %"
            value={`${studentStats?.attendancePercentage ?? 100}%`}
            subtitle={
              (studentStats?.attendancePercentage ?? 100) >= 75
                ? '✅ Satisfactory (>75%)'
                : '⚠️ Low Attendance (<75%)'
            }
            icon={Percent}
            color={(studentStats?.attendancePercentage ?? 100) >= 75 ? 'emerald' : 'rose'}
          />
        </div>
      )}

      {/* Analytics Chart & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {(role === 'ADMIN' || role === 'TEACHER') && (
          <div className="lg:col-span-1 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <BarChart2 className="h-4 w-4 text-blue-400" />
              Today's Attendance Ratio
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className={(role === 'ADMIN' || role === 'TEACHER') ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-4">
              {role === 'STUDENT' ? 'Your Recent Attendance Logs' : 'Recent Scan Logged Today'}
            </h3>
            <AttendanceTable records={recentLogs} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
