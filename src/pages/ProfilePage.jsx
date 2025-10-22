import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Calendar, Users, Sparkles } from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';
import HeroCard from '../components/ui/HeroCard';
import StatsCard from '../components/ui/StatsCard';
import ThreadCard from '../components/mobile/ThreadCard';
import EmptyState from '../components/ui/EmptyState';

/**
 * ProfilePage - User profile with stats, threads, and settings
 */
const ProfilePage = ({ currentUser, threads, onLogout, getTimeRemaining, onThreadClick, onActionClick }) => {
  const navigate = useNavigate();

  // User's threads
  const myThreads = threads.filter(t => t.creatorId === currentUser?.id);
  const joinedThreads = threads.filter(t => t.members?.includes(currentUser?.id) && t.creatorId !== currentUser?.id);

  // Stats
  const stats = {
    created: myThreads.length,
    joined: joinedThreads.length,
    totalMembers: myThreads.reduce((acc, t) => acc + t.members.length, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      {/* Profile Header */}
      <div className="px-4 pt-6 safe-top">
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 shadow-xl mb-6">
          {/* Avatar and Info */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <User className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">
                {currentUser?.username}
              </h1>
              <p className="text-sm text-white/80">
                Member since {new Date(currentUser?.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatsCard
              icon="🎯"
              value={stats.created}
              label="Created"
              gradient="from-purple-500 to-pink-500"
            />
            <StatsCard
              icon="✨"
              value={stats.joined}
              label="Joined"
              gradient="from-blue-500 to-cyan-500"
            />
            <StatsCard
              icon="👥"
              value={stats.totalMembers}
              label="Members"
              gradient="from-green-500 to-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => alert('Settings coming soon!')}
            className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-200 dark:border-gray-700"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="font-medium text-gray-900 dark:text-white">Settings</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-red-600 dark:text-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </div>

      {/* My Threads */}
      <div className="px-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          My Threads ({myThreads.length})
        </h2>
        <div className="space-y-3 mb-6">
          {myThreads.length === 0 ? (
            <EmptyState
              icon="📝"
              title="No Threads Created"
              description="Create your first event thread to get started!"
              actionLabel="Create Thread"
              onAction={() => navigate('/create')}
            />
          ) : (
            myThreads.map((thread) => (
              <ThreadCard
                key={thread.id}
                thread={thread}
                currentUser={currentUser}
                onCardClick={onThreadClick}
                onActionClick={onActionClick}
                getTimeRemaining={getTimeRemaining}
              />
            ))
          )}
        </div>

        {/* Joined Threads */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Joined Threads ({joinedThreads.length})
        </h2>
        <div className="space-y-3">
          {joinedThreads.length === 0 ? (
            <EmptyState
              icon="👥"
              title="No Joined Threads"
              description="Explore and join threads to connect with others!"
              actionLabel="Explore"
              onAction={() => navigate('/explore')}
            />
          ) : (
            joinedThreads.map((thread) => (
              <ThreadCard
                key={thread.id}
                thread={thread}
                currentUser={currentUser}
                onCardClick={onThreadClick}
                onActionClick={onActionClick}
                getTimeRemaining={getTimeRemaining}
              />
            ))
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav notificationCount={0} />
    </div>
  );
};

export default ProfilePage;
