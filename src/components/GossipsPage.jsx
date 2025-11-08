
import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, Plus, X, Send, Trash2, ArrowLeft, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { gossipsAPI } from '../services/api';

const GossipsPage = ({ currentUser, socketRef, onBack }) => {
  const [gossips, setGossips] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedGossip, setSelectedGossip] = useState(null); // NEW: Single gossip view
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGossips();
  }, [sortBy]);

  useEffect(() => {
    if (socketRef?.current) {
      socketRef.current.on('gossip-updated', () => loadGossips());
      socketRef.current.on('gossip-comment-added', () => loadGossips());
      socketRef.current.on('gossip-deleted', () => loadGossips());

      return () => {
        socketRef.current.off('gossip-updated');
        socketRef.current.off('gossip-comment-added');
        socketRef.current.off('gossip-deleted');
      };
    }
  }, [socketRef]);

  const loadGossips = async () => {
    try {
      const response = await gossipsAPI.getAll(sortBy);
      if (response.data.success) {
        setGossips(response.data.gossips);
      }
    } catch (error) {
      console.error('Error loading gossips:', error);
    }
  };

  const handleVote = async (gossipId, voteType) => {
    try {
      const result = await gossipsAPI.vote(gossipId, currentUser.id, voteType);
      if (result.data.success) {
        setGossips(prevGossips =>
          prevGossips.map(g =>
            g.id === gossipId
              ? { ...g, upvotes: result.data.upvotes, downvotes: result.data.downvotes }
              : g
          )
        );
        // Update selected gossip if viewing
        if (selectedGossip?.id === gossipId) {
          setSelectedGossip(prev => ({ ...prev, upvotes: result.data.upvotes, downvotes: result.data.downvotes }));
        }
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const handleDelete = async (gossipId) => {
    if (window.confirm('Are you sure you want to delete this gossip?')) {
      try {
        await gossipsAPI.delete(gossipId, currentUser.id);
        loadGossips();
        if (selectedGossip?.id === gossipId) {
          setSelectedGossip(null); // Close view if deleted
        }
      } catch (error) {
        alert('Error deleting gossip');
      }
    }
  };

  const handleBack = () => {
    if (window.confirm('Are you sure you want to leave Gossips? You will return to the main page.')) {
      onBack();
    }
  };

  const handleGossipClick = (gossip) => {
    setSelectedGossip(gossip);
  };

  // If a gossip is selected, show single view
  if (selectedGossip) {
    return (
      <SingleGossipView
        gossip={selectedGossip}
        currentUser={currentUser}
        onBack={() => setSelectedGossip(null)}
        onVote={handleVote}
        onDelete={handleDelete}
        onCommentAdded={loadGossips}
      />
    );
  }

  // Otherwise show list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white animate-fade-in">
      <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white shadow-2xl sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 animate-slide-in">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-white/20 rounded-xl transition-all hover:scale-110 active:scale-95"
                title="Back to Home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">💬 Gossips</h1>
                <p className="text-purple-100 mt-1 text-sm">Share anonymously, vote freely!</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-xl hover:bg-purple-50 hover:shadow-lg transition-all font-medium"
            >
              <Plus className="w-5 h-5" />
              Post Gossip
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Sort Options */}
        <div className="mb-6 flex gap-3 flex-wrap">
          {[
            { id: 'newest', label: '🆕 Newest' },
            { id: 'popular', label: '🔥 Popular' },
            { id: 'controversial', label: '⚡ Controversial' }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setSortBy(option.id)}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all transform hover:scale-105 ${
                sortBy === option.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:shadow-md border border-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-xl border border-gray-200">
            <span className="font-medium">{gossips.length}</span> gossip{gossips.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Gossips List */}
        <div className="space-y-4">
          {gossips.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-purple-100">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-gray-500 text-lg font-medium mb-2">No gossips yet</p>
              <p className="text-gray-400 text-sm">Be the first to share something interesting!</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Create First Gossip
              </button>
            </div>
          ) : (
            gossips.map((gossip, idx) => (
              <GossipListItem
                key={gossip.id}
                gossip={gossip}
                currentUser={currentUser}
                onVote={handleVote}
                onClick={() => handleGossipClick(gossip)}
                idx={idx}
              />
            ))
          )}
        </div>
      </main>

      {showCreateForm && (
        <CreateGossipForm
          currentUser={currentUser}
          onClose={() => setShowCreateForm(false)}
          onSuccess={loadGossips}
        />
      )}
    </div>
  );
};

// Gossip List Item - Compact view for list
const GossipListItem = ({ gossip, currentUser, onVote, onClick, idx }) => {
  const hasUpvoted = gossip.upvotedBy.includes(currentUser.id);
  const hasDownvoted = gossip.downvotedBy.includes(currentUser.id);
  const score = gossip.upvotes - gossip.downvotes;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer animate-slide-in"
      style={{ animationDelay: `${idx * 50}ms` }}
    >
      <div className="flex gap-4 p-4">
        {/* Vote Section - Left Side */}
        <div className="flex flex-col items-center gap-2 min-w-[50px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVote(gossip.id, hasUpvoted ? null : 'up');
            }}
            className={`p-2 rounded-lg transition-all ${
              hasUpvoted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-50'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
          <span className={`font-bold text-lg ${
            score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {score}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVote(gossip.id, hasDownvoted ? null : 'down');
            }}
            className={`p-2 rounded-lg transition-all ${
              hasDownvoted ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-50'
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span className="font-semibold text-gray-900">{gossip.author}</span>
            <span>•</span>
            <span>{new Date(gossip.createdAt).toLocaleString()}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-orange-600 font-medium">
              <Clock className="w-3 h-3" />
              {getTimeRemaining(gossip.expiresAt)}
            </span>
          </div>
          <p className="text-gray-900 text-base leading-relaxed mb-3 line-clamp-3">
            {gossip.content}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>{gossip.comments.length} comments</span>
            </div>
            <button className="hover:text-purple-600 font-medium">
              Share
            </button>
            <button className="hover:text-purple-600 font-medium">
              Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Single Gossip View - Full page for one gossip
const SingleGossipView = ({ gossip, currentUser, onBack, onVote, onDelete, onCommentAdded }) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const hasUpvoted = gossip.upvotedBy.includes(currentUser.id);
  const hasDownvoted = gossip.downvotedBy.includes(currentUser.id);
  const isAuthor = gossip.authorId === currentUser.id;
  const isAdmin = currentUser.isAdmin;
  const score = gossip.upvotes - gossip.downvotes;

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);

    try {
      const commentData = {
        content: newComment,
        authorId: currentUser.id,
        authorUsername: currentUser.username,
        parentCommentId: null,
        replyTo: null
      };

      await gossipsAPI.addComment(gossip.id, commentData);
      setNewComment('');
      setShowCommentBox(false);
      onCommentAdded();
    } catch (error) {
      alert('Error adding comment');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (parentId, parentAuthor, content) => {
    try {
      const commentData = {
        content: content,
        authorId: currentUser.id,
        authorUsername: currentUser.username,
        parentCommentId: parentId,
        replyTo: parentAuthor
      };

      await gossipsAPI.addComment(gossip.id, commentData);
      onCommentAdded();
    } catch (error) {
      alert('Error adding reply');
    }
  };

  const buildCommentTree = (comments) => {
    const commentMap = {};
    const roots = [];

    comments.forEach(comment => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    comments.forEach(comment => {
      if (comment.parentCommentId && commentMap[comment.parentCommentId]) {
        commentMap[comment.parentCommentId].replies.push(commentMap[comment.id]);
      } else if (!comment.parentCommentId) {
        roots.push(commentMap[comment.id]);
      }
    });

    return roots;
  };

  const commentTree = buildCommentTree(gossip.comments);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Back to gossips list"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Gossip</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Posted by {gossip.author}
              </p>
            </div>
            {(isAuthor || isAdmin) && (
              <button
                onClick={() => onDelete(gossip.id)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Delete gossip"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Gossip Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
          <div className="flex gap-4 p-6">
            {/* Vote Section */}
            <div className="flex flex-col items-center gap-2 min-w-[50px]">
              <button
                onClick={() => onVote(gossip.id, hasUpvoted ? null : 'up')}
                className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                  hasUpvoted ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
              </button>
              <span className={`font-bold text-xl ${
                score > 0 ? 'text-green-600 dark:text-green-400' : 
                score < 0 ? 'text-red-600 dark:text-red-400' : 
                'text-gray-600 dark:text-gray-400'
              }`}>
                {score}
              </span>
              <button
                onClick={() => onVote(gossip.id, hasDownvoted ? null : 'down')}
                className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                  hasDownvoted ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              >
                <ThumbsDown className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span className="font-semibold text-gray-900 dark:text-white">{gossip.author}</span>
                <span>•</span>
                <span>{new Date(gossip.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-gray-900 dark:text-white text-lg leading-relaxed whitespace-pre-wrap">
                {gossip.content}
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-3 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => setShowCommentBox(!showCommentBox)}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium"
              >
                <MessageCircle className="w-4 h-4" />
                Comment
              </button>
              <button className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium">
                Share
              </button>
              <button className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 font-medium">
                Report
              </button>
              <span className="ml-auto text-gray-500 dark:text-gray-400">
                {gossip.comments.length} {gossip.comments.length === 1 ? 'comment' : 'comments'}
              </span>
            </div>
          </div>
        </div>

        {/* Add Comment Box */}
        {showCommentBox && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-purple-200 dark:border-purple-800 p-4 mb-6 animate-scale-in">
            <textarea
              placeholder="What are your thoughts?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              rows={4}
              maxLength={300}
              autoFocus
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">{newComment.length}/300</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowCommentBox(false);
                    setNewComment('');
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || loading}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 text-sm font-medium flex items-center gap-2"
                >
                  {loading ? '...' : <><Send className="w-4 h-4" />Comment</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Comments ({commentTree.length})
          </h2>
          {commentTree.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">No comments yet</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {commentTree.map(comment => (
                <RedditComment
                  key={comment.id}
                  comment={comment}
                  currentUser={currentUser}
                  onReply={handleReply}
                  depth={0}
                  onCommentAdded={onCommentAdded}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Reddit-style Comment Component (same as before)
const RedditComment = ({ comment, currentUser, onReply, depth = 0, onCommentAdded }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;
    setLoading(true);
    
    await onReply(comment.id, comment.author, replyText);
    setReplyText('');
    setShowReplyBox(false);
    setLoading(false);
    onCommentAdded();
  };

  const indentColor = [
    'border-blue-400',
    'border-green-400', 
    'border-orange-400',
    'border-purple-400',
    'border-pink-400',
    'border-yellow-400',
    'border-red-400'
  ][depth % 7];

  return (
    <div className={`${depth > 0 ? 'ml-4' : ''}`}>
      <div className={`flex gap-2 ${depth > 0 ? `border-l-2 ${indentColor} pl-2` : ''}`}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex-shrink-0 w-6 h-6 mt-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded flex items-center justify-center text-gray-500 dark:text-gray-400"
        >
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gray-900 dark:text-white hover:underline cursor-pointer">
              {comment.author}
            </span>
            {comment.replyTo && (
              <>
                <span className="text-xs text-gray-400">→</span>
                <span className="text-xs text-gray-600 dark:text-gray-400 hover:underline cursor-pointer">
                  @{comment.replyTo}
                </span>
              </>
            )}
            <span className="text-xs text-gray-400">
              {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {!collapsed && (
            <>
              <p className="text-sm text-gray-800 dark:text-gray-200 mb-2 break-words">{comment.content}</p>

              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => setShowReplyBox(!showReplyBox)}
                  className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Reply
                </button>
              </div>

              {showReplyBox && (
                <div className="mb-3 bg-gray-50 dark:bg-gray-900/50 rounded p-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${comment.author}...`}
                    className="w-full p-2 text-sm border border-gray-300 dark:border-gray-700 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    rows={3}
                    maxLength={300}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{replyText.length}/300</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowReplyBox(false);
                          setReplyText('');
                        }}
                        className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitReply}
                        disabled={!replyText.trim() || loading}
                        className="px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2">
                  {comment.replies.map(reply => (
                    <RedditComment
                      key={reply.id}
                      comment={reply}
                      currentUser={currentUser}
                      onReply={onReply}
                      depth={depth + 1}
                      onCommentAdded={onCommentAdded}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {collapsed && (
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              [{comment.replies?.length || 0} {comment.replies?.length === 1 ? 'reply' : 'replies'} hidden]
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Create Gossip Form (same as before)
const CreateGossipForm = ({ currentUser, onClose, onSuccess }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);

    try {
      const gossipData = {
        content: content.trim(),
        authorId: currentUser.id,
        authorUsername: currentUser.username
      };

      await gossipsAPI.create(gossipData);
      setContent('');
      onClose();
      onSuccess();
    } catch (error) {
      alert('Error creating gossip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-scale-in border-2 border-purple-200 dark:border-purple-700">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
              💬 Share a Gossip
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">What's on your mind?</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-1 mb-4">
          <textarea
            placeholder="What's the tea? ☕ Share something interesting..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            rows={6}
            maxLength={500}
            autoFocus
          />
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-6 px-1">
          <span className="flex items-center gap-2">
            <span className={`font-medium ${content.length > 450 ? 'text-orange-600' : 'text-gray-500 dark:text-gray-400'}`}>
              {content.length}/500 characters
            </span>
          </span>
          <span className="text-purple-600 dark:text-purple-400 font-medium">Posted as @{currentUser.username}</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all font-medium hover:shadow-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold transform hover:scale-105 active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Posting...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />
                Post Gossip
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function
const getTimeRemaining = (expiresAt) => {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires - now;
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d remaining`;
  if (hours > 0) return `${hours}h remaining`;
  return 'Expiring soon';
};

export default GossipsPage;


//2 working
// import React, { useState, useEffect } from 'react';
// import { ThumbsUp, ThumbsDown, MessageCircle, Plus, X, Send, Trash2, ArrowLeft, ChevronDown, ChevronUp, Clock } from 'lucide-react';
// import { gossipsAPI } from '../services/api';

// const GossipsPage = ({ currentUser, socketRef, onBack }) => {
//   const [gossips, setGossips] = useState([]);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [sortBy, setSortBy] = useState('newest');
//   const [expandedGossip, setExpandedGossip] = useState(null);

//   useEffect(() => {
//     loadGossips();
//   }, [sortBy]);

//   useEffect(() => {
//     if (socketRef?.current) {
//       socketRef.current.on('gossip-updated', () => loadGossips());
//       socketRef.current.on('gossip-comment-added', () => loadGossips());
//       socketRef.current.on('gossip-deleted', () => loadGossips());

//       return () => {
//         socketRef.current.off('gossip-updated');
//         socketRef.current.off('gossip-comment-added');
//         socketRef.current.off('gossip-deleted');
//       };
//     }
//   }, [socketRef]);

//   const loadGossips = async () => {
//     try {
//       const response = await gossipsAPI.getAll(sortBy);
//       if (response.data.success) {
//         setGossips(response.data.gossips);
//       }
//     } catch (error) {
//       console.error('Error loading gossips:', error);
//     }
//   };

//   const handleVote = async (gossipId, voteType) => {
//     try {
//       const result = await gossipsAPI.vote(gossipId, currentUser.id, voteType);
//       if (result.data.success) {
//         setGossips(prevGossips =>
//           prevGossips.map(g =>
//             g.id === gossipId
//               ? {
//                   ...g,
//                   upvotes: result.data.upvotes,
//                   downvotes: result.data.downvotes
//                 }
//               : g
//           )
//         );
//       }
//     } catch (error) {
//       console.error('Error voting:', error);
//     }
//   };

//   const handleDelete = async (gossipId) => {
//     if (window.confirm('Are you sure you want to delete this gossip?')) {
//       try {
//         await gossipsAPI.delete(gossipId, currentUser.id);
//         loadGossips();
//       } catch (error) {
//         alert('Error deleting gossip');
//       }
//     }
//   };

//   const handleBack = () => {
//     if (window.confirm('Are you sure you want to leave Gossips? You will return to the main page.')) {
//       onBack();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white animate-fade-in">
//       <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white shadow-2xl sticky top-0 z-40 backdrop-blur-sm">
//         <div className="max-w-4xl mx-auto px-4 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4 animate-slide-in">
//               <button
//                 onClick={handleBack}
//                 className="p-2 hover:bg-white/20 rounded-xl transition-all hover:scale-110 active:scale-95 ripple"
//                 title="Back to Home"
//               >
//                 <ArrowLeft className="w-5 h-5" />
//               </button>
//               <div>
//                 <h1 className="text-3xl font-bold flex items-center gap-2">
//                   💬 Gossips
//                 </h1>
//                 <p className="text-purple-100 mt-1 text-sm">Share anonymously, vote freely!</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setShowCreateForm(true)}
//               className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-xl hover:bg-purple-50 hover:shadow-lg transition-all font-medium hover-lift ripple"
//             >
//               <Plus className="w-5 h-5" />
//               Post Gossip
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-4xl mx-auto px-4 py-6">
//         {/* Enhanced Sort Options */}
//         <div className="mb-6 flex gap-3 flex-wrap animate-scale-in">
//           <button
//             onClick={() => setSortBy('newest')}
//             className={`px-5 py-2.5 rounded-xl font-medium transition-all transform hover:scale-105 ${
//               sortBy === 'newest'
//                 ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
//                 : 'bg-white text-gray-700 hover:shadow-md border border-gray-200'
//             }`}
//           >
//             🆕 Newest
//           </button>
//           <button
//             onClick={() => setSortBy('popular')}
//             className={`px-5 py-2.5 rounded-xl font-medium transition-all transform hover:scale-105 ${
//               sortBy === 'popular'
//                 ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
//                 : 'bg-white text-gray-700 hover:shadow-md border border-gray-200'
//             }`}
//           >
//             🔥 Popular
//           </button>
//           <button
//             onClick={() => setSortBy('controversial')}
//             className={`px-5 py-2.5 rounded-xl font-medium transition-all transform hover:scale-105 ${
//               sortBy === 'controversial'
//                 ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
//                 : 'bg-white text-gray-700 hover:shadow-md border border-gray-200'
//             }`}
//           >
//             ⚡ Controversial
//           </button>
//           <div className="ml-auto flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-xl border border-gray-200">
//             <span className="font-medium">{gossips.length}</span> gossip{gossips.length !== 1 ? 's' : ''}
//           </div>
//         </div>

//         {/* Gossips List with enhanced animations */}
//         <div className="space-y-4">
//           {gossips.length === 0 ? (
//             <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-purple-100 animate-scale-in">
//               <div className="text-6xl mb-4">💬</div>
//               <p className="text-gray-500 text-lg font-medium mb-2">No gossips yet</p>
//               <p className="text-gray-400 text-sm">Be the first to share something interesting!</p>
//               <button
//                 onClick={() => setShowCreateForm(true)}
//                 className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all hover-lift"
//               >
//                 <Plus className="w-5 h-5 inline mr-2" />
//                 Create First Gossip
//               </button>
//             </div>
//           ) : (
//             gossips.map((gossip, idx) => (
//               <div 
//                 key={gossip.id}
//                 className="animate-slide-in"
//                 style={{ animationDelay: `${idx * 50}ms` }}
//               >
//                 <GossipCard
//                   gossip={gossip}
//                   currentUser={currentUser}
//                   onVote={handleVote}
//                   onDelete={handleDelete}
//                   expanded={expandedGossip === gossip.id}
//                   onToggleExpand={() => setExpandedGossip(expandedGossip === gossip.id ? null : gossip.id)}
//                   onCommentAdded={loadGossips}
//                 />
//               </div>
//             ))
//           )}
//         </div>
//       </main>

//       {showCreateForm && (
//         <CreateGossipForm
//           currentUser={currentUser}
//           onClose={() => setShowCreateForm(false)}
//           onSuccess={loadGossips}
//         />
//       )}
//     </div>
//   );
// };

// // Reddit-style Comment Component
// const RedditComment = ({ comment, currentUser, onReply, depth = 0, onCommentAdded }) => {
//   const [collapsed, setCollapsed] = useState(false);
//   const [showReplyBox, setShowReplyBox] = useState(false);
//   const [replyText, setReplyText] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmitReply = async () => {
//     if (!replyText.trim()) return;
//     setLoading(true);
    
//     await onReply(comment.id, comment.author, replyText);
//     setReplyText('');
//     setShowReplyBox(false);
//     setLoading(false);
//     onCommentAdded();
//   };

//   const indentColor = [
//     'border-blue-400',
//     'border-green-400', 
//     'border-orange-400',
//     'border-purple-400',
//     'border-pink-400',
//     'border-yellow-400',
//     'border-red-400'
//   ][depth % 7];

//   return (
//     <div className={`${depth > 0 ? 'ml-4' : ''}`}>
//       <div className={`flex gap-2 ${depth > 0 ? `border-l-2 ${indentColor} pl-2` : ''}`}>
//         {/* Collapse button */}
//         <button
//           onClick={() => setCollapsed(!collapsed)}
//           className="flex-shrink-0 w-6 h-6 mt-1 hover:bg-gray-200 rounded flex items-center justify-center text-gray-500"
//         >
//           {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
//         </button>

//         <div className="flex-1 min-w-0">
//           {/* Comment header */}
//           <div className="flex items-center gap-2 mb-1">
//             <span className="text-xs font-bold text-gray-900 hover:underline cursor-pointer">
//               {comment.author}
//             </span>
//             {comment.replyTo && (
//               <>
//                 <span className="text-xs text-gray-400">→</span>
//                 <span className="text-xs text-gray-600 hover:underline cursor-pointer">
//                   @{comment.replyTo}
//                 </span>
//               </>
//             )}
//             <span className="text-xs text-gray-400">
//               {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//             </span>
//           </div>

//           {/* Comment content */}
//           {!collapsed && (
//             <>
//               <p className="text-sm text-gray-800 mb-2 break-words">{comment.content}</p>

//               {/* Action buttons */}
//               <div className="flex items-center gap-3 mb-2">
//                 <button
//                   onClick={() => setShowReplyBox(!showReplyBox)}
//                   className="text-xs font-bold text-gray-500 hover:text-gray-700"
//                 >
//                   Reply
//                 </button>
//                 <button className="text-xs font-bold text-gray-500 hover:text-gray-700">
                  
//                 </button>
//                 <button className="text-xs font-bold text-gray-500 hover:text-gray-700">
                
//                 </button>
//               </div>

//               {/* Reply box */}
//               {showReplyBox && (
//                 <div className="mb-3 bg-gray-50 rounded p-2">
//                   <textarea
//                     value={replyText}
//                     onChange={(e) => setReplyText(e.target.value)}
//                     placeholder={`Reply to ${comment.author}...`}
//                     className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
//                     rows={3}
//                     maxLength={300}
//                   />
//                   <div className="flex items-center justify-between mt-2">
//                     <span className="text-xs text-gray-500">{replyText.length}/300</span>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => {
//                           setShowReplyBox(false);
//                           setReplyText('');
//                         }}
//                         className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         onClick={handleSubmitReply}
//                         disabled={!replyText.trim() || loading}
//                         className="px-3 py-1 text-xs font-medium bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
//                       >
//                         Comment
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Nested replies */}
//               {comment.replies && comment.replies.length > 0 && (
//                 <div className="mt-2">
//                   {comment.replies.map(reply => (
//                     <RedditComment
//                       key={reply.id}
//                       comment={reply}
//                       currentUser={currentUser}
//                       onReply={onReply}
//                       depth={depth + 1}
//                       onCommentAdded={onCommentAdded}
//                     />
//                   ))}
//                 </div>
//               )}
//             </>
//           )}

//           {collapsed && (
//             <p className="text-xs text-gray-500 italic">
//               [{comment.replies?.length || 0} {comment.replies?.length === 1 ? 'reply' : 'replies'} hidden]
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Gossip Card Component with Enhanced UI
// const GossipCard = ({ gossip, currentUser, onVote, onDelete, expanded, onToggleExpand, onCommentAdded }) => {
//   const [showCommentBox, setShowCommentBox] = useState(false);
//   const [newComment, setNewComment] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [voteAnimation, setVoteAnimation] = useState(null);

//   const hasUpvoted = gossip.upvotedBy.includes(currentUser.id);
//   const hasDownvoted = gossip.downvotedBy.includes(currentUser.id);
//   const isAuthor = gossip.authorId === currentUser.id;
//   const isAdmin = currentUser.isAdmin;

//   const getTimeRemaining = () => {
//     const now = new Date();
//     const expires = new Date(gossip.expiresAt);
//     const diff = expires - now;
    
//     if (diff <= 0) return 'Expired';
    
//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const days = Math.floor(hours / 24);
    
//     if (days > 0) return `${days}d remaining`;
//     if (hours > 0) return `${hours}h remaining`;
//     return 'Expiring soon';
//   };

//   const handleVoteClick = (type) => {
//     setVoteAnimation(type);
//     setTimeout(() => setVoteAnimation(null), 300);
//     onVote(gossip.id, hasUpvoted && type === 'up' ? null : hasDownvoted && type === 'down' ? null : type);
//   };

//   const handleAddComment = async () => {
//     if (!newComment.trim()) return;
//     setLoading(true);

//     try {
//       const commentData = {
//         content: newComment,
//         authorId: currentUser.id,
//         authorUsername: currentUser.username,
//         parentCommentId: null,
//         replyTo: null
//       };

//       await gossipsAPI.addComment(gossip.id, commentData);
//       setNewComment('');
//       setShowCommentBox(false);
//       onCommentAdded();
//     } catch (error) {
//       alert('Error adding comment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReply = async (parentId, parentAuthor, content) => {
//     try {
//       const commentData = {
//         content: content,
//         authorId: currentUser.id,
//         authorUsername: currentUser.username,
//         parentCommentId: parentId,
//         replyTo: parentAuthor
//       };

//       await gossipsAPI.addComment(gossip.id, commentData);
//     } catch (error) {
//       alert('Error adding reply');
//     }
//   };

//   // Build comment tree
//   const buildCommentTree = (comments) => {
//     const commentMap = {};
//     const roots = [];

//     comments.forEach(comment => {
//       commentMap[comment.id] = { ...comment, replies: [] };
//     });

//     comments.forEach(comment => {
//       if (comment.parentCommentId && commentMap[comment.parentCommentId]) {
//         commentMap[comment.parentCommentId].replies.push(commentMap[comment.id]);
//       } else if (!comment.parentCommentId) {
//         roots.push(commentMap[comment.id]);
//       }
//     });

//     return roots;
//   };

//   const commentTree = buildCommentTree(gossip.comments);

//   return (
//     <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 overflow-hidden hover-lift">
//       <div className="p-6">
//         {/* Gossip Header */}
//         <div className="flex items-start gap-4 mb-4">
//           <div className="flex flex-col items-center gap-2 min-w-[50px]">
//             <button
//               onClick={() => handleVoteClick('up')}
//               className={`p-2 rounded-lg transition-all transform hover:scale-110 active:scale-95 ${
//                 hasUpvoted
//                   ? 'bg-green-500 text-white shadow-lg'
//                   : 'bg-gray-100 text-gray-600 hover:bg-green-50'
//               } ${voteAnimation === 'up' ? 'animate-pulse-slow' : ''}`}
//             >
//               <ThumbsUp className="w-5 h-5" />
//             </button>
//             <span className={`font-bold text-lg ${
//               gossip.upvotes - gossip.downvotes > 0 ? 'text-green-600' : 
//               gossip.upvotes - gossip.downvotes < 0 ? 'text-red-600' : 
//               'text-gray-600'
//             }`}>
//               {gossip.upvotes - gossip.downvotes}
//             </span>
//             <button
//               onClick={() => handleVoteClick('down')}
//               className={`p-2 rounded-lg transition-all transform hover:scale-110 active:scale-95 ${
//                 hasDownvoted
//                   ? 'bg-red-500 text-white shadow-lg'
//                   : 'bg-gray-100 text-gray-600 hover:bg-red-50'
//               } ${voteAnimation === 'down' ? 'animate-pulse-slow' : ''}`}
//             >
//               <ThumbsDown className="w-5 h-5" />
//             </button>
//           </div>

//           <div className="flex-1">
//             {/* Author & Time */}
//             <div className="flex items-start justify-between mb-3">
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
//                   {gossip.author[0].toUpperCase()}
//                 </div>
//                 <div>
//                   <span className="text-sm font-semibold text-gray-900">
//                     {gossip.author}
//                   </span>
//                   <div className="flex items-center gap-2 text-xs text-gray-500">
//                     <span>{new Date(gossip.createdAt).toLocaleString()}</span>
//                     <span>•</span>
//                     <span className="flex items-center gap-1 text-orange-600 font-medium">
//                       <Clock className="w-3 h-3" />
//                       {getTimeRemaining()}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               {(isAuthor || isAdmin) && (
//                 <button
//                   onClick={() => {
//                     if (window.confirm('Delete this gossip?')) {
//                       onDelete(gossip.id);
//                     }
//                   }}
//                   className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                   title="Delete"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               )}
//             </div>

//             {/* Gossip Content */}
//             <p className="text-gray-900 text-base leading-relaxed mb-4">{gossip.content}</p>

//             {/* Action Buttons */}
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={onToggleExpand}
//                 className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-all font-medium border border-purple-200"
//               >
//                 <MessageCircle className="w-4 h-4" />
//                 <span>{gossip.comments.length} {gossip.comments.length === 1 ? 'Comment' : 'Comments'}</span>
//                 {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//               </button>
              
//               <div className="flex items-center gap-2 text-sm text-gray-500">
//                 <div className="flex items-center gap-1">
//                   <ThumbsUp className="w-4 h-4 text-green-600" />
//                   <span className="font-medium">{gossip.upvotes}</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <ThumbsDown className="w-4 h-4 text-red-600" />
//                   <span className="font-medium">{gossip.downvotes}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* OLD ACTIONS SECTION - REMOVE THIS */}
//         <div className="hidden items-center gap-4">
//           <button
//             onClick={() => handleVoteClick('up')}
//             className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
//               hasUpvoted
//                 ? 'bg-green-100 text-green-700'
//                 : 'bg-gray-100 text-gray-600 hover:bg-green-50'
//             }`}
//           >
//             <ThumbsUp className="w-4 h-4" />
//             <span className="font-medium">{gossip.upvotes}</span>
//           </button>

//           <button
//             onClick={() => onVote(gossip.id, hasDownvoted ? null : 'down')}
//             className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
//               hasDownvoted
//                 ? 'bg-red-100 text-red-700'
//                 : 'bg-gray-100 text-gray-600 hover:bg-red-50'
//             }`}
//           >
//             <ThumbsDown className="w-4 h-4" />
//             <span className="font-medium">{gossip.downvotes}</span>
//           </button>

//           <button
//             onClick={onToggleExpand}
//             className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-50 transition-colors"
//           >
//             <MessageCircle className="w-4 h-4" />
//             <span className="font-medium">{gossip.comments.length}</span>
//           </button>

//           {(isAuthor || isAdmin) && (
//             <button
//               onClick={() => onDelete(gossip.id)}
//               className="ml-auto p-2 text-red-600 hover:bg-red-50 rounded-lg"
//             >
//               <Trash2 className="w-4 h-4" />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Enhanced Comments Section */}
//       {expanded && (
//         <div className="border-t-2 border-purple-100 bg-gradient-to-br from-gray-50 to-purple-50/30 animate-scale-in">
//           <div className="p-6">
//             {/* Add comment box with modern styling */}
//             <div className="mb-6">
//               <div className="bg-white rounded-xl border-2 border-gray-200 focus-within:border-purple-400 transition-all shadow-sm hover:shadow-md">
//                 <textarea
//                   placeholder="💭 Share your thoughts..."
//                   value={newComment}
//                   onChange={(e) => setNewComment(e.target.value)}
//                   className="w-full p-4 rounded-t-xl border-none focus:ring-0 resize-none text-sm text-gray-900 placeholder-gray-500"
//                   rows={3}
//                   maxLength={300}
//                 />
//                 <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-b-xl border-t border-gray-200">
//                   <span className="text-xs text-gray-500 font-medium">{newComment.length}/300 characters</span>
//                   <button
//                     onClick={handleAddComment}
//                     disabled={!newComment.trim() || loading}
//                     className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 ripple"
//                   >
//                     {loading ? (
//                       <span className="flex items-center gap-2">
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                         Posting...
//                       </span>
//                     ) : (
//                       <span className="flex items-center gap-1">
//                         <Send className="w-4 h-4" />
//                         Comment
//                       </span>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Comments tree with enhanced styling */}
//             <div className="space-y-4">
//               {commentTree.length === 0 ? (
//                 <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
//                   <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                   <p className="text-gray-500 font-medium mb-1">No comments yet</p>
//                   <p className="text-gray-400 text-sm">Be the first to share your thoughts!</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="flex items-center gap-2 text-sm text-gray-600 font-medium mb-2">
//                     <MessageCircle className="w-4 h-4" />
//                     <span>{commentTree.length} {commentTree.length === 1 ? 'Comment' : 'Comments'}</span>
//                   </div>
//                   {commentTree.map(comment => (
//                     <RedditComment
//                       key={comment.id}
//                       comment={comment}
//                       currentUser={currentUser}
//                       onReply={handleReply}
//                       depth={0}
//                       onCommentAdded={onCommentAdded}
//                     />
//                   ))}
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Create Gossip Form Component
// const CreateGossipForm = ({ currentUser, onClose, onSuccess }) => {
//   const [content, setContent] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (!content.trim()) return;
//     setLoading(true);

//     try {
//       const gossipData = {
//         content: content.trim(),
//         authorId: currentUser.id,
//         authorUsername: currentUser.username
//       };

//       await gossipsAPI.create(gossipData);
//       setContent('');
//       onClose();
//       onSuccess();
//     } catch (error) {
//       alert('Error creating gossip');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
//       <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-scale-in border-2 border-purple-200">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
//               💬 Share a Gossip
//             </h2>
//             <p className="text-sm text-gray-500 mt-1">What's on your mind?</p>
//           </div>
//           <button 
//             onClick={onClose} 
//             className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-all"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-1 mb-4">
//           <textarea
//             placeholder="What's the tea? ☕ Share something interesting..."
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             className="w-full p-4 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all resize-none text-gray-900 placeholder-gray-500"
//             rows={6}
//             maxLength={500}
//             autoFocus
//           />
//         </div>
        
//         <div className="flex items-center justify-between text-xs text-gray-600 mb-6 px-1">
//           <span className="flex items-center gap-2">
//             <span className={`font-medium ${content.length > 450 ? 'text-orange-600' : 'text-gray-500'}`}>
//               {content.length}/500 characters
//             </span>
//           </span>
//           <span className="text-purple-600 font-medium">Posted as @{currentUser.username}</span>
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={onClose}
//             className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all font-medium hover:shadow-md"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={!content.trim() || loading}
//             className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold transform hover:scale-105 active:scale-95 ripple"
//           >
//             {loading ? (
//               <span className="flex items-center justify-center gap-2">
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 Posting...
//               </span>
//             ) : (
//               <span className="flex items-center justify-center gap-2">
//                 <Send className="w-5 h-5" />
//                 Post Gossip
//               </span>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GossipsPage;