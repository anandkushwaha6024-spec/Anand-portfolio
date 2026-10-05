import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../hooks/useAuth';
import { TaskFilterBar } from '../components/tasks/TaskFilterBar';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskTable } from '../components/tasks/TaskTable';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { CheckSquare, AlertCircle } from 'lucide-react';

export const Tasks = () => {
  const { user } = useAuth();
  const {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    changeStatus,
    scope,
    setScope,
  } = useTasks();

  const [viewMode, setViewMode] = useState('grid');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Open create task modal
  const handleOpenCreate = () => {
    setSelectedTask(null);
    setIsFormModalOpen(true);
  };

  // Open edit task modal
  const handleOpenEdit = (task) => {
    setSelectedTask(task);
    setIsFormModalOpen(true);
  };

  // Submit handler for create/edit
  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    let res;
    if (selectedTask) {
      res = await updateTask(selectedTask._id, data);
    } else {
      res = await addTask(data);
    }
    setIsSubmitting(false);

    if (res.success) {
      setIsFormModalOpen(false);
      setSelectedTask(null);
    }
  };

  // Open delete dialog
  const handleOpenDelete = (id) => {
    setDeleteTaskId(id);
    setIsConfirmOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deleteTaskId) return;
    setIsSubmitting(true);
    await deleteTask(deleteTaskId);
    setIsSubmitting(false);
    setIsConfirmOpen(false);
    setDeleteTaskId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Task Management
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Create, track, filter, and organize all your project tasks
          </p>
        </div>

        {/* Admin Scope Selector */}
        {user?.role === 'ADMIN' && (
          <div className="flex items-center p-1 bg-gray-100 dark:bg-slate-700 rounded-xl">
            <button
              onClick={() => setScope('user')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scope === 'user'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-slate-400'
              }`}
            >
              My Tasks
            </button>
            <button
              onClick={() => setScope('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                scope === 'all'
                  ? 'bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-500 dark:text-slate-400'
              }`}
            >
              All System Tasks
            </button>
          </div>
        )}
      </div>

      {/* Filter & Action Controls */}
      <TaskFilterBar
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenCreateModal={handleOpenCreate}
      />

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 dark:text-rose-400 text-sm font-semibold flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Task List / Loading / Empty State */}
      {loading ? (
        <LoadingSpinner message="Fetching your tasks..." />
      ) : tasks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">No Tasks Found</h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
            No tasks match your current search and filter criteria. Try clearing filters or create a new task.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onStatusChange={changeStatus}
            />
          ))}
        </div>
      ) : (
        <TaskTable
          tasks={tasks}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onStatusChange={changeStatus}
        />
      )}

      {/* Create / Edit Form Modal */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        task={selectedTask}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to permanently delete this task? This action cannot be undone."
        isLoading={isSubmitting}
      />
    </div>
  );
};
