import React from 'react';

/**
 * StatsCard - Compact stat display with icon and gradient
 * Used in horizontal scrollers or grid layouts
 */
const StatsCard = ({ 
  icon, 
  value, 
  label, 
  gradient = 'from-blue-500 to-cyan-500',
  onClick 
}) => {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`flex-shrink-0 snap-start bg-white dark:bg-gray-800 rounded-xl p-4 min-w-[120px] shadow-sm border border-gray-100 dark:border-gray-700 ${
        onClick ? 'transition-transform active:scale-95 cursor-pointer hover:shadow-md' : ''
      }`}
      {...(onClick && { type: 'button', 'aria-label': `${label}: ${value}` })}
    >
      <div className="flex flex-col items-center gap-2">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
            {label}
          </div>
        </div>
      </div>
    </Component>
  );
};

export default StatsCard;
