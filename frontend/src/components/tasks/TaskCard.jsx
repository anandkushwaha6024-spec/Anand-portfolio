import React from 'react';
import { Calendar, Edit, Trash2, Clock, UserCheck } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { formatDate, isOverdue } from '../../utils/formatters';

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="relative p-5 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header: Status & Priority Badges */}
        <div className="flex items-center justify-between space-x-2 mb-3">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>

        {/* Task Title */}
        <h4 className="text-base font-bold text-gray-900 dark:text-white line-clamp-1 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {task.title}
        </h4>

        {/* Task Description */}
        {task.description && (
          <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-4 border-t border-gray-100 dark:border-slate-700/60 space-y-3">
        {/* Due Date & Assignment */}
        <div className="flex items-center justify-between text-xs">
          <div
            className={`flex items-center space-x-1.5 font-medium ${
              overdue
                ? 'text-rose-600 dark:text-rose-400 font-semibold'
                : 'text-gray-500 dark:text-slate-400'
            }`}
          >
            {overdue ? (
              <Clock className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            ) : (
              <Calendar className="w-3.5 h-3.5" />
            )}
            <span>
              {formatDate(task.dueDate)} {overdue && '(Overdue)'}
            </span>
          </div>

          {task.assignedTo && (
            <div
              className="flex items-center space-x-1 text-gray-500 dark:text-slate-400"
              title={`Assigned to ${task.assignedTo.name}`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="truncate max-w-[100px]">{task.assignedTo.name}</span>
            </div>
          )}
        </div>

        {/* Action Buttons & Status Selector */}
        <div className="flex items-center justify-between pt-1">
          {/* Quick Status Dropdown */}
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task._id, e.target.value)}
            className="text-xs font-semibold py-1 px-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 border-none outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          {/* Edit / Delete Actions */}
          <div className="flex items-center space-x-1">
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
        </div>
      </div>
    </div>
  );
};
