import React from 'react';
import { Edit, Trash2, Calendar, UserCheck } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { formatDate, isOverdue } from '../../utils/formatters';

export const TaskTable = ({ tasks, onEdit, onDelete, onStatusChange }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-slate-700/80 bg-white dark:bg-slate-800 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 dark:border-slate-700/80 bg-gray-50/50 dark:bg-slate-800/50 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
            <th className="px-6 py-4">Task Details</th>
            <th className="px-6 py-4">Priority</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Due Date</th>
            <th className="px-6 py-4">Assigned To</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-slate-700/60 text-sm">
          {tasks.map((task) => {
            const overdue = isOverdue(task.dueDate, task.status);

            return (
              <tr
                key={task._id}
                className="hover:bg-gray-50/80 dark:hover:bg-slate-700/40 transition-colors"
              >
                {/* Title & Description */}
                <td className="px-6 py-4 max-w-xs">
                  <p className="font-bold text-gray-900 dark:text-white truncate">
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                      {task.description}
                    </p>
                  )}
                </td>

                {/* Priority */}
                <td className="px-6 py-4">
                  <PriorityBadge priority={task.priority} />
                </td>

                {/* Status Dropdown / Badge */}
                <td className="px-6 py-4">
                  <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task._id, e.target.value)}
                    className="text-xs font-semibold py-1 px-2.5 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-none outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </td>

                {/* Due Date */}
                <td className="px-6 py-4">
                  <div
                    className={`flex items-center space-x-1.5 text-xs font-medium ${
                      overdue
                        ? 'text-rose-600 dark:text-rose-400 font-semibold'
                        : 'text-gray-600 dark:text-slate-300'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {formatDate(task.dueDate)} {overdue && '(Overdue)'}
                    </span>
                  </div>
                </td>

                {/* Assigned User */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-slate-300">
                    <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate max-w-[120px]">
                      {task.assignedTo?.name || 'Unassigned'}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(task)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      title="Edit Task"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(task._id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
