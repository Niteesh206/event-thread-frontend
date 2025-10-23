import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, Users, Clock, Search } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate stats
  const stats = {
    active: threads.filter(t => new Date(t.expiresAt) > new Date()).length,
    joined: threads.filter(t => t.members?.includes(currentUser?.id)).length,
    created: threads.filter(t => t.creatorId === currentUser?.id).length
  };

  // Filter threads based on search query
  const filteredThreads = searchQuery.trim()
    ? threads.filter(thread =>
        thread.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : threads;

  // Get recent threads (limit to 5)
  const recentThreads = filteredThreads
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

      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search threads, tags, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
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
            {searchQuery ? `Search Results (${filteredThreads.length})` : 'Recent Threads'}
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
              icon={searchQuery ? "�" : "�📅"}
              title={searchQuery ? "No Results Found" : "No Threads Yet"}
              description={searchQuery ? `No threads match "${searchQuery}". Try different keywords.` : "Be the first to create an event thread in your community!"}
              actionLabel={searchQuery ? "Clear Search" : "Create Thread"}
              onAction={() => searchQuery ? setSearchQuery('') : navigate('/create')}
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
