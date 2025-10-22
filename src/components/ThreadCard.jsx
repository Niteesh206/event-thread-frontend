import React from 'react';
import { User, MapPin, Clock, Users as UsersIcon, Hash, MessageCircle, Bell } from 'lucide-react';
import { Card, CardContent, Badge, Button } from './ui';

/**
 * ThreadCard Component - Professional event thread card
 */
export const ThreadCard = ({
  thread,
  currentUser,
  onJoinRequest,
  onOpenChat,
  onEdit,
  onReviewRequests,
  getTimeRemaining,
}) => {
  const isCreator = thread.creatorId === currentUser.id;
  const isMember = thread.members.includes(currentUser.id);
  const hasPendingRequest = thread.pendingRequests.includes(currentUser.id);
  const hasPendingRequests = isCreator && thread.pendingRequests.length > 0;

  return (
    <Card hover className="group">
      <CardContent>
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {thread.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {thread.description}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <User className="w-4 h-4 flex-shrink-0 text-brand-500" />
            <span className="truncate">{thread.creator}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 flex-shrink-0 text-error-500" />
            <span className="truncate">{thread.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 flex-shrink-0 text-warning-500" />
            <span>{getTimeRemaining(thread.expiresAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <UsersIcon className="w-4 h-4 flex-shrink-0 text-success-500" />
            <span>{thread.members.length} members</span>
          </div>
        </div>

        {/* Pending Requests Alert */}
        {hasPendingRequests && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg">
            <Bell className="w-4 h-4 text-warning-600 dark:text-warning-400" />
            <span className="text-sm font-medium text-warning-700 dark:text-warning-300">
              {thread.pendingRequests.length} pending request{thread.pendingRequests.length > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {thread.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="blue" icon={<Hash className="w-3 h-3" />}>
              {tag}
            </Badge>
          ))}
          {thread.tags.length > 3 && (
            <Badge variant="gray">+{thread.tags.length - 3}</Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {isCreator && (
            <Button variant="secondary" size="sm" onClick={onEdit}>
              Edit Thread
            </Button>
          )}

          {isMember ? (
            <Button
              variant="primary"
              size="sm"
              fullWidth={!isCreator}
              leftIcon={<MessageCircle className="w-4 h-4" />}
              onClick={onOpenChat}
            >
              Open Chat ({thread.chat.length})
            </Button>
          ) : hasPendingRequest ? (
            <Button variant="secondary" size="sm" fullWidth disabled>
              <Clock className="w-4 h-4" />
              Request Pending
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              fullWidth={!isCreator}
              onClick={onJoinRequest}
            >
              Request to Join
            </Button>
          )}

          {hasPendingRequests && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onReviewRequests}
              className="border-warning-300 dark:border-warning-700 text-warning-700 dark:text-warning-300 hover:bg-warning-50 dark:hover:bg-warning-900/20"
            >
              Review Requests
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreadCard;
