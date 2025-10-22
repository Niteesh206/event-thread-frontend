import React, { useState } from 'react';
import { TrendingUp, Filter, Search } from 'lucide-react';
import BottomNav from '../components/ui/BottomNav';
import HeroCard from '../components/ui/HeroCard';
import CategoryChip from '../components/ui/CategoryChip';
import ThreadCard from '../components/mobile/ThreadCard';
import BottomSheetFilter from '../components/mobile/BottomSheetFilter';
import EmptyState from '../components/ui/EmptyState';

/**
 * ExplorePage - Browse and discover threads by category and trending
 * Shows all available threads with filtering and sorting
 */
const ExplorePage = ({ currentUser, threads, categories, getTimeRemaining, onThreadClick, onActionClick }) => {
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter threads
  const getFilteredThreads = () => {
    let filtered = threads;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(thread =>
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

  const filteredThreads = getFilteredThreads();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24">
      {/* Hero Section */}
      <div className="px-4 pt-6 safe-top">
        <HeroCard
          title="Explore Threads"
          description="Discover trending events and join conversations"
          gradient="from-purple-600 via-pink-600 to-red-500"
        >
          {/* Search Bar */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search threads, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </HeroCard>
      </div>

      {/* Category Filter */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Filter by Category
          </h3>
          <button
            onClick={() => setShowSortSheet(true)}
            className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 font-medium"
          >
            <Filter className="w-4 h-4" />
            Sort
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          {categories.map((cat) => {
            const threadCount = cat.id === 'all'
              ? threads.length
              : threads.filter(t => t.tags?.some(tag => tag.toLowerCase().includes(cat.id.toLowerCase()))).length;

            return (
              <CategoryChip
                key={cat.id}
                id={cat.id}
                icon={cat.label.split(' ')[0]}
                label={cat.label.split(' ').slice(1).join(' ')}
                count={threadCount}
                isActive={filterCategory === cat.id}
                onClick={setFilterCategory}
              />
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="px-4 mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <TrendingUp className="w-4 h-4" />
          <span>
            {filteredThreads.length} {filteredThreads.length === 1 ? 'thread' : 'threads'} found
          </span>
        </div>
      </div>

      {/* Thread List */}
      <div className="px-4 space-y-3">
        {filteredThreads.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No Threads Found"
            description="Try adjusting your filters or search terms to find more threads."
            actionLabel="Clear Filters"
            onAction={() => {
              setFilterCategory('all');
              setSearchQuery('');
            }}
          />
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

      {/* Sort Bottom Sheet */}
      <BottomSheetFilter
        isOpen={showSortSheet}
        onClose={() => setShowSortSheet(false)}
        title="Sort Threads"
        description="Choose how to sort the thread list"
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
                setSortBy(option.id);
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
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {option.desc}
              </div>
            </button>
          ))}
        </div>
      </BottomSheetFilter>

      {/* Bottom Navigation */}
      <BottomNav notificationCount={0} />
    </div>
  );
};

export default ExplorePage;
