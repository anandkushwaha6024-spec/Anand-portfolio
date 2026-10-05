import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  Users, 
  UserCheck, 
  ScanFace, 
  XCircle, 
  ShieldCheck, 
  Search, 
  Filter, 
  Trash2, 
  UserCog, 
  RefreshCw,
  TrendingUp,
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const { showToast } = useToast();

  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    enrolledFaces: 0,
    successfulIdentifications: 0,
    failedIdentifications: 0
  });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch all users
      const usersRes = await api.get(`/users?search=${encodeURIComponent(search)}${roleFilter ? `&role=${roleFilter}` : ''}`);
      if (usersRes.data.success) {
        setUsers(usersRes.data.users);
      }

      // Fetch identification history logs
      const historyRes = await api.get('/identifications?limit=100');
      if (historyRes.data.success) {
        const logs = historyRes.data.history;
        setHistoryLogs(logs);

        const successCount = logs.filter(l => l.result === 'SUCCESS').length;
        const failCount = logs.length - successCount;

        setMetrics({
          totalUsers: usersRes.data.count || 0,
          enrolledFaces: usersRes.data.users.filter(u => u.isFaceEnrolled).length,
          successfulIdentifications: successCount,
          failedIdentifications: failCount
        });
      }
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      showToast('Error loading admin control metrics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [search, roleFilter]);

  const toggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      const res = await api.put(`/users/${userId}`, { role: newRole });
      if (res.data.success) {
        showToast(`User role changed to ${newRole}.`, 'success');
        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      }
    } catch (err) {
      showToast('Failed to update user role.', 'error');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to delete user account "${name}"?`)) return;

    try {
      const res = await api.delete(`/users/${userId}`);
      if (res.data.success) {
        showToast(`User ${name} deleted successfully.`, 'info');
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (err) {
      showToast('Failed to delete user.', 'error');
    }
  };

  const chartData = [
    { name: 'Total Users', value: metrics.totalUsers, fill: '#3b82f6' },
    { name: 'Enrolled Faces', value: metrics.enrolledFaces, fill: '#06b6d4' },
    { name: 'Matches', value: metrics.successfulIdentifications, fill: '#10b981' },
    { name: 'Failures', value: metrics.failedIdentifications, fill: '#f43f5e' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Executive Dashboard</h1>
            <p className="text-xs text-slate-400">
              System monitoring, user roles, biometric stats, and history management.
            </p>
          </div>
        </div>

        <button onClick={fetchAdminData} className="btn-secondary text-xs shrink-0">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-5 border-blue-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Users</span>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-2 font-mono">{metrics.totalUsers}</div>
          <p className="text-[11px] text-slate-400 mt-1">Registered accounts</p>
        </div>

        <div className="glass-panel p-5 border-cyan-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Enrolled Faces</span>
            <UserCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-400 mt-2 font-mono">{metrics.enrolledFaces}</div>
          <p className="text-[11px] text-slate-400 mt-1">128d Biometric vectors</p>
        </div>

        <div className="glass-panel p-5 border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Successful Identifications</span>
            <ScanFace className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2 font-mono">{metrics.successfulIdentifications}</div>
          <p className="text-[11px] text-slate-400 mt-1">Matches verified</p>
        </div>

        <div className="glass-panel p-5 border-rose-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Failed Identifications</span>
            <XCircle className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400 mt-2 font-mono">{metrics.failedIdentifications}</div>
          <p className="text-[11px] text-slate-400 mt-1">No match / errors</p>
        </div>
      </div>

      {/* Visual Analytics Chart */}
      <div className="glass-panel p-6">
        <h2 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <span>Biometric System Overview Analytics</span>
        </h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                itemStyle={{ color: '#06b6d4' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Management Section */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-bold text-lg text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>User Management & Biometric Status</span>
          </h2>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user..."
                className="glass-input text-xs py-1.5 pl-9"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="glass-input text-xs py-1.5 bg-slate-900"
            >
              <option value="">All Roles</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Biometric Enrollment</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-semibold text-white">{u.name}</div>
                      <div className="text-slate-400 text-[11px]">{u.email}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      u.role === 'ADMIN'
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      u.isFaceEnrolled
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {u.isFaceEnrolled ? 'Enrolled (Vector Saved)' : 'Not Enrolled'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleUserRole(u._id, u.role)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-950 text-slate-300 hover:text-cyan-400 transition-colors"
                        title="Toggle Role (USER / ADMIN)"
                      >
                        <UserCog className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u._id, u.name)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete User Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
