import React from 'react';

const LoadingSpinner = ({ text = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} animate-spin rounded-full border-blue-500 border-t-transparent`}
      ></div>
      {text && <p className="mt-3 text-sm font-medium text-slate-300">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
