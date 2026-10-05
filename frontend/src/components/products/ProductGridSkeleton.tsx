import React from 'react';

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 animate-pulse space-y-4">
          <div className="aspect-square bg-slate-800 rounded-xl w-full"></div>
          <div className="h-3 bg-slate-800 rounded w-1/3"></div>
          <div className="h-4 bg-slate-800 rounded w-3/4"></div>
          <div className="h-3 bg-slate-800 rounded w-1/2"></div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
            <div className="h-6 bg-slate-800 rounded w-1/3"></div>
            <div className="w-9 h-9 bg-slate-800 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
