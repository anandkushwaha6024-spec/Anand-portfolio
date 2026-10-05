import React from 'react';
import { PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionLink?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Products Found',
  description = 'We couldn\'t find any items matching your current filters or search term.',
  actionText = 'Explore All Products',
  actionLink = '/shop',
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-900/40 border border-slate-800/80 rounded-3xl">
      <div className="w-16 h-16 rounded-2xl bg-violet-600/10 text-violet-400 flex items-center justify-center mb-4 border border-violet-500/20">
        {icon || <PackageSearch className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">{description}</p>
      {actionLink && (
        <Link
          to={actionLink}
          className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-violet-600/25 transition-all hover:scale-105"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};
