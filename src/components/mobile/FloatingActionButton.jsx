import React from 'react';
import { Plus } from 'lucide-react';

/**
 * FloatingActionButton (FAB) - Primary action button
 * Positioned in bottom-right with safe-area support
 * 56x56px for optimal thumb reach
 */
const FloatingActionButton = ({ 
  onClick,
  icon: Icon = Plus,
  ariaLabel = 'Create new thread',
  className = '',
  disabled = false
}) => {
  const handleClick = () => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        fixed bottom-20 right-4 z-40
        w-14 h-14 rounded-full
        bg-gradient-to-r from-blue-600 to-purple-600
        text-white shadow-2xl
        flex items-center justify-center
        transition-all duration-200 ease-out
        hover:shadow-[0_8px_24px_rgba(59,130,246,0.4)]
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        md:hidden
        ${className}
      `}
      style={{
        bottom: `calc(env(safe-area-inset-bottom) + 5rem)`
      }}
    >
      <Icon className="w-6 h-6" strokeWidth={2.5} />
      
      {/* Ripple effect */}
      <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-blue-500" />
    </button>
  );
};

export default FloatingActionButton;
