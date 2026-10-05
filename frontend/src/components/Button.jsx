import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  className = ''
}) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20 border-blue-500/30',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20 border-rose-500/30',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 border-emerald-500/30'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${className}`}
    >
      {loading ? <LoadingSpinner text="" size="sm" /> : children}
    </button>
  );
};

export default Button;
