import React from 'react';

export const ThreadCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
    <div className="flex gap-2">
      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
    </div>
    <div className="flex items-center justify-between pt-4 border-t">
      <div className="h-4 w-24 bg-gray-200 rounded"></div>
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export const GossipCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="space-y-2">
        <div className="h-8 w-8 bg-gray-200 rounded"></div>
        <div className="h-8 w-8 bg-gray-200 rounded"></div>
      </div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="flex gap-4">
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

export const ChatMessageSkeleton = () => (
  <div className="flex gap-3 mb-4 animate-pulse">
    <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-24"></div>
      <div className="h-16 bg-gray-200 rounded w-3/4"></div>
    </div>
  </div>
);

const SkeletonLoader = ({ type = 'thread', count = 3 }) => {
  const components = {
    thread: ThreadCardSkeleton,
    gossip: GossipCardSkeleton,
    chat: ChatMessageSkeleton
  };

  const Component = components[type] || ThreadCardSkeleton;

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <Component key={idx} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
