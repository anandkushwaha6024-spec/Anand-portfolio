import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../common/Modal';
import { userService } from '../../services/userService';

export const TaskFormModal = ({ isOpen, onClose, onSubmit, task, isLoading }) => {
  const [users, setUsers] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Fetch users for assignment
    const loadUsers = async () => {
      try {
        const data = await userService.getUsers();
        if (data.success) {
          setUsers(data.users);
        }
      } catch (err) {
        console.error('Failed to fetch user list for task assignment', err);
      }
    };

    if (isOpen) {
      loadUsers();
      if (task) {
        // Format ISO date to YYYY-MM-DD for HTML input date
        const formattedDueDate = task.dueDate
          ? new Date(task.dueDate).toISOString().split('T')[0]
          : '';
        reset({
          title: task.title,
          description: task.description || '',
          priority: task.priority || 'MEDIUM',
          status: task.status || 'TODO',
          dueDate: formattedDueDate,
          assignedTo: task.assignedTo?._id || task.assignedTo || '',
        });
      } else {
        reset({
          title: '',
          description: '',
          priority: 'MEDIUM',
          status: 'TODO',
          dueDate: new Date().toISOString().split('T')[0],
          assignedTo: '',
        });
      }
    }
  }, [isOpen, task, reset]);

  const submitHandler = (data) => {
    onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task Details' : 'Create New Task'}
    >
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Task Title *
          </label>
          <input
            type="text"
            {...register('title', { required: 'Task title is required' })}
            placeholder="e.g. Design Homepage Mockups"
            className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
          {errors.title && (
            <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            rows={3}
            {...register('description')}
            placeholder="Add detailed task instructions..."
            className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
          />
        </div>

        {/* Grid: Priority & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Priority
            </label>
            <select
              {...register('priority')}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {/* Grid: Due Date & Assignee */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Due Date *
            </label>
            <input
              type="date"
              {...register('dueDate', { required: 'Due date is required' })}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-all cursor-pointer"
            />
            {errors.dueDate && (
              <p className="text-xs text-rose-500 mt-1">{errors.dueDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Assigned User
            </label>
            <select
              {...register('assignedTo')}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="">Self (Current User)</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit & Cancel */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-600/30 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
