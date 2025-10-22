import React from 'react';

/**
 * CategoryPill - Compact horizontal scrollable category chip
 * Icon + label or icon-only in tight spaces
 * Snap-scrolling enabled via parent container
 */
const CategoryPill = ({ 
  id,
  icon,
  label,
  isActive = false,
  onClick,
  showLabel = true,
  count,
  className = ''
}) => {
  const handleClick = () => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    onClick?.(id);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`${label}${count ? ` (${count} threads)` : ''}`}
      aria-pressed={isActive}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full
        min-h-[44px] flex-shrink-0
        font-medium text-sm transition-all duration-150 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        active:scale-95
        ${isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }
        ${className}
      `}
    >
      {/* Icon (emoji or lucide icon) */}
      {typeof icon === 'string' ? (
        <span className="text-base leading-none">{icon}</span>
      ) : icon ? (
        React.createElement(icon, { className: 'w-4 h-4', strokeWidth: 2 })
      ) : null}
      
      {/* Label (optional on small screens) */}
      {showLabel && (
        <span className="whitespace-nowrap">{label}</span>
      )}
      
      {/* Count badge */}
      {count > 0 && (
        <span 
          className={`
            px-1.5 py-0.5 rounded-full text-xs font-bold min-w-[20px] text-center
            ${isActive 
              ? 'bg-white/20 text-white' 
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
            }
          `}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};

/**
 * CategoryPillRow - Horizontal scrollable container
 * Snap scrolling + hide scrollbar for native feel
 */
export const CategoryPillRow = ({ children, className = '' }) => {
  return (
    <div 
      className={`
        flex gap-2 overflow-x-auto pb-2
        snap-x snap-mandatory scroll-smooth
        scrollbar-hide
        -mx-4 px-4
        ${className}
      `}
      role="group"
      aria-label="Category filters"
    >
      {React.Children.map(children, (child) => (
        <div className="snap-start">
          {child}
        </div>
      ))}
    </div>
  );
};

export default CategoryPill;
