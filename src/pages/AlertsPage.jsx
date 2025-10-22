import React from 'react';
import { Bell, Calendar, MessageCircle, AlertTriangle } from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';
import HeroCard from '../components/ui/HeroCard';
import EmptyState from '../components/ui/EmptyState';

/**
 * AlertsPage - Notification center for joined events, updates, and alerts
 */
const AlertsPage = ({ currentUser, threads }) => {
  // Get user's joined threads
  const joinedThreads = threads.filter(t => t.members?.includes(currentUser?.id));
  
  // Mock alerts (in production, fetch from backend)
  const alerts = [
    ...joinedThreads.map(t => ({
      id: `thread-${t.id}`,
      type: 'event',
      title: t.title,
      message: `Event starts soon at ${t.location}`,
      time: new Date(t.expiresAt),
      icon: '📅',
      read: false
    }))
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      {/* Hero Section */}
      <div className="px-4 pt-6 safe-top">
        <HeroCard
          title="Notifications"
          description="Stay updated on your events and alerts"
          gradient="from-orange-600 via-red-600 to-pink-500"
        />
      </div>

      {/* Alerts List */}
      <div className="px-4 space-y-3">
        {alerts.length === 0 ? (
          <EmptyState
            icon="🔔"
            title="No Notifications"
            description="You're all caught up! Check back later for updates on your events."
          />
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border ${
                alert.read
                  ? 'border-gray-200 dark:border-gray-700'
                  : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
              }`}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 text-2xl">
                  {alert.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {alert.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {alert.message}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {alert.time.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav notificationCount={alerts.filter(a => !a.read).length} />
    </div>
  );
};

export default AlertsPage;
