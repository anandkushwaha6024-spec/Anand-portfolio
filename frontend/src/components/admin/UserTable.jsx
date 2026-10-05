import React from 'react';
import { RoleBadge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import { Trash2, UserCheck, Shield } from 'lucide-react';

export const UserTable = ({ users, onRoleChange, onDeleteUser }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-slate-700/80 bg-white dark:bg-slate-800 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 dark:border-slate-700/80 bg-gray-50/50 dark:bg-slate-800/50 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
            <th className="px-6 py-4">User Details</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Joined Date</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60 text-sm">
          {users.map((user) => (
            <tr
              key={user._id}
              className="hover:bg-gray-50/80 dark:hover:bg-slate-700/40 transition-colors"
            >
              {/* User Name & Email */}
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{user.email}</p>
                  </div>
                </div>
              </td>

              {/* Role Toggle Select */}
              <td className="px-6 py-4">
                <select
                  value={user.role}
                  onChange={(e) => onRoleChange(user._id, e.target.value)}
                  className="text-xs font-semibold py-1 px-2.5 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-none outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>

              {/* Joined Date */}
              <td className="px-6 py-4 text-xs text-gray-500 dark:text-slate-400">
                {formatDate(user.createdAt)}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onDeleteUser(user._id, user.name)}
                  className="p-1.5 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete User"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
