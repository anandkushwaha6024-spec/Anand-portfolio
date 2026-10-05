import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const TaskCharts = ({ stats }) => {
  const statusData = [
    { name: 'To Do', value: stats.todo || 0, color: '#64748b' },
    { name: 'In Progress', value: stats.inProgress || 0, color: '#f59e0b' },
    { name: 'Completed', value: stats.completed || 0, color: '#10b981' },
  ];

  const priorityData = [
    { name: 'Low', count: stats.lowPriority || 0, fill: '#10b981' },
    { name: 'Medium', count: stats.mediumPriority || 0, fill: '#0284c7' },
    { name: 'High', count: stats.highPriority || 0, fill: '#f43f5e' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Status Distribution Donut Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/80 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          Task Distribution by Status
        </h3>
        <div className="h-64 flex items-center justify-center">
          {stats.total === 0 ? (
            <p className="text-sm text-gray-400 dark:text-slate-500">No tasks created yet</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        {/* Custom Legend */}
        <div className="flex justify-center space-x-6 pt-2">
          {statusData.map((item) => (
            <div key={item.name} className="flex items-center space-x-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="text-xs font-medium text-gray-600 dark:text-slate-300">
                {item.name} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Breakdown Bar Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700/80 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
          Tasks by Priority Level
        </h3>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#fff',
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
