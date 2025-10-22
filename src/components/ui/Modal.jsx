import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

/**
 * Modal Component - Accessible modal dialog
 * @param {Object} props
 * @param {boolean} props.open - Modal visibility state
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {string} props.description - Modal description (optional)
 * @param {React.ReactNode} props.children - Modal content
 * @param {'sm'|'md'|'lg'|'xl'} props.size - Modal size
 */
export const Modal = ({
  open = false,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className = '',
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/50 dark:bg-gray-950/80 transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative w-full ${sizes[size]} animate-scale-in`}>
          <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-soft-xl border border-gray-200 dark:border-gray-800 ${className}`}>
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex-1 pr-4">
                {title && (
                  <h3 id="modal-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {description}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-base"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
