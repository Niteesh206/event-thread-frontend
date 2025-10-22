import React from 'react';
import { Clock, MapPin, Users, MessageCircle, ChevronRight } from 'lucide-react';

/**
 * ThreadCard - Mobile-optimized single-column card
 * Progressive disclosure: show essentials, tap for details
 * 44px+ touch targets for all interactive elements
 */
const ThreadCard = ({ 
  thread,
  currentUser,
  onCardClick,
  onActionClick,
  getTimeRemaining,
  className = ''
}) => {
  const isCreator = thread.creatorId === currentUser?.id;
  const isMember = thread.members?.includes(currentUser?.id);
  const hasPendingRequest = thread.pendingRequests?.includes(currentUser?.id);
  const hasPendingRequests = isCreator && thread.pendingRequests?.length > 0;

  const handleCardClick = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    onCardClick?.(thread);
  };

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    onActionClick?.(thread, action);
  };

  // Get primary action
  const getPrimaryAction = () => {
    if (hasPendingRequests) {
      return {
        label: `Review ${thread.pendingRequests.length} Request${thread.pendingRequests.length > 1 ? 's' : ''}`,
        variant: 'warning',
        action: 'review'
      };
    }
    if (isMember) {
      return {
        label: 'Open Chat',
        variant: 'primary',
        action: 'chat',
        badge: thread.chat?.length || 0
      };
    }
    if (hasPendingRequest) {
      return {
        label: 'Request Pending',
        variant: 'disabled',
        action: null
      };
    }
    return {
      label: 'Request to Join',
      variant: 'secondary',
      action: 'request'
    };
  };

  const primaryAction = getPrimaryAction();

  return (
    <div
      role="article"
      aria-label={`Event thread: ${thread.title}`}
      className={`
        bg-white dark:bg-gray-800/70 
        rounded-2xl border border-gray-200 dark:border-gray-700
        shadow-sm hover:shadow-md
        transition-all duration-150 ease-out
        overflow-hidden
        ${className}
      `}
    >
      {/* Header with category color accent */}
      <div 
        className="h-1 bg-gradient-to-r from-blue-600 to-purple-600"
        aria-hidden="true"
      />
      
      {/* Content - tappable */}
      <button
        onClick={handleCardClick}
        className="w-full text-left p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
        aria-label={`View details for ${thread.title}`}
      >
        {/* Title & Category */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-base text-gray-900 dark:text-white leading-snug flex-1 line-clamp-2">
            {thread.title}
          </h3>
          <ChevronRight 
            className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" 
            aria-hidden="true"
          />
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {thread.description}
        </p>

        {/* Metadata Grid - 2x2 on mobile */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{getTimeRemaining(thread.expiresAt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-green-500 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{thread.members?.length || 0} joined</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" aria-hidden="true" />
            <span className="truncate">{thread.location}</span>
          </div>
        </div>

        {/* Tags - show first 2 */}
        {thread.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {thread.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
            {thread.tags.length > 2 && (
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full font-medium">
                +{thread.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Action Button - 48px min height */}
      <div className="px-4 pb-4">
        <button
          onClick={(e) => handleActionClick(e, primaryAction.action)}
          disabled={primaryAction.variant === 'disabled'}
          aria-label={primaryAction.label}
          className={`
            w-full min-h-[48px] px-4 py-3 rounded-xl
            font-semibold text-sm flex items-center justify-center gap-2
            transition-all duration-150 ease-out
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
            active:scale-[0.98]
            ${primaryAction.variant === 'primary' 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg' 
              : primaryAction.variant === 'warning'
              ? 'bg-orange-500 text-white shadow-md hover:shadow-lg'
              : primaryAction.variant === 'secondary'
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {primaryAction.variant === 'primary' && (
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
          )}
          <span>{primaryAction.label}</span>
          {primaryAction.badge > 0 && (
            <span 
              className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full font-bold min-w-[20px] text-center"
              aria-label={`${primaryAction.badge} new messages`}
            >
              {primaryAction.badge}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ThreadCard;
