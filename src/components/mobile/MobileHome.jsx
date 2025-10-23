import React, { useState } from 'react';
import { Calendar, TrendingUp, Sparkles } from 'lucide-react';
import MobileNav from './MobileNav';
import FloatingActionButton from './FloatingActionButton';
import CategoryPill, { CategoryPillRow } from './CategoryPill';
import ThreadCard from './ThreadCard';
import BottomSheetFilter from './BottomSheetFilter';

/**
 * MobileHome - Mobile-first home page layout
 * Single column, bottom nav, compact hero, scrollable categories
 */
const MobileHome = ({
  currentUser,
  threads = [],
  filterCategory,
  sortBy,
  categories = [],
  onCategoryChange,
  onSortChange,
  onThreadClick,
  onActionClick,
  onCreateClick,
  onGossipsClick,
  onLogout,
  getTimeRemaining,
  notificationCount = 0
}) => {
  const [activeTab, setActiveTab] = useState('home');
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showSortSheet, setShowSortSheet] = useState(false);

  // Filter and sort threads
  const getFilteredAndSortedThreads = () => {
    let filtered = threads;

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = threads.filter(thread => 
        thread.tags.some(tag => 
          tag.toLowerCase().includes(filterCategory.toLowerCase()) ||
          (filterCategory === 'tech' && (tag.toLowerCase().includes('coding') || tag.toLowerCase().includes('programming'))) ||
          (filterCategory === 'study' && (tag.toLowerCase().includes('study') || tag.toLowerCase().includes('learning')))
        )
      );
    }

    // Sort threads
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'mostMembers':
          return b.members.length - a.members.length;
        case 'expiringSoon':
          return new Date(a.expiresAt) - new Date(b.expiresAt);
        case 'mostActive':
          return b.chat.length - a.chat.length;
        default:
          return 0;
      }
    });

    return sorted;
  };

  const filteredThreads = getFilteredAndSortedThreads();

  // Stats for hero
  const stats = {
    active: threads.filter(t => t.members?.includes(currentUser?.id)).length,
    joined: threads.filter(t => t.members?.includes(currentUser?.id)).length,
    created: threads.filter(t => t.creatorId === currentUser?.id).length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Compact Hero - Above the fold */}
      <header className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 px-4 pt-8 pb-6 safe-top">
        {/* Welcome */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-white mb-1">
            Welcome back, <span className="text-blue-100">{currentUser?.username}</span>! 👋
          </h1>
          <p className="text-sm text-blue-100 leading-relaxed">
            Discover temporary event threads that match your interests
          </p>
        </div>

        {/* Stats Scroller - Horizontal */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4">
          {[
            { label: 'Active', value: stats.active, icon: '🔥', color: 'from-orange-500 to-red-500' },
            { label: 'Joined', value: stats.joined, icon: '✨', color: 'from-blue-500 to-cyan-500' },
            { label: 'Created', value: stats.created, icon: '🎯', color: 'from-purple-500 to-pink-500' }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 snap-start bg-white/10 backdrop-blur-md rounded-xl p-3 min-w-[100px]"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-blue-100 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Primary CTA */}
        <button
          onClick={onCreateClick}
          className="w-full mt-4 min-h-[48px] bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Create Event Thread
        </button>
      </header>

      {/* Category Filter Row - Sticky */}
      <div className="sticky top-0 z-30 bg-gray-50/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 py-3">
        <CategoryPillRow>
          {categories.map((cat) => {
            const threadCount = cat.id === 'all' 
              ? threads.length 
              : threads.filter(t => t.tags?.some(tag => 
                  tag.toLowerCase().includes(cat.id.toLowerCase())
                )).length;

            return (
              <CategoryPill
                key={cat.id}
                id={cat.id}
                icon={cat.label.split(' ')[0]} // Extract emoji
                label={cat.label.split(' ').slice(1).join(' ')} // Remove emoji from label
                isActive={filterCategory === cat.id}
                onClick={onCategoryChange}
                count={threadCount}
                showLabel={true}
              />
            );
          })}
        </CategoryPillRow>
      </div>

      {/* Sort & Filter Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          {filterCategory === 'all' ? 'All Threads' : categories.find(c => c.id === filterCategory)?.label}
          <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
            ({filteredThreads.length})
          </span>
        </h2>
        <button
          onClick={() => setShowSortSheet(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium min-h-[36px]"
        >
          <TrendingUp className="w-4 h-4" />
          Sort
        </button>
      </div>

      {/* Thread List - Single Column */}
      <div className="px-4 space-y-4 pb-4">
        {filteredThreads.length === 0 ? (
          // Empty State
          <div className="text-center py-12 px-4">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
              <Calendar className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              No Threads Yet
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Be the first to create an event thread!
            </p>
            <button
              onClick={onCreateClick}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg min-h-[48px]"
            >
              Create First Thread
            </button>
          </div>
        ) : (
          filteredThreads.map((thread) => (
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

      {/* Mobile Navigation */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCreateClick={onCreateClick}
        notificationCount={notificationCount}
      />

      {/* FAB - Alternative to nav button */}
      {/* <FloatingActionButton onClick={onCreateClick} /> */}

      {/* Sort Bottom Sheet */}
      <BottomSheetFilter
        isOpen={showSortSheet}
        onClose={() => setShowSortSheet(false)}
        title="Sort Threads"
        description="Choose how to order threads"
      >
        <div className="space-y-2">
          {[
            { id: 'newest', label: '🆕 Newest First', desc: 'Most recently created' },
            { id: 'oldest', label: '⏰ Oldest First', desc: 'Oldest threads first' },
            { id: 'mostMembers', label: '👥 Most Members', desc: 'Popular threads' },
            { id: 'expiringSoon', label: '⚡ Expiring Soon', desc: 'Join before it ends' },
            { id: 'mostActive', label: '💬 Most Active', desc: 'Most messages' }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onSortChange(option.id);
                setShowSortSheet(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors min-h-[56px] ${
                sortBy === option.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500'
                  : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              <div className="font-semibold text-gray-900 dark:text-white">
                {option.label}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {option.desc}
              </div>
            </button>
          ))}
        </div>
      </BottomSheetFilter>
    </div>
  );
};

export default MobileHome;
