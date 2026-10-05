import React from 'react';
import { getStatusBadgeColor, getPriorityBadgeColor, formatStatusText } from '../../utils/formatters';

export const StatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeColor(
        status
      )}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75"></span>
      {formatStatusText(status)}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityBadgeColor(
        priority
      )}`}
    >
      {priority}
    </span>
  );
};

export const RoleBadge = ({ role }) => {
  const isAdmin = role === 'ADMIN';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        isAdmin
          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
          : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
      }`}
    >
      {role}
    </span>
  );
};
