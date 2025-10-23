import React from 'react';

/**
 * CategoryChip Component - Interactive filter chips
 * @param {Object} props
 * @param {boolean} props.active - Whether chip is active/selected
 * @param {React.ReactNode} props.icon
 * @param {string} props.label
 * @param {Function} props.onClick
 */
export const CategoryChip = ({ active = false, icon, label, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
        transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2
        ${active
          ? 'bg-brand-500 text-white shadow-sm'
          : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-gray-50 dark:hover:bg-gray-800'
        }
        ${className}
      `}
    >
      {icon && <span className="w-4 h-4 flex-shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default CategoryChip;
