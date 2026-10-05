import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { StatCard } from '../components/common/StatCard';
import { UserTable } from '../components/admin/UserTable';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ShieldCheck, Users, CheckSquare, AlertCircle } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteUserName, setDeleteUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, usersData] = await Promise.all([
        userService.getAdminStats(),
        userService.getUsers(),
      ]);

      if (statsData.success) setStats(statsData.stats);
      if (usersData.success) setUsers(usersData.users);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setError(err.response?.data?.message || 'Failed to load system statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await userService.updateUser(userId, { role: newRole });
      if (res.success) {
        await loadAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  const handleOpenDelete = (userId, userName) => {
    setDeleteUserId(userId);
    setDeleteUserName(userName);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteUserId) return;
    setIsSubmitting(true);
    try {
      const res = await userService.deleteUser(deleteUserId);
      if (res.success) {
        await loadAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setIsSubmitting(false);
      setIsConfirmOpen(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading Admin Management Console..." />;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Title */}
      <div className="flex items-center space-x-3">
        <div className="p-3 rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-500/30">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            System Administration Panel
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Monitor system metrics, manage user roles, and control global task operations
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 dark:text-rose-400 text-sm font-semibold flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Registered Users"
            value={stats.users.total}
            icon={Users}
            color="purple"
            description={`${stats.users.admins} Admins, ${stats.users.regularUsers} Regular`}
          />
          <StatCard
            title="Global System Tasks"
            value={stats.tasks.total}
            icon={CheckSquare}
            color="blue"
            description="Created across all users"
          />
          <StatCard
            title="Completed Tasks"
            value={stats.tasks.completed}
            icon={CheckSquare}
            color="emerald"
            description={`${Math.round((stats.tasks.completed / (stats.tasks.total || 1)) * 100)}% completion rate`}
          />
          <StatCard
            title="Overdue Tasks"
            value={stats.tasks.overdue}
            icon={AlertCircle}
            color="rose"
            description="System-wide overdue tasks"
          />
        </div>
      )}

      {/* User Management Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">User Management</h3>
        <UserTable
          users={users}
          onRoleChange={handleRoleChange}
          onDeleteUser={handleOpenDelete}
        />
      </div>

      {/* Delete User Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User Account"
        message={`Are you sure you want to delete user "${deleteUserName}" and all associated tasks? This action is permanent.`}
        isLoading={isSubmitting}
      />
    </div>
  );
};
