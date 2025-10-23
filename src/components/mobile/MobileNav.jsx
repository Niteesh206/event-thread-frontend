import React from 'react';
import { Home, Compass, Plus, Bell, User } from 'lucide-react';

/**
 * MobileNav - Sticky bottom navigation for mobile devices
 * Follows iOS/Android native patterns with safe-area support
 * Minimum 48px touch targets (WCAG AAA compliant)
 */
const MobileNav = ({ 
  activeTab = 'home',
  onTabChange,
  onCreateClick,
  notificationCount = 0,
  className = ''
}) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home', ariaLabel: 'Navigate to home' },
    { id: 'explore', icon: Compass, label: 'Explore', ariaLabel: 'Explore threads' },
    { id: 'create', icon: Plus, label: 'Create', ariaLabel: 'Create new thread', isPrimary: true },
    { id: 'notifications', icon: Bell, label: 'Alerts', ariaLabel: 'View notifications', badge: notificationCount },
    { id: 'profile', icon: User, label: 'Profile', ariaLabel: 'View profile' }
  ];

  const handleNavClick = (itemId) => {
    // Haptic feedback on supported devices
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    if (itemId === 'create') {
      onCreateClick?.();
    } else {
      onTabChange?.(itemId);
    }
  };

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={`
        fixed bottom-0 left-0 right-0 z-50
        bg-white/95 dark:bg-gray-900/95 backdrop-blur-md
        border-t border-gray-200 dark:border-gray-800
        shadow-[0_-4px_16px_rgba(0,0,0,0.08)]
        pb-[env(safe-area-inset-bottom)]
        md:hidden
        ${className}
      `}
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 8px)'
      }}
    >
      <div className="flex justify-around items-center px-2 pt-2 pb-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isPrimary = item.isPrimary;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
              className={`
                relative flex flex-col items-center justify-center gap-0.5
                min-w-[48px] min-h-[48px] px-3 py-1
                rounded-xl transition-all duration-150 ease-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                active:scale-95
                ${isPrimary 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg -mt-3 px-4' 
                  : isActive 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }
              `}
            >
              {/* Icon with badge */}
              <div className="relative">
                <Icon 
                  className={`${isPrimary ? 'w-6 h-6' : 'w-5 h-5'}`}
                  strokeWidth={isActive && !isPrimary ? 2.5 : 2}
                />
                {item.badge > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    aria-label={`${item.badge} new notifications`}
                  >
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              
              {/* Label */}
              <span 
                className={`text-[10px] font-medium leading-none ${
                  isPrimary ? 'mt-0.5' : ''
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
