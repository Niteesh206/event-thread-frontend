import React from 'react';

/**
 * Badge Component - Small status indicators
 * @param {Object} props
 * @param {'blue'|'gray'|'green'|'orange'|'red'} props.variant
 * @param {React.ReactNode} props.icon
 * @param {React.ReactNode} props.children
 */
export const Badge = ({ variant = 'gray', icon, className = '', children }) => {
  const variants = {
    blue: 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800',
    gray: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    green: 'bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-300 border-success-200 dark:border-success-800',
    orange: 'bg-warning-50 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300 border-warning-200 dark:border-warning-800',
    red: 'bg-error-50 dark:bg-error-900/30 text-error-700 dark:text-error-300 border-error-200 dark:border-error-800',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${variants[variant]} ${className}`}>
      {icon && <span className="w-3.5 h-3.5">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
