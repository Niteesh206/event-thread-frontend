import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, Users, Clock } from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';
import HeroCard from '../components/ui/HeroCard';
import StatsCard from '../components/ui/StatsCard';
import CategoryChip from '../components/ui/CategoryChip';
import { CategoryPillRow } from '../components/mobile/CategoryPill';
import ThreadCard from '../components/mobile/ThreadCard';
import EmptyState from '../components/ui/EmptyState';

/**
 * HomePage - Dashboard with greeting, stats, and thread overview
 * Main landing page for logged-in users
 */
const HomePage = ({ currentUser, threads, categories, filterCategory, onCategoryChange, getTimeRemaining, onThreadClick, onActionClick }) => {
  const navigate = useNavigate();

  // Calculate stats
  const stats = {
    active: threads.filter(t => new Date(t.expiresAt) > new Date()).length,
    joined: threads.filter(t => t.members?.includes(currentUser?.id)).length,
    created: threads.filter(t => t.creatorId === currentUser?.id).length
  };

  // Get recent threads (limit to 5)
  const recentThreads = threads
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      {/* Hero Section */}
      <div className="px-4 pt-6 safe-top">
        <HeroCard
          title={`Welcome back, ${currentUser?.username}! 👋`}
          description="Discover temporary event threads that match your interests"
        >
          {/* Stats Scroller */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-2 px-2 mt-4">
            <StatsCard
              icon="🔥"
              value={stats.active}
              label="Active"
              gradient="from-orange-500 to-red-500"
              onClick={() => navigate('/explore')}
            />
            <StatsCard
              icon="✨"
              value={stats.joined}
              label="Joined"
              gradient="from-blue-500 to-cyan-500"
            />
            <StatsCard
              icon="🎯"
              value={stats.created}
              label="Created"
              gradient="from-purple-500 to-pink-500"
              onClick={() => navigate('/profile')}
            />
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => navigate('/create')}
            className="w-full mt-4 min-h-[48px] bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Create Event Thread
          </button>
        </HeroCard>
      </div>

      {/* Category Filter */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Categories
          </h2>
          <button
            onClick={() => navigate('/categories')}
            className="text-sm text-blue-600 dark:text-blue-400 font-medium"
          >
            See All →
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          {categories.slice(0, 5).map((cat) => (
            <CategoryChip
              key={cat.id}
              id={cat.id}
              icon={cat.label.split(' ')[0]}
              label={cat.label.split(' ').slice(1).join(' ')}
              count={threads.filter(t => t.tags?.some(tag => tag.toLowerCase().includes(cat.id.toLowerCase()))).length}
              isActive={filterCategory === cat.id}
              onClick={onCategoryChange}
            />
          ))}
        </div>
      </div>

      {/* Recent Threads */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Threads
          </h2>
          <button
            onClick={() => navigate('/explore')}
            className="text-sm text-blue-600 dark:text-blue-400 font-medium"
          >
            Explore All →
          </button>
        </div>

        <div className="space-y-3">
          {recentThreads.length === 0 ? (
            <EmptyState
              icon="📅"
              title="No Threads Yet"
              description="Be the first to create an event thread in your community!"
              actionLabel="Create Thread"
              onAction={() => navigate('/create')}
            />
          ) : (
            recentThreads.map((thread) => (
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

export default HomePage;
