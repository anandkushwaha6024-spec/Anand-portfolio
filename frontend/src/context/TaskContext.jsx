import React, { createContext, useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { useAuth } from '../hooks/useAuth';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [scope, setScope] = useState('user'); // 'user' or 'all' (admin)

  // Fetch tasks with current filters
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const params = {
        search,
        status: statusFilter,
        priority: priorityFilter,
        sortBy,
        sortOrder,
        scope: user.role === 'ADMIN' ? scope : 'user',
      };
      const data = await taskService.getTasks(params);
      if (data.success) {
        setTasks(data.tasks);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('[TaskContext Error]:', err);
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [user, search, statusFilter, priorityFilter, sortBy, sortOrder, scope]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create Task
  const addTask = async (taskData) => {
    try {
      const data = await taskService.createTask(taskData);
      if (data.success) {
        await fetchTasks();
        return { success: true, message: 'Task created successfully!' };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create task.';
      return { success: false, message: msg };
    }
  };

  // Update Task
  const updateTask = async (id, taskData) => {
    try {
      const data = await taskService.updateTask(id, taskData);
      if (data.success) {
        await fetchTasks();
        return { success: true, message: 'Task updated successfully!' };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update task.';
      return { success: false, message: msg };
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      const data = await taskService.deleteTask(id);
      if (data.success) {
        await fetchTasks();
        return { success: true, message: 'Task deleted successfully!' };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete task.';
      return { success: false, message: msg };
    }
  };

  // Quick Change Status
  const changeStatus = async (id, newStatus) => {
    try {
      const data = await taskService.updateTaskStatus(id, newStatus);
      if (data.success) {
        await fetchTasks();
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update status.';
      return { success: false, message: msg };
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        loading,
        error,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        priorityFilter,
        setPriorityFilter,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        scope,
        setScope,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        changeStatus,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
