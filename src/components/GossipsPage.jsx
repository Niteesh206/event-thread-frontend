// import React, { useState, useEffect } from 'react';
// import { ThumbsUp, ThumbsDown, MessageCircle, Plus, X, Send, Trash2, ArrowLeft } from 'lucide-react';
// import { gossipsAPI } from '../services/api';

// const GossipsPage = ({ currentUser, socketRef, onBack }) => {
//   const [gossips, setGossips] = useState([]);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [sortBy, setSortBy] = useState('newest');
//   const [expandedGossip, setExpandedGossip] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     loadGossips();
//   }, [sortBy]);

//   // Socket listeners
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
//         // Optimistic update
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

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* HEADER */}
//       <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
//         <div className="max-w-4xl mx-auto px-4 py-6">
//           <div className="flex items-center justify-between">
//             {/* Left side: Back + Title */}
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={onBack}
//                 className="flex items-center gap-1 px-3 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
//               >
//                 <ArrowLeft className="w-4 h-4" />
//                 Back
//               </button>
//               <div>
//                 <h1 className="text-3xl font-bold">💬 Gossips</h1>
//                 <p className="text-purple-100 mt-1">Share anonymously, vote freely!</p>
//               </div>
//             </div>

//             {/* Right side: Create Gossip Button */}
//             <button
//               onClick={() => setShowCreateForm(true)}
//               className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
//             >
//               <Plus className="w-5 h-5" />
//               Post Gossip
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* MAIN */}
//       <main className="max-w-4xl mx-auto px-4 py-6">
//         {/* Sort Options */}
//         <div className="mb-6 flex gap-2">
//           <button
//             onClick={() => setSortBy('newest')}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//               sortBy === 'newest'
//                 ? 'bg-purple-600 text-white'
//                 : 'bg-white text-gray-700 hover:bg-gray-100'
//             }`}
//           >
//             🆕 Newest
//           </button>
//           <button
//             onClick={() => setSortBy('popular')}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//               sortBy === 'popular'
//                 ? 'bg-purple-600 text-white'
//                 : 'bg-white text-gray-700 hover:bg-gray-100'
//             }`}
//           >
//             🔥 Popular
//           </button>
//           <button
//             onClick={() => setSortBy('controversial')}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//               sortBy === 'controversial'
//                 ? 'bg-purple-600 text-white'
//                 : 'bg-white text-gray-700 hover:bg-gray-100'
//             }`}
//           >
//             ⚡ Controversial
//           </button>
//         </div>

//         {/* Gossips List */}
//         <div className="space-y-4">
//           {gossips.length === 0 ? (
//             <div className="text-center py-12 bg-white rounded-lg">
//               <p className="text-gray-500">No gossips yet. Be the first to share!</p>
//             </div>
//           ) : (
//             gossips.map(gossip => (
//               <GossipCard
//                 key={gossip.id}
//                 gossip={gossip}
//                 currentUser={currentUser}
//                 onVote={handleVote}
//                 onDelete={handleDelete}
//                 expanded={expandedGossip === gossip.id}
//                 onToggleExpand={() => setExpandedGossip(expandedGossip === gossip.id ? null : gossip.id)}
//                 onCommentAdded={loadGossips}
//               />
//             ))
//           )}
//         </div>
//       </main>

//       {/* Create Gossip Form Modal */}
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

// // Gossip Card Component
// const GossipCard = ({ gossip, currentUser, onVote, onDelete, expanded, onToggleExpand, onCommentAdded }) => {
//   const [showCommentBox, setShowCommentBox] = useState(false);
//   const [newComment, setNewComment] = useState('');
//   const [isAnonymous, setIsAnonymous] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const hasUpvoted = gossip.upvotedBy.includes(currentUser.id);
//   const hasDownvoted = gossip.downvotedBy.includes(currentUser.id);
//   const isAuthor = gossip.authorId === currentUser.id;
//   const isAdmin = currentUser.isAdmin;

//   const handleAddComment = async () => {
//     if (!newComment.trim()) return;
//     setLoading(true);

//     try {
//       const commentData = {
//         content: newComment,
//         authorId: currentUser.id,
//         authorUsername: currentUser.username,
//         isAnonymous
//       };

//       await gossipsAPI.addComment(gossip.id, commentData);
//       setNewComment('');
//       setShowCommentBox(false);
//       setIsAnonymous(false);
//       onCommentAdded();
//     } catch (error) {
//       alert('Error adding comment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
//       {/* Gossip Content */}
//       <div className="mb-3">
//         <div className="flex items-start justify-between mb-2">
//           <span className="text-sm text-gray-500">
//             {gossip.isAnonymous ? '👤 Anonymous' : `👤 ${gossip.author}`}
//           </span>
//           <span className="text-xs text-gray-400">
//             {new Date(gossip.createdAt).toLocaleString()}
//           </span>
//         </div>
//         <p className="text-gray-900 text-base">{gossip.content}</p>
//       </div>

//       {/* Actions */}
//       <div className="flex items-center gap-4">
//         <button
//           onClick={() => onVote(gossip.id, hasUpvoted ? null : 'up')}
//           className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
//             hasUpvoted
//               ? 'bg-green-100 text-green-700'
//               : 'bg-gray-100 text-gray-600 hover:bg-green-50'
//           }`}
//         >
//           <ThumbsUp className="w-4 h-4" />
//           <span className="font-medium">{gossip.upvotes}</span>
//         </button>

//         <button
//           onClick={() => onVote(gossip.id, hasDownvoted ? null : 'down')}
//           className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
//             hasDownvoted
//               ? 'bg-red-100 text-red-700'
//               : 'bg-gray-100 text-gray-600 hover:bg-red-50'
//           }`}
//         >
//           <ThumbsDown className="w-4 h-4" />
//           <span className="font-medium">{gossip.downvotes}</span>
//         </button>

//         <button
//           onClick={onToggleExpand}
//           className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-50 transition-colors"
//         >
//           <MessageCircle className="w-4 h-4" />
//           <span className="font-medium">{gossip.comments.length}</span>
//         </button>

//         {(isAuthor || isAdmin) && (
//           <button
//             onClick={() => onDelete(gossip.id)}
//             className="ml-auto p-2 text-red-600 hover:bg-red-50 rounded-lg"
//           >
//             <Trash2 className="w-4 h-4" />
//           </button>
//         )}
//       </div>

//       {/* Comments Section */}
//       {expanded && (
//         <div className="mt-4 pt-4 border-t border-gray-200">
//           <div className="space-y-3 mb-4">
//             {gossip.comments.length === 0 ? (
//               <p className="text-gray-400 text-sm text-center py-2">No comments yet</p>
//             ) : (
//               gossip.comments.map(comment => (
//                 <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
//                   <div className="flex items-center justify-between mb-1">
//                     <span className="text-xs text-gray-500">
//                       {comment.isAnonymous ? '👤 Anonymous' : `👤 ${comment.author}`}
//                     </span>
//                     <span className="text-xs text-gray-400">
//                       {new Date(comment.createdAt).toLocaleString()}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-700">{comment.content}</p>
//                 </div>
//               ))
//             )}
//           </div>

//           {!showCommentBox ? (
//             <button
//               onClick={() => setShowCommentBox(true)}
//               className="w-full py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
//             >
//               Add Comment
//             </button>
//           ) : (
//             <div className="space-y-2">
//               <textarea
//                 placeholder="Write your comment..."
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
//                 rows={2}
//                 maxLength={300}
//               />
//               <div className="flex items-center justify-between">
//                 <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={isAnonymous}
//                     onChange={(e) => setIsAnonymous(e.target.checked)}
//                     className="rounded"
//                   />
//                   Comment anonymously
//                 </label>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => {
//                       setShowCommentBox(false);
//                       setNewComment('');
//                       setIsAnonymous(false);
//                     }}
//                     className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleAddComment}
//                     disabled={!newComment.trim() || loading}
//                     className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm flex items-center gap-1"
//                   >
//                     <Send className="w-3 h-3" />
//                     Post
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// // Create Gossip Form Component
// const CreateGossipForm = ({ currentUser, onClose, onSuccess }) => {
//   const [content, setContent] = useState('');
//   const [isAnonymous, setIsAnonymous] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (!content.trim()) return;
//     setLoading(true);

//     try {
//       const gossipData = {
//         content: content.trim(),
//         authorId: currentUser.id,
//         authorUsername: currentUser.username,
//         isAnonymous
//       };

//       await gossipsAPI.create(gossipData);
//       setContent('');
//       setIsAnonymous(false);
//       onClose();
//       onSuccess();
//     } catch (error) {
//       alert('Error creating gossip');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-gray-900">Share a Gossip</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <textarea
//           placeholder="What's the tea? ☕ (Max 500 characters)"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3"
//           rows={6}
//           maxLength={500}
//           autoFocus
//           dir="ltr"
//           style={{ direction: 'ltr', textAlign: 'left' }}
//         />
//         <div className="text-xs text-gray-500 mb-4">
//           {content.length}/500 characters
//         </div>

//         <label className="flex items-center gap-2 mb-4 cursor-pointer">
//           <input
//             type="checkbox"
//             checked={isAnonymous}
//             onChange={(e) => setIsAnonymous(e.target.checked)}
//             className="rounded"
//           />
//           <span className="text-sm text-gray-700">Post anonymously</span>
//         </label>

//         <div className="flex gap-3">
//           <button
//             onClick={onClose}
//             className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={!content.trim() || loading}
//             className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50"
//           >
//             {loading ? 'Posting...' : 'Post Gossip'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GossipsPage;


//2
import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, Plus, X, Send, Trash2, ArrowLeft, Reply, Clock } from 'lucide-react';
import { gossipsAPI } from '../services/api';

const GossipsPage = ({ currentUser, socketRef, onBack }) => {
  const [gossips, setGossips] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [expandedGossip, setExpandedGossip] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGossips();
  }, [sortBy]);

  // Socket listeners
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
        // Optimistic update
        setGossips(prevGossips =>
          prevGossips.map(g =>
            g.id === gossipId
              ? {
                  ...g,
                  upvotes: result.data.upvotes,
                  downvotes: result.data.downvotes
                }
              : g
          )
        );
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
      } catch (error) {
        alert('Error deleting gossip');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold">💬 Gossips</h1>
                <p className="text-purple-100 mt-1">Share anonymously, vote freely!</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Post Gossip
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Sort Options */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setSortBy('newest')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortBy === 'newest'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🆕 Newest
          </button>
          <button
            onClick={() => setSortBy('popular')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortBy === 'popular'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🔥 Popular
          </button>
          <button
            onClick={() => setSortBy('controversial')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortBy === 'controversial'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            ⚡ Controversial
          </button>
        </div>

        {/* Gossips List */}
        <div className="space-y-4">
          {gossips.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No gossips yet. Be the first to share!</p>
            </div>
          ) : (
            gossips.map(gossip => (
              <GossipCard
                key={gossip.id}
                gossip={gossip}
                currentUser={currentUser}
                onVote={handleVote}
                onDelete={handleDelete}
                expanded={expandedGossip === gossip.id}
                onToggleExpand={() => setExpandedGossip(expandedGossip === gossip.id ? null : gossip.id)}
                onCommentAdded={loadGossips}
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

// Gossip Card Component
const GossipCard = ({ gossip, currentUser, onVote, onDelete, expanded, onToggleExpand, onCommentAdded }) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const hasUpvoted = gossip.upvotedBy.includes(currentUser.id);
  const hasDownvoted = gossip.downvotedBy.includes(currentUser.id);
  const isAuthor = gossip.authorId === currentUser.id;
  const isAdmin = currentUser.isAdmin;

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);

    try {
      const commentData = {
        content: newComment,
        authorId: currentUser.id,
        authorUsername: currentUser.username
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      {/* Gossip Content */}
      <div className="mb-3">
        <div className="flex items-start justify-between mb-2">
          <span className="text-sm font-medium text-purple-600">
            👤 {gossip.author}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(gossip.createdAt).toLocaleString()}
          </span>
        </div>
        <p className="text-gray-900 text-base">{gossip.content}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onVote(gossip.id, hasUpvoted ? null : 'up')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
            hasUpvoted
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600 hover:bg-green-50'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span className="font-medium">{gossip.upvotes}</span>
        </button>

        <button
          onClick={() => onVote(gossip.id, hasDownvoted ? null : 'down')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
            hasDownvoted
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-600 hover:bg-red-50'
          }`}
        >
          <ThumbsDown className="w-4 h-4" />
          <span className="font-medium">{gossip.downvotes}</span>
        </button>

        <button
          onClick={onToggleExpand}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="font-medium">{gossip.comments.length}</span>
        </button>

        {(isAuthor || isAdmin) && (
          <button
            onClick={() => onDelete(gossip.id)}
            className="ml-auto p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Comments Section */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-3 mb-4">
            {gossip.comments.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-2">No comments yet</p>
            ) : (
              gossip.comments.map(comment => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-purple-600">
                      👤 {comment.author}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              ))
            )}
          </div>

          {!showCommentBox ? (
            <button
              onClick={() => setShowCommentBox(true)}
              className="w-full py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              Add Comment
            </button>
          ) : (
            <div className="space-y-2">
              <textarea
                placeholder="Write your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={2}
                maxLength={300}
                dir="ltr"
                style={{ direction: 'ltr', textAlign: 'left' }}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{newComment.length}/300</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowCommentBox(false);
                      setNewComment('');
                    }}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || loading}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Create Gossip Form Component
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Share a Gossip</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <textarea
          placeholder="What's the tea? ☕ (Max 500 characters)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-3"
          rows={6}
          maxLength={500}
          autoFocus
          dir="ltr"
          style={{ direction: 'ltr', textAlign: 'left' }}
        />
        <div className="text-xs text-gray-500 mb-4">
          {content.length}/500 characters • Posted as @{currentUser.username}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || loading}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Gossip'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GossipsPage;