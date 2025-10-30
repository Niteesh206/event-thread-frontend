import React from 'react';

/**
 * CategoryChip Component - Interactive filter chips
 * @param {Object} props
 * @param {string} props.id - Category identifier
 * @param {boolean} props.active - Whether chip is active/selected
 * @param {boolean} props.isActive - Alternative prop for active state
 * @param {React.ReactNode} props.icon
 * @param {string} props.label
 * @param {number} props.count - Optional count badge
 * @param {Function} props.onClick
 */
export const CategoryChip = ({ id, active = false, isActive = false, icon, label, count, onClick, className = '' }) => {
  const isSelected = active || isActive;
  
  return (
    <button
      onClick={() => onClick && onClick(id)}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
        transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2
        ${isSelected
          ? 'bg-brand-500 text-white shadow-sm'
          : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-gray-50 dark:hover:bg-gray-800'
        }
        ${className}
      `}
    >
      {icon && <span className="w-4 h-4 flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      {count !== undefined && (
        <span className={`text-xs px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
          {count}
        </span>
      )}
    </button>
  );
};

export default CategoryChip;
