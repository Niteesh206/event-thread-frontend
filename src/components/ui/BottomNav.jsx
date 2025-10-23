import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Plus, Bell, User } from 'lucide-react';

/**
 * BottomNav - Persistent bottom navigation bar
 * Respects safe-area insets, highlights active route
 */
const BottomNav = ({ notificationCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'gossips', label: 'Gossips', icon: MessageSquare, path: '/gossips' },
    { id: 'create', label: 'Create', icon: Plus, path: '/create', isPrimary: true },
    { id: 'alerts', label: 'Alerts', icon: Bell, path: '/alerts', badge: notificationCount },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' }
  ];

  const handleTabClick = (tab) => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    navigate(tab.path);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname === path + '/';
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around px-2 pt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);

          if (tab.isPrimary) {
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className="flex flex-col items-center justify-center gap-1 relative transition-transform active:scale-95"
                style={{ width: '64px', height: '64px', marginTop: '-20px' }}
                aria-label={tab.label}
                aria-current={active ? 'page' : undefined}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className="flex flex-col items-center justify-center gap-1 relative transition-all"
              style={{ minWidth: '64px', minHeight: '48px' }}
              aria-label={tab.label}
              aria-current={active ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    active
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                  strokeWidth={active ? 2.5 : 2}
                />
                {tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] font-medium transition-colors ${
                  active
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {tab.label}
              </span>
              {active && (
                <div className="absolute -bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
