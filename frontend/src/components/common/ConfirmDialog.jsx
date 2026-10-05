import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm Action'}>
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-xl border border-amber-200/60 dark:border-amber-800/60">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <p className="text-sm font-medium">{message}</p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-700/80 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 active:scale-95 transition-all shadow-sm shadow-rose-600/30 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
