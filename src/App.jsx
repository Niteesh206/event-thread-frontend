
// //1 basic
// import React, { useState, useEffect, useRef } from 'react';
// import { Clock, Users, MapPin, MessageCircle, Plus, X, Check, Hash, Calendar, Send, LogOut, User, Shield, Trash2, Eye, MessageSquare } from 'lucide-react';
// import { authAPI, threadsAPI, adminAPI } from './services/api';
// import LoginPage from './components/LoginPage';
// import { io } from 'socket.io-client';
// import GossipsPage from './components/GossipsPage';
// Use environment variable for backend URL. If not provided, the app will
// fall back to a relative origin so Vite can proxy requests during dev.

// // Helper functions
// const formatTime = (dateString) => {
//   return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// };

// const getTimeRemaining = (expiresAt) => {
//   const diff = new Date(expiresAt) - new Date();
//   const hours = Math.floor(diff / (1000 * 60 * 60));
//   const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//   if (hours > 0) return `${hours}h ${minutes}m`;
//   if (minutes > 0) return `${minutes}m`;
//   return 'Expiring soon';
// };

// function App() {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [threads, setThreads] = useState([]);
//   const [selectedThread, setSelectedThread] = useState(null);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [showLoginForm, setShowLoginForm] = useState(true);
//   const [showAdminDashboard, setShowAdminDashboard] = useState(false);
//   const [newMessage, setNewMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [adminData, setAdminData] = useState(null);
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [editingThread, setEditingThread] = useState(null);
//   const [filterCategory, setFilterCategory] = useState('all');
//   const [sortBy, setSortBy] = useState('newest');
//   const [showAlertModal, setShowAlertModal] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');
//   const [notificationsEnabled, setNotificationsEnabled] = useState(false);
//   const [showGossipsPage, setShowGossipsPage] = useState(false);
//   const chatEndRef = useRef(null);
//   const socketRef = useRef(null);

//   // Request notification permission on login
//   useEffect(() => {
//     if (currentUser && !showLoginForm && 'Notification' in window) {
//       if (Notification.permission === 'granted') {
//         setNotificationsEnabled(true);
//       } else if (Notification.permission !== 'denied') {
//         Notification.requestPermission().then(permission => {
//           if (permission === 'granted') {
//             setNotificationsEnabled(true);
//             new Notification('EventThreads', {
//               body: 'Notifications enabled! You\'ll be alerted for important messages.',
//               icon: '/vite.svg'
//             });
//           }
//         });
//       }
//     }
//   }, [currentUser, showLoginForm]);

//   // Categories for filtering
//   const categories = [
//     { id: 'all', label: '🌟 All', icon: Calendar },
//     { id: 'sports', label: '⚽ Sports', icon: Users },
//     { id: 'food', label: '🍕 Food & Drinks', icon: Users },
//     { id: 'entertainment', label: '🎬 Entertainment', icon: Users },
//     { id: 'tech', label: '💻 Tech & Coding', icon: Users },
//     { id: 'study', label: '📚 Study Groups', icon: Users },
//     { id: 'music', label: '🎵 Music', icon: Users },
//     { id: 'fitness', label: '💪 Fitness', icon: Users },
//     { id: 'gaming', label: '🎮 Gaming', icon: Users },
//     { id: 'other', label: '✨ Other', icon: Users }
//   ];

//   // Initialize Socket.io
//   useEffect(() => {
//     if (currentUser && !showLoginForm) {
//       socketRef.current = io(SOCKET_URL, {
//         transports: ['websocket', 'polling']
//       });

//       socketRef.current.on('connect', () => {
//         console.log('✅ Socket connected');
//       });

//       socketRef.current.on('refresh-threads', () => {
//         console.log('🔄 Refreshing threads from socket');
//         loadThreads();
//       });

//       socketRef.current.on('disconnect', () => {
//         console.log('❌ Socket disconnected');
//       });

//       return () => {
//         if (socketRef.current) {
//           socketRef.current.disconnect();
//         }
//       };
//     }
//   }, [currentUser, showLoginForm]);

//   // Auto-scroll chat
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [selectedThread?.chat]);

//   // Load threads periodically (as backup, socket handles real-time)
//   useEffect(() => {
//     if (currentUser && !showLoginForm) {
//       loadThreads();
      
//       // Backup polling every 60s (socket handles real-time updates)
//       const interval = setInterval(() => {
//         if (!showCreateForm && !showEditForm) {
//           loadThreads();
//         }
//       }, 60000);
      
//       return () => clearInterval(interval);
//     }
//   }, [currentUser, showLoginForm, showCreateForm, showEditForm]);

//   // Load admin dashboard
//   useEffect(() => {
//     if (currentUser?.isAdmin && showAdminDashboard) {
//       loadAdminDashboard();
//     }
//   }, [currentUser, showAdminDashboard]);

//   const loadThreads = async () => {
//     try {
//       const response = await threadsAPI.getAll();
//       if (response.data.success) {
//         setThreads(response.data.threads);
//         if (selectedThread) {
//           const updatedThread = response.data.threads.find(t => t.id === selectedThread.id);
//           setSelectedThread(updatedThread || null);
//         }
//       }
//     } catch (error) {
//       console.error('Error loading threads:', error);
//     }
//   };

//   // Filter and sort threads
//   const getFilteredAndSortedThreads = () => {
//     let filtered = threads;

//     // Filter by category
//     if (filterCategory !== 'all') {
//       filtered = threads.filter(thread => 
//         thread.tags.some(tag => 
//           tag.toLowerCase().includes(filterCategory.toLowerCase()) ||
//           (filterCategory === 'tech' && (tag.toLowerCase().includes('coding') || tag.toLowerCase().includes('programming'))) ||
//           (filterCategory === 'study' && (tag.toLowerCase().includes('study') || tag.toLowerCase().includes('learning')))
//         )
//       );
//     }

//     // Sort threads
//     const sorted = [...filtered].sort((a, b) => {
//       switch (sortBy) {
//         case 'newest':
//           return new Date(b.createdAt) - new Date(a.createdAt);
//         case 'oldest':
//           return new Date(a.createdAt) - new Date(b.createdAt);
//         case 'mostMembers':
//           return b.members.length - a.members.length;
//         case 'expiringSoon':
//           return new Date(a.expiresAt) - new Date(b.expiresAt);
//         case 'mostActive':
//           return b.chat.length - a.chat.length;
//         default:
//           return 0;
//       }
//     });

//     return sorted;
//   };

//   const loadAdminDashboard = async () => {
//     try {
//       const response = await adminAPI.getDashboard(currentUser.id);
//       if (response.data.success) {
//         setAdminData(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error loading admin dashboard:', error);
//     }
//   };

//   const handleLogin = async (username, password, isAdmin) => {
//     try {
//       const response = await authAPI.login(username, password, isAdmin);
//       if (response.data.success) {
//         setCurrentUser(response.data.user);
//         setShowLoginForm(false);
//       } else {
//         throw new Error(response.data.message);
//       }
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
//     }
//   };

//   const handleRegister = async (username, password) => {
//     try {
//       const response = await authAPI.register(username, password);
//       if (response.data.success) {
//         setCurrentUser(response.data.user);
//         setShowLoginForm(false);
//       } else {
//         throw new Error(response.data.message);
//       }
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
//     }
//   };

//   // Admin Dashboard Component
//   const AdminDashboard = () => {
//     const handleDeleteThread = async (threadId) => {
//       if (window.confirm('Are you sure you want to delete this thread?')) {
//         try {
//           const result = await threadsAPI.delete(threadId, currentUser.id);
//           if (result.data.success) {
//             loadAdminDashboard();
//             loadThreads();
//           }
//         } catch (error) {
//           alert('Error deleting thread');
//         }
//       }
//     };

//     const handleViewThread = (thread) => {
//       const formattedThread = {
//         id: thread.id || thread._id,
//         title: thread.title,
//         description: thread.description,
//         creator: thread.creator || thread.creatorUsername,
//         creatorId: thread.creatorId || thread.creator,
//         location: thread.location,
//         members: thread.members || [],
//         pendingRequests: thread.pendingRequests || [],
//         chat: thread.chat || [],
//         tags: thread.tags || [],
//         expiresAt: thread.expiresAt
//       };
//       setSelectedThread(formattedThread);
//       setShowAdminDashboard(false);
//     };

//     return (
//       <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
//         <div className="bg-blue-600 text-white p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold">Admin Dashboard</h1>
//               <p className="opacity-90">Monitor all threads and users</p>
//             </div>
//             <button onClick={() => setShowAdminDashboard(false)} className="text-white hover:text-blue-200">
//               <X className="w-6 h-6" />
//             </button>
//           </div>
//         </div>
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <div className="bg-white p-6 rounded-lg border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Threads</h3>
//               <p className="text-3xl font-bold text-blue-600">{adminData?.totalThreads || threads.length || 0}</p>
//             </div>
//             <div className="bg-white p-6 rounded-lg border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Users</h3>
//               <p className="text-3xl font-bold text-green-600">{adminData?.activeUsers || 0}</p>
//             </div>
//             <div className="bg-white p-6 rounded-lg border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
//               <p className="text-3xl font-bold text-purple-600">{adminData?.totalUsers || 0}</p>
//             </div>
//           </div>
//           <div className="mb-8">
//             <h2 className="text-xl font-bold text-gray-900 mb-4">Active Threads</h2>
//             {(!adminData?.threads || adminData.threads.length === 0) && (!threads || threads.length === 0) ? (
//               <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
//                 <p className="text-gray-500">No active threads</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {(adminData?.threads || threads).map(thread => (
//                   <div key={thread.id || thread._id} className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex justify-between items-start mb-3">
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-gray-900">{thread.title}</h3>
//                         <p className="text-sm text-gray-600 mb-2">{thread.description}</p>
//                         <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
//                           <span>👤 {thread.creator || thread.creatorUsername}</span>
//                           <span>📍 {thread.location}</span>
//                           <span>⏰ {getTimeRemaining(thread.expiresAt)}</span>
//                           <span>👥 {thread.members?.length || 0} members</span>
//                           <span>💬 {thread.chat?.length || 0} messages</span>
//                         </div>
//                         {thread.memberDetails && thread.memberDetails.length > 0 && (
//                           <div className="text-sm text-gray-600">
//                             <strong>Members:</strong> {thread.memberDetails.map(m => m.username).join(', ')}
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleViewThread(thread)}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded"
//                           title="View Thread"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteThread(thread.id || thread._id)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded"
//                           title="Delete Thread"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//           {adminData?.users && adminData.users.length > 0 && (
//             <div>
//               <h2 className="text-xl font-bold text-gray-900 mb-4">Users</h2>
//               <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Username</th>
//                       <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Joined</th>
//                       <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {adminData.users.map(user => (
//                       <tr key={user.id || user._id}>
//                         <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.username}</td>
//                         <td className="px-4 py-3 text-sm text-gray-600">
//                           {new Date(user.createdAt).toLocaleDateString()}
//                         </td>
//                         <td className="px-4 py-3">
//                           <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                             Active
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Create Thread Form Component
//   const CreateThreadForm = () => {
//     const [formData, setFormData] = useState({
//       title: '',
//       description: '',
//       location: '',
//       category: 'other',
//       tags: '',
//       duration: '2'
//     });

//     const handleSubmit = async () => {
//       if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) return;
//       setLoading(true);
      
//       // Combine category with custom tags
//       const allTags = [formData.category];
//       if (formData.tags.trim()) {
//         allTags.push(...formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag));
//       }

//       const threadData = {
//         title: formData.title,
//         description: formData.description,
//         creator: currentUser.username,
//         creatorId: currentUser.id,
//         location: formData.location,
//         tags: allTags,
//         expiresAt: new Date(Date.now() + parseInt(formData.duration) * 60 * 60 * 1000).toISOString()
//       };

//       // Optimistic update - close form immediately
//       setShowCreateForm(false);
//       const tempFormData = { ...formData };
//       setFormData({ title: '', description: '', location: '', category: 'other', tags: '', duration: '2' });

//       try {
//         const result = await threadsAPI.create(threadData);
//         if (result.data.success) {
//           loadThreads();
//         }
//       } catch (error) {
//         alert('Error creating thread');
//         // Restore form on error
//         setShowCreateForm(true);
//         setFormData(tempFormData);
//       } finally {
//         setLoading(false);
//       }
//     };

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold text-gray-900">Create Event Thread</h2>
//             <button onClick={() => setShowCreateForm(false)} className="text-gray-500 hover:text-gray-700">
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//           <div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
//               <input
//                 type="text"
//                 placeholder="e.g., Coffee & Code meetup"
//                 value={formData.title}
//                 onChange={(e) => setFormData({...formData, title: e.target.value})}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//               <textarea
//                 placeholder="What's this event about?"
//                 value={formData.description}
//                 onChange={(e) => setFormData({...formData, description: e.target.value})}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 rows={3}
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
//               <input
//                 type="text"
//                 placeholder="e.g., Starbucks Downtown"
//                 value={formData.location}
//                 onChange={(e) => setFormData({...formData, location: e.target.value})}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//               <select
//                 value={formData.category}
//                 onChange={(e) => setFormData({...formData, category: e.target.value})}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 {categories.filter(c => c.id !== 'all').map(cat => (
//                   <option key={cat.id} value={cat.id}>{cat.label}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Additional Tags (Optional)</label>
//               <input
//                 type="text"
//                 placeholder="e.g., beginner-friendly, casual (comma separated)"
//                 value={formData.tags}
//                 onChange={(e) => setFormData({...formData, tags: e.target.value})}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
//               <select
//                 value={formData.duration}
//                 onChange={(e) => setFormData({...formData, duration: e.target.value})}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="1">1 hour</option>
//                 <option value="2">2 hours</option>
//                 <option value="4">4 hours</option>
//                 <option value="8">8 hours</option>
//               </select>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowCreateForm(false)}
//                 className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
//               >
//                 {loading ? 'Creating...' : 'Create Thread'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Edit Thread Form Component
//   const EditThreadForm = () => {
//     const [formData, setFormData] = useState({
//       title: editingThread?.title || '',
//       description: editingThread?.description || '',
//       location: editingThread?.location || '',
//       tags: editingThread?.tags?.join(', ') || ''
//     });

//     const handleSubmit = async () => {
//       if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) return;
//       setLoading(true);

//       const updateData = {
//         title: formData.title,
//         description: formData.description,
//         location: formData.location,
//         tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
//         userId: currentUser.id
//       };

//       try {
//         const result = await threadsAPI.update(editingThread.id, updateData);
//         if (result.data.success) {
//           setShowEditForm(false);
//           setEditingThread(null);
//           loadThreads();
//           alert('Thread updated successfully!');
//         }
//       } catch (error) {
//         alert('Error updating thread');
//       }
//       setLoading(false);
//     };

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold text-gray-900">Edit Thread</h2>
//             <button onClick={() => {
//               setShowEditForm(false);
//               setEditingThread(null);
//             }} className="text-gray-500 hover:text-gray-700">
//               <X className="w-5 h-5" />
//             </button>
//           </div>
          
//           <div>
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
//               <input
//                 type="text"
//                 placeholder="e.g., Coffee & Code meetup"
//                 value={formData.title}
//                 onChange={(e) => setFormData({...formData, title: e.target.value})}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
            
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//               <textarea
//                 placeholder="What's this event about?"
//                 value={formData.description}
//                 onChange={(e) => setFormData({...formData, description: e.target.value})}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 rows={3}
//               />
//             </div>
            
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
//               <input
//                 type="text"
//                 placeholder="e.g., Starbucks Downtown"
//                 value={formData.location}
//                 onChange={(e) => setFormData({...formData, location: e.target.value})}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
            
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
//               <input
//                 type="text"
//                 placeholder="coffee, coding, social (comma separated)"
//                 value={formData.tags}
//                 onChange={(e) => setFormData({...formData, tags: e.target.value})}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
            
//             <div className="flex gap-3">
//               <button
//                 onClick={() => {
//                   setShowEditForm(false);
//                   setEditingThread(null);
//                 }}
//                 className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
//               >
//                 {loading ? 'Updating...' : 'Update Thread'}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Chat View Component
//   const ChatView = () => {
//     if (!selectedThread) return null;
//     const isCreator = selectedThread.creatorId === currentUser.id;
//     const isMember = selectedThread.members.includes(currentUser.id);
//     const isAdmin = currentUser.isAdmin;

//     // Join thread room on mount
//     useEffect(() => {
//       if (socketRef.current && selectedThread) {
//         socketRef.current.emit('join-thread', selectedThread.id);
        
//         // Listen for new messages
//         const handleNewMessage = (message) => {
//           console.log('📨 New message received:', message);
          
//           // Add message to chat
//           setSelectedThread(prev => ({
//             ...prev,
//             chat: [...prev.chat.filter(msg => !msg.isPending), message]
//           }));

//           // Show DEVICE notification for alerts (only for other users)
//           if (message.user === 'Alert' && message.userId !== currentUser.id) {
//             console.log('🚨 Alert received from another user!');
            
//             if ('Notification' in window) {
//               console.log('Notification permission:', Notification.permission);
              
//               if (Notification.permission === 'granted') {
//                 console.log('✅ Showing notification...');
                
//                 // Create notification
//                 // Clean and force left-to-right alert text
// const cleanAlertText = message.message
//   .replace(/[\u202A-\u202E]/g, '')   // remove hidden direction markers
//   .normalize('NFC')
//   .trim();

// const notification = new Notification(`🚨 Alert from ${selectedThread.title}`, {
//   body: `\u202A${cleanAlertText}`,    // \u202A forces Left-to-Right direction
//   icon: '/vite.svg',
//   badge: '/vite.svg',
//   tag: `alert-${message.id}`,
//   requireInteraction: true,
//   silent: false
// });


//                 // Notification click handler
//                 notification.onclick = () => {
//                   window.focus();
//                   notification.close();
//                 };

//                 console.log('✅ Notification created successfully');
//               } else if (Notification.permission === 'default') {
//                 console.log('⚠️ Requesting notification permission...');
//                 Notification.requestPermission().then(permission => {
//                   if (permission === 'granted') {
//                     new Notification(`🚨 Alert from ${selectedThread.title}`, {
//                       body: message.message,
//                       icon: '/vite.svg',
//                       tag: `alert-${message.id}`,
//                       requireInteraction: true
//                     });
//                   }
//                 });
//               } else {
//                 console.log('❌ Notifications denied');
//               }
//             } else {
//               console.log('❌ Notifications not supported in this browser');
//             }
//           }
//         };

//         socketRef.current.on('new-message', handleNewMessage);

//         return () => {
//           socketRef.current.emit('leave-thread', selectedThread.id);
//           socketRef.current.off('new-message', handleNewMessage);
//         };
//       }
//     }, [selectedThread?.id, notificationsEnabled]);

//     const sendMessage = async () => {
//       if (!newMessage.trim()) return;
      
//       const tempMessage = {
//         id: `temp-${Date.now()}`,
//         user: currentUser.username,
//         userId: currentUser.id,
//         message: newMessage.trim(),
//         timestamp: new Date().toISOString(),
//         isPending: true
//       };

//       // Optimistic update
//       setSelectedThread(prev => ({
//         ...prev,
//         chat: [...prev.chat, tempMessage]
//       }));
      
//       const messageText = newMessage.trim();
//       setNewMessage('');

//       try {
//         const messageData = {
//           user: currentUser.username,
//           userId: currentUser.id,
//           message: messageText
//         };
        
//         await threadsAPI.sendMessage(selectedThread.id, messageData);
//         // Socket will handle adding the real message
//       } catch (error) {
//         // Remove pending message on error
//         setSelectedThread(prev => ({
//           ...prev,
//           chat: prev.chat.filter(msg => msg.id !== tempMessage.id)
//         }));
//         setNewMessage(messageText);
//         alert('Error sending message');
//       }
//     };

//     const handleKeyPress = (e) => {
//       if (e.key === 'Enter' && !e.shiftKey) {
//         e.preventDefault();
//         sendMessage();
//       }
//     };

//     const handleRequest = async (userId, approve) => {
//       try {
//         const result = await threadsAPI.handleRequest(selectedThread.id, userId, approve, currentUser.id);
//         if (result.data.success) {
//           // Optimistic update for request handling
//           setSelectedThread(prev => ({
//             ...prev,
//             pendingRequests: prev.pendingRequests.filter(id => id !== userId),
//             members: approve ? [...prev.members, userId] : prev.members
//           }));
//           loadThreads();
//         }
//       } catch (error) {
//         alert('Error handling request');
//         loadThreads(); // Revert on error
//       }
//     };

//     const sendAlert = async () => {
//       if (!alertMessage.trim()) {
//         alert('Please enter an alert message');
//         return;
//       }

//       const messageText = alertMessage.trim();
//       console.log('Alert message typed:', messageText);
//       console.log('Alert message length:', messageText.length);
//       console.log('Alert message chars:', messageText.split('').map((c, i) => `[${i}]: ${c}`).join(', '));
      
//       try {
//         const messageData = {
//           user: 'Alert',
//           userId: currentUser.id,
//           message: messageText  // Send clean message without prefix
//         };
        
//         console.log('Sending alert data:', JSON.stringify(messageData, null, 2));
        
//         const result = await threadsAPI.sendMessage(selectedThread.id, messageData);
        
//         console.log('Alert response:', result.data);
        
//         if (result.data.success) {
//           setAlertMessage('');
//           setShowAlertModal(false);
//           console.log('✅ Alert sent successfully');
//         }
//       } catch (error) {
//         console.error('❌ Error sending alert:', error);
//         alert('Error sending alert. Please try again.');
//       }
//     };

//     const getUsernameById = (userId) => {
//       if (userId === currentUser?.id) return currentUser.username;
//       return `User_${userId.slice(-4)}`;
//     };

//     return (
//       <div className="fixed inset-0 bg-white z-40 flex flex-col">
//         <div className="bg-white border-b border-gray-200 p-4">
//           <div className="flex items-center justify-between">
//             <button onClick={() => setSelectedThread(null)} className="text-gray-600 hover:text-gray-800">
//               ← Back
//             </button>
//             <div className="text-center flex-1">
//               <h2 className="font-semibold text-gray-900">{selectedThread.title}</h2>
//               <p className="text-sm text-gray-500">{selectedThread.members.length} members • {getTimeRemaining(selectedThread.expiresAt)} left</p>
//             </div>
//             {isCreator && (
//               <button
//                 onClick={() => setShowAlertModal(true)}
//                 className="flex items-center gap-1 px-3 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
//                 title="Send Alert to All Members"
//               >
//                 <span className="text-lg">🚨</span>
//                 Alert
//               </button>
//             )}
//             {!isCreator && <div className="w-20"></div>}
//           </div>
//         </div>
//         {isCreator && selectedThread.pendingRequests.length > 0 && (
//           <div className="bg-orange-50 border-b border-orange-200 p-4">
//             <h3 className="font-medium text-orange-900 mb-2">Join Requests ({selectedThread.pendingRequests.length})</h3>
//             <div className="space-y-2">
//               {selectedThread.pendingRequests.map(userId => (
//                 <div key={userId} className="flex items-center justify-between bg-white p-2 rounded-lg">
//                   <span className="text-sm font-medium">{getUsernameById(userId)}</span>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleRequest(userId, false)}
//                       className="p-1 text-red-600 hover:bg-red-50 rounded"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={() => handleRequest(userId, true)}
//                       className="p-1 text-green-600 hover:bg-green-50 rounded"
//                     >
//                       <Check className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//         <div className="flex-1 overflow-y-auto p-4 space-y-3 chat-container">
//           {selectedThread.chat && selectedThread.chat.length > 0 ? (
//             selectedThread.chat.map(msg => (
//               <div key={msg.id} className={`flex ${
//                 msg.user === 'Alert' ? 'justify-center' : 
//                 msg.user === currentUser.username ? 'justify-end' : 
//                 'justify-start'
//               }`}>
//                 <div className={`${
//                   msg.user === 'Alert' ? 'max-w-full w-full' : 'max-w-xs lg:max-w-md'
//                 } px-4 py-3 rounded-lg ${
//                   msg.user === 'Alert'
//                     ? 'bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-400 shadow-lg'
//                     : msg.user === currentUser.username
//                     ? `bg-blue-600 text-white ${msg.isPending ? 'opacity-70' : ''}`
//                     : msg.user === 'System'
//                     ? 'bg-gray-100 text-gray-600 text-center text-sm'
//                     : 'bg-gray-100 text-gray-900'
//                 }`}>
//                   {msg.user === 'Alert' && (
//                     <div className="flex items-center justify-center gap-2 mb-2 font-bold text-red-700">
//                       <span className="text-2xl animate-pulse">🚨</span>
//                       <span className="text-lg">CREATOR ALERT</span>
//                       <span className="text-2xl animate-pulse">🚨</span>
//                     </div>
//                   )}
//                   {msg.user !== currentUser.username && msg.user !== 'System' && msg.user !== 'Alert' && (
//                     <div className="text-xs font-medium mb-1 opacity-70">{msg.user}</div>
//                   )}
//                   <div className={`${
//                     msg.user === 'Alert' 
//                       ? 'text-base font-bold text-center text-gray-900' 
//                       : 'text-sm'
//                   }`}>
//                     {msg.user === 'Alert' 
//                       ? msg.message
//                       : msg.message}
//                   </div>
//                   <div className={`text-xs opacity-70 mt-1 flex items-center ${
//                     msg.user === 'Alert' ? 'justify-center' : ''
//                   } gap-1`}>
//                     {formatTime(msg.timestamp)}
//                     {msg.isPending && <span className="text-xs">⏳</span>}
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center text-gray-400 mt-8">No messages yet</div>
//           )}
//           <div ref={chatEndRef} />
//         </div>
//         {(isMember || isAdmin) && (
//           <div className="bg-white border-t border-gray-200 p-4">
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 placeholder="Type a message..."
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 onKeyDown={handleKeyPress}
//                 className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 autoFocus
//                 disabled={isAdmin && !isMember}
//               />
//               <button
//                 onClick={sendMessage}
//                 disabled={!newMessage.trim() || (isAdmin && !isMember)}
//                 className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Send className="w-5 h-5" />
//               </button>
//             </div>
//             {isAdmin && !isMember && (
//               <p className="text-xs text-gray-500 mt-2">Admin view only - cannot send messages</p>
//             )}
//           </div>
//         )}

//         {/* Alert Modal */}
//         {showAlertModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-2">
//                   <span className="text-2xl">🚨</span>
//                   <h3 className="text-xl font-bold text-gray-900">Send Alert</h3>
//                 </div>
//                 <button onClick={() => setShowAlertModal(false)} className="text-gray-500 hover:text-gray-700">
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//               <p className="text-sm text-gray-600 mb-4">
//                 This will send a highlighted message to all members. Use for important announcements like location changes, cancellations, or urgent updates.
//               </p>
//               <textarea
//                 placeholder="e.g., Location changed to Central Park! See you there at 5 PM."
//                 value={alertMessage}
//                 onChange={(e) => setAlertMessage(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
//                 rows={4}
//                 maxLength={200}
//                 autoFocus
//                 dir="ltr"
//                 style={{ direction: 'ltr', textAlign: 'left' }}
//               />
//               <div className="text-xs text-gray-500 mb-4">
//                 {alertMessage.length}/200 characters
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => {
//                     setShowAlertModal(false);
//                     setAlertMessage('');
//                   }}
//                   className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={sendAlert}
//                   disabled={!alertMessage.trim()}
//                   className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   <span className="text-lg">🚨</span>
//                   Send Alert
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Main render
//   if (showLoginForm) return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />;
//   if (showAdminDashboard) return <AdminDashboard />;
//   if (showGossipsPage) {
//   return (
//     <GossipsPage
//       currentUser={currentUser}
//       socketRef={socketRef}
//       onBack={() => setShowGossipsPage(false)}
//     />
//   );
// }


//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-4xl mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">EventThreads</h1>
//               <p className="text-sm text-gray-600">Temporary interest-based connections</p>
//             </div>
//             <div className="flex items-center gap-3">
//               <span className="text-sm text-gray-600">Hi, {currentUser.username}!</span>
              
//               {/* Notification Permission Button */}
//               {!notificationsEnabled && 'Notification' in window && Notification.permission !== 'denied' && (
//                 <button
//                   onClick={async () => {
//                     const permission = await Notification.requestPermission();
//                     if (permission === 'granted') {
//                       setNotificationsEnabled(true);
//                       new Notification('EventThreads Notifications Enabled! 🎉', {
//                         body: 'You will now receive alerts for important updates.',
//                         icon: '/vite.svg',
//                         tag: 'notification-enabled'
//                       });
//                     } else {
//                       alert('Please enable notifications in your browser settings to receive alerts.');
//                     }
//                   }}
//                   className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-lg hover:bg-green-200 transition-colors animate-pulse"
//                   title="Enable notifications for alerts"
//                 >
//                   🔔 Enable Alerts
//                 </button>
//               )}

//               {notificationsEnabled && (
//                 <span className="text-xs text-green-600 flex items-center gap-1">
//                   ✅ Alerts On
//                 </span>
//               )}

//               {currentUser.isAdmin && (
//                 <button
//                   onClick={() => setShowAdminDashboard(true)}
//                   className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
//                 >
//                   <Shield className="w-4 h-4" />
//                   Admin
//                 </button>
//               )}
//               <button
//                 onClick={() => {
//                   setCurrentUser(null);
//                   setShowLoginForm(true);
//                 }}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <LogOut className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>
//       <main className="max-w-4xl mx-auto px-4 py-6">
//         <div className="mb-6">
//           <button
//             onClick={() => setShowCreateForm(true)}
//             className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//           >
//             <Plus className="w-5 h-5" />
//             Create Event Thread
//           </button>
//         </div>

//         {/* Filter and Sort Bar */}
//         <div className="mb-6 space-y-4">
//           {/* Category Filter */}
//           <div className="bg-white rounded-lg border border-gray-200 p-4">
//             <h3 className="text-sm font-semibold text-gray-700 mb-3">Categories</h3>
//             <div className="flex flex-wrap gap-2">
//               {categories.map(cat => (
//                 <button
//                   key={cat.id}
//                   onClick={() => setFilterCategory(cat.id)}
//                   className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                     filterCategory === cat.id
//                       ? 'bg-blue-600 text-white'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   {cat.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Sort Options */}
//           <div className="bg-white rounded-lg border border-gray-200 p-4">
//             <h3 className="text-sm font-semibold text-gray-700 mb-3">Sort By</h3>
//             <div className="flex flex-wrap gap-2">
//               <button
//                 onClick={() => setSortBy('newest')}
//                 className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   sortBy === 'newest'
//                     ? 'bg-purple-600 text-white'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 🆕 Newest First
//               </button>
//               <button
//                 onClick={() => setSortBy('oldest')}
//                 className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   sortBy === 'oldest'
//                     ? 'bg-purple-600 text-white'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 ⏰ Oldest First
//               </button>
//               <button
//                 onClick={() => setSortBy('mostMembers')}
//                 className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   sortBy === 'mostMembers'
//                     ? 'bg-purple-600 text-white'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 👥 Most Members
//               </button>
//               <button
//                 onClick={() => setSortBy('expiringSoon')}
//                 className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   sortBy === 'expiringSoon'
//                     ? 'bg-purple-600 text-white'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 ⚡ Expiring Soon
//               </button>
//               <button
//                 onClick={() => setSortBy('mostActive')}
//                 className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                   sortBy === 'mostActive'
//                     ? 'bg-purple-600 text-white'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 💬 Most Active
//               </button>
//             </div>
//           </div>
//         </div>
// <button
//   onClick={() => setShowGossipsPage(true)}
//   className="flex items-center gap-1 px-3 py-2 bg-pink-600 text-white text-sm rounded-lg hover:bg-pink-700 transition-colors"
// >
//   🗣️ Gossips
// </button>

//         <div className="mb-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">
//             {filterCategory === 'all' ? 'All Threads' : `${categories.find(c => c.id === filterCategory)?.label} Threads`} ({getFilteredAndSortedThreads().length})
//           </h2>
//           {getFilteredAndSortedThreads().length === 0 ? (
//             <div className="text-center py-12">
//               <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No active threads</h3>
//               <p className="text-gray-600 mb-4">Be the first to create an event thread!</p>
//               <button
//                 onClick={() => setShowCreateForm(true)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Create Thread
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {getFilteredAndSortedThreads().map(thread => {
//                 const isCreator = thread.creatorId === currentUser.id;
//                 const isMember = thread.members.includes(currentUser.id);
//                 const hasPendingRequest = thread.pendingRequests.includes(currentUser.id);
//                 const hasPendingRequests = isCreator && thread.pendingRequests.length > 0;
//                 return (
//                   <div key={thread.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
//                     <div className="flex justify-between items-start mb-3">
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-gray-900 mb-1">{thread.title}</h3>
//                         <p className="text-gray-600 text-sm mb-2">{thread.description}</p>
//                         <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
//                           <div className="flex items-center gap-1">
//                             <User className="w-4 h-4" />
//                             <span>{thread.creator}</span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <MapPin className="w-4 h-4" />
//                             <span>{thread.location}</span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <Clock className="w-4 h-4" />
//                             <span>{getTimeRemaining(thread.expiresAt)}</span>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2 mb-3">
//                           <Users className="w-4 h-4 text-gray-400" />
//                           <span className="text-sm text-gray-600">{thread.members.length} members</span>
//                           {hasPendingRequests && (
//                             <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
//                               {thread.pendingRequests.length} pending
//                             </span>
//                           )}
//                         </div>
//                         <div className="flex flex-wrap gap-1 mb-3">
//                           {thread.tags.map(tag => (
//                             <span key={tag} className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
//                               <Hash className="w-3 h-3" />
//                               {tag}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="flex gap-2">
//                       {isCreator && (
//                         <button
//                           onClick={() => {
//                             setEditingThread(thread);
//                             setShowEditForm(true);
//                           }}
//                           className="px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
//                         >
//                           Edit
//                         </button>
//                       )}
//                       {isMember ? (
//                         <button
//                           onClick={() => setSelectedThread(thread)}
//                           className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-1"
//                         >
//                           <MessageCircle className="w-4 h-4" />
//                           Chat ({thread.chat.length})
//                         </button>
//                       ) : hasPendingRequest ? (
//                         <button className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg flex-1 cursor-not-allowed">
//                           Request Pending...
//                         </button>
//                       ) : (
//                         <button
//                           onClick={async () => {
//                             // Optimistic update
//                             setThreads(prevThreads => 
//                               prevThreads.map(t => 
//                                 t.id === thread.id 
//                                   ? { ...t, pendingRequests: [...t.pendingRequests, currentUser.id] }
//                                   : t
//                               )
//                             );

//                             try {
//                               await threadsAPI.requestJoin(thread.id, currentUser.id);
//                               loadThreads();
//                             } catch (error) {
//                               alert('Error sending join request');
//                               // Revert optimistic update on error
//                               loadThreads();
//                             }
//                           }}
//                           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1"
//                         >
//                           <Plus className="w-4 h-4" />
//                           Request to Join
//                         </button>
//                       )}
//                       {hasPendingRequests && (
//                         <button
//                           onClick={() => setSelectedThread(thread)}
//                           className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
//                         >
//                           Review Requests
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </main>
//       {showCreateForm && <CreateThreadForm />}
//       {showEditForm && <EditThreadForm />}
//       {selectedThread && <ChatView />}
//     </div>
//   );
// }

// export default App;


//2 with improved ui
// import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
// import { Clock, Users, MapPin, MessageCircle, Plus, X, Check, Hash, Calendar, Send, LogOut, User, Shield, Trash2, Eye, MessageSquare, Moon, Sun, Bell, Sparkles, ArrowUpDown, TrendingUp, TrendingDown, Zap, AlertTriangle } from 'lucide-react';
// import TextareaAutosize from 'react-textarea-autosize';
// import { authAPI, threadsAPI, adminAPI } from './services/api';
// import LoginPage from './components/LoginPage';
// import GossipsPage from './components/GossipsPage';
// import MobileRouter from './components/mobile/MobileRouter';
// import { io } from 'socket.io-client';
// import { useTheme } from './context/ThemeContext';

// // remove bidi / directionality chars and normalize
// const cleanBidi = (s = '') =>
//   String(s)
//     .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '')
//     .normalize('NFC')
//     .trim();

// const ALERT_PRESETS = [
//   'Urgent update: Please assemble in 10 minutes.',
//   'Schedule change: Event starting immediately.',
//   'Reminder: Check the event chat right away.',
//   'Emergency: Contact the organizer ASAP.',
//   'Weather alert: Move indoors now.'
// ];

// const SOCKET_URL = import.meta.env.VITE_API_URL || '';

// // Helper functions
// const formatTime = (dateString) => {
//   return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// };

// const formatDateDivider = (dateString) => {
//     const date = new Date(dateString);
//     const today = new Date();
//     const yesterday = new Date();
//     yesterday.setDate(yesterday.getDate() - 1);

//     if (date.toDateString() === today.toDateString()) {
//         return 'Today';
//     }
//     if (date.toDateString() === yesterday.toDateString()) {
//         return 'Yesterday';
//     }
//     return date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
// };

// const getTimeRemaining = (expiresAt) => {
//   const diff = new Date(expiresAt) - new Date();
//   const hours = Math.floor(diff / (1000 * 60 * 60));
//   const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//   if (hours > 0) return `${hours}h ${minutes}m`;
//   if (minutes > 0) return `${minutes}m`;
//   return 'Expiring soon';
// };

// const ChatMessage = React.memo(({ msg, currentUser, isDark }) => {
//     const sanitizedMessage = cleanBidi(msg.message);
//     const isAlert = msg.user === 'Alert';
//     const isCurrentUser = msg.user === currentUser.username;
//     const isSystemMessage = msg.user === 'System';
    
//     const bubbleColor = isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 shadow-md';
//     const myBubbleColor = isDark ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white shadow-lg';
//     const alertBubbleColor = 'bg-gradient-to-r from-red-100 to-orange-100 border-2 border-orange-400 shadow-xl';

//     if (isAlert) {
//       return (
//         <div className="flex justify-center my-2">
//           <div className={`w-full max-w-lg px-5 py-3 rounded-xl ${alertBubbleColor}`}>
//             <div className="flex items-center justify-center gap-2 mb-2 text-red-700 dark:text-red-500 font-bold">
//               <span className="text-2xl animate-pulse" role="img" aria-label="alert">🚨</span>
//               <span className="tracking-wide uppercase text-sm">Creator Alert</span>
//               <span className="text-2xl animate-pulse" role="img" aria-label="alert">🚨</span>
//             </div>
//             <div
//               className="text-base font-semibold text-center text-gray-900 dark:text-gray-800"
//               dir="ltr"
//               style={{ direction: 'ltr', unicodeBidi: 'plaintext' }}
//             >
//               {sanitizedMessage}
//             </div>
//             <div className="text-xs text-orange-700 opacity-80 mt-2 flex items-center justify-center gap-1">
//               {formatTime(msg.timestamp)}
//             </div>
//           </div>
//         </div>
//       );
//     }

//     if (isSystemMessage) {
//        return (
//           <div className="flex justify-center my-2">
//               <div className={`px-4 py-2 rounded-lg max-w-xs ${isDark ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-200 text-gray-600'} text-center text-sm`}>
//                   {sanitizedMessage}
//               </div>
//           </div>
//        );
//     }

//     return (
//       <div
//         className={`flex items-end ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
//       >
//         <div className="max-w-xs lg:max-w-md">
//           <div className={`px-4 py-2.5 rounded-2xl ${isCurrentUser ? 'rounded-br-lg' : 'rounded-tl-lg'} ${
//             isCurrentUser
//               ? myBubbleColor
//               : bubbleColor
//           }`}>
//             {!isCurrentUser && (
//                 <div className="text-xs font-bold mb-1 text-blue-400 dark:text-teal-400">
//                     {msg.user}
//                 </div>
//             )}
//             <div
//               className="text-sm"
//               dir="ltr"
//               style={{ direction: 'ltr', unicodeBidi: 'plaintext', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
//             >
//               {sanitizedMessage}
//             </div>
//             <div
//               className={`text-xs opacity-80 mt-1.5 flex items-center justify-end gap-1`}
//             >
//               {formatTime(msg.timestamp)}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
// });

// function App() {
//   const { isDark, toggleTheme } = useTheme();
//   const [currentUser, setCurrentUser] = useState(null);
//   const [threads, setThreads] = useState([]);
//   const [selectedThread, setSelectedThread] = useState(null);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [showLoginForm, setShowLoginForm] = useState(true);
//   const [showAdminDashboard, setShowAdminDashboard] = useState(false);
//   const [showGossips, setShowGossips] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [adminData, setAdminData] = useState(null);
//   const [showEditForm, setShowEditForm] = useState(false);
//   const [editingThread, setEditingThread] = useState(null);
//   const [filterCategory, setFilterCategory] = useState('all');
//   const [sortBy, setSortBy] = useState('newest');
//   const [showAlertModal, setShowAlertModal] = useState(false);
//   const [alertMessage, setAlertMessage] = useState('');
//   const [notificationsEnabled, setNotificationsEnabled] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const socketRef = useRef(null);
  
//   const alertInputRef = useRef(null);

//   // Check for existing session on mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem('currentUser');
//     if (storedUser) {
//       try {
//         const user = JSON.parse(storedUser);
//         setCurrentUser(user);
//         setShowLoginForm(false);
//       } catch (error) {
//         console.error('Error parsing stored user:', error);
//         localStorage.removeItem('currentUser');
//       }
//     }
//     setLoading(false);
//   }, []);

//   // Responsive breakpoint listener
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Request notification permission on login
//   useEffect(() => {
//     if (currentUser && !showLoginForm && 'Notification' in window) {
//       if (Notification.permission === 'granted') {
//         setNotificationsEnabled(true);
//       } else if (Notification.permission !== 'denied') {
//         Notification.requestPermission().then(permission => {
//           if (permission === 'granted') {
//             setNotificationsEnabled(true);
//             new Notification('Prastha', {
//               body: 'Notifications enabled! You\'ll be alerted for important messages.',
//               icon: '/vite.svg'
//             });
//           }
//         });
//       }
//     }
//   }, [currentUser, showLoginForm]);

//   const categories = [
//     { id: 'all', label: '🌟 All', icon: Calendar },
//     { id: 'sports', label: '⚽ Sports', icon: Users },
//     { id: 'food', label: '🍕 Food & Drinks', icon: Users },
//     { id: 'entertainment', label: '🎬 Entertainment', icon: Users },
//     { id: 'tech', label: '💻 Tech & Coding', icon: Users },
//     { id: 'study', label: '📚 Study Groups', icon: Users },
//     { id: 'music', label: '🎵 Music', icon: Users },
//     { id: 'fitness', label: '💪 Fitness', icon: Users },
//     { id: 'gaming', label: '🎮 Gaming', icon: Users },
//     { id: 'other', label: '✨ Other', icon: Users }
//   ];

//   const sortOptions = [
//     { id: 'newest', label: 'Newest', icon: TrendingUp },
//     { id: 'oldest', label: 'Oldest', icon: TrendingDown },
//     { id: 'mostMembers', label: 'Most Members', icon: Users },
//     { id: 'expiringSoon', label: 'Expiring Soon', icon: Zap },
//     { id: 'mostActive', label: 'Most Active', icon: MessageCircle }
//   ];

//   // Initialize Socket.io
//   useEffect(() => {
//     if (currentUser && !showLoginForm) {
//       socketRef.current = io(SOCKET_URL, { transports: ['websocket', 'polling'] });

//       socketRef.current.on('connect', () => console.log('✅ Socket connected'));
//       socketRef.current.on('refresh-threads', () => loadThreads());
//       socketRef.current.on('disconnect', () => console.log('❌ Socket disconnected'));

//       socketRef.current.on('new-thread-created', (data) => {
//         if (notificationsEnabled && data.creatorId !== currentUser.id) {
//           const notification = new Notification('🎉 New Event Thread!', {
//             body: `${data.creator} created: "${data.title}"`,
//             icon: '/vite.svg',
//             tag: `thread-${data.threadId}`,
//           });
//           notification.onclick = () => { window.focus(); loadThreads(); notification.close(); };
//         }
//         loadThreads();
//       });

//       return () => { if (socketRef.current) socketRef.current.disconnect(); };
//     }
//   }, [currentUser, showLoginForm, notificationsEnabled]);

//   // Load threads periodically
//   useEffect(() => {
//     if (currentUser && !showLoginForm) {
//       loadThreads();
//       const interval = setInterval(() => { if (!showCreateForm && !showEditForm) loadThreads(); }, 60000);
//       return () => clearInterval(interval);
//     }
//   }, [currentUser, showLoginForm, showCreateForm, showEditForm]);

//   // Load admin dashboard
//   useEffect(() => {
//     if (currentUser?.isAdmin && showAdminDashboard) loadAdminDashboard();
//   }, [currentUser, showAdminDashboard]);

//   const loadThreads = async () => {
//     try {
//       const response = await threadsAPI.getAll();
//       if (response.data.success) {
//         setThreads(response.data.threads);
//         if (selectedThread) {
//           const updatedThread = response.data.threads.find(t => t.id === selectedThread.id);
//           setSelectedThread(updatedThread || null);
//         }
//       }
//     } catch (error) { console.error('Error loading threads:', error); }
//   };

//   const getFilteredAndSortedThreads = () => {
//     let filtered = threads;
//     if (filterCategory !== 'all') {
//       filtered = threads.filter(thread => thread.tags.some(tag => tag.toLowerCase().includes(filterCategory.toLowerCase())));
//     }
//     return [...filtered].sort((a, b) => {
//       switch (sortBy) {
//         case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
//         case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
//         case 'mostMembers': return b.members.length - a.members.length;
//         case 'expiringSoon': return new Date(a.expiresAt) - new Date(b.expiresAt);
//         case 'mostActive': return b.chat.length - a.chat.length;
//         default: return 0;
//       }
//     });
//   };

//   const loadAdminDashboard = async () => {
//     try {
//       const response = await adminAPI.getDashboard(currentUser.id);
//       if (response.data.success) setAdminData(response.data.data);
//     } catch (error) { console.error('Error loading admin dashboard:', error); }
//   };

//   const handleLogin = async (username, password, isAdmin) => {
//     try {
//       const response = await authAPI.login(username, password, isAdmin);
//       if (response.data.success) {
//         setCurrentUser(response.data.user);
//         setShowLoginForm(false);
//         localStorage.setItem('currentUser', JSON.stringify(response.data.user));
//       } else { throw new Error(response.data.message || 'Login failed.'); }
//     } catch (error) { throw new Error(error.response?.data?.message || 'Login failed.'); }
//   };

//   const handleRegister = async (username, password) => {
//     try {
//       const response = await authAPI.register(username, password);
//       if (response.data.success) {
//         setCurrentUser(response.data.user);
//         setShowLoginForm(false);
//         localStorage.setItem('currentUser', JSON.stringify(response.data.user));
//         if ('Notification' in window && Notification.permission === 'default') {
//           setTimeout(() => {
//             Notification.requestPermission().then(p => { if (p === 'granted') setNotificationsEnabled(true); });
//           }, 1000);
//         }
//       } else { throw new Error(response.data.message || 'Registration failed.'); }
//     } catch (error) { throw new Error(error.response?.data?.message || 'Registration failed.'); }
//   };

//   const AdminDashboard = () => {
//     const handleDeleteThread = async (threadId) => {
//       if (window.confirm('Are you sure?')) {
//         try {
//           await threadsAPI.delete(threadId, currentUser.id);
//           loadAdminDashboard();
//           loadThreads();
//         } catch (error) {
//           alert('Error deleting thread');
//         }
//       }
//     };
//     const handleViewThread = (thread) => {
//       setSelectedThread({
//         ...thread,
//         id: thread.id || thread._id
//       });
//       setShowAdminDashboard(false);
//     };
//     return (
//       <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
//         <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold">Admin Dashboard</h1>
//             <p className="opacity-90">System Overview</p>
//           </div>
//           <button onClick={() => setShowAdminDashboard(false)} className="text-white hover:text-blue-200"><X /></button>
//         </div>
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <div className="bg-white p-6 rounded-lg border"><h3 className="text-lg font-semibold mb-2">Total Threads</h3><p className="text-3xl font-bold text-blue-600">{adminData?.totalThreads ?? 0}</p></div>
//             <div className="bg-white p-6 rounded-lg border"><h3 className="text-lg font-semibold mb-2">Active Users</h3><p className="text-3xl font-bold text-green-600">{adminData?.activeUsers ?? 0}</p></div>
//             <div className="bg-white p-6 rounded-lg border"><h3 className="text-lg font-semibold mb-2">Total Users</h3><p className="text-3xl font-bold text-purple-600">{adminData?.totalUsers ?? 0}</p></div>
//           </div>
//           <div className="mb-8">
//             <h2 className="text-xl font-bold mb-4">Active Threads</h2>
//             {(adminData?.threads?.length === 0) ? <p>No active threads.</p> : (
//               <div className="space-y-4">
//                 {adminData?.threads.map(thread => (
//                   <div key={thread.id || thread._id} className="bg-white p-4 rounded-lg border">
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <h3 className="font-semibold">{thread.title}</h3>
//                         <p className="text-sm text-gray-600">{thread.description}</p>
//                         <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
//                           <span>👤 {thread.creatorUsername}</span><span>📍 {thread.location}</span><span>⏰ {getTimeRemaining(thread.expiresAt)}</span><span>👥 {thread.members.length}</span><span>💬 {thread.chat.length}</span>
//                         </div>
//                       </div>
//                       <div className="flex gap-2">
//                         <button onClick={() => handleViewThread(thread)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="View"><Eye className="w-4 h-4" /></button>
//                         <button onClick={() => handleDeleteThread(thread.id || thread._id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4" /></button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//           {adminData?.users?.length > 0 && (
//             <div>
//               <h2 className="text-xl font-bold mb-4">Users</h2>
//               <div className="bg-white rounded-lg border overflow-hidden">
//                 <table className="w-full">
//                   <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium">Username</th><th className="px-4 py-3 text-left text-sm font-medium">Joined</th><th className="px-4 py-3 text-left text-sm font-medium">Status</th></tr></thead>
//                   <tbody className="divide-y">
//                     {adminData.users.map(user => (
//                       <tr key={user.id || user._id}><td className="px-4 py-3">{user.username}</td><td className="px-4 py-3 text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td><td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></td></tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };
  
//   const CreateThreadForm = () => {
//     const [formData, setFormData] = useState({ title: '', description: '', location: '', category: 'other', tags: '', duration: '2' });
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const handleSubmit = async () => {
//       if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) return;
//       setIsSubmitting(true);
      
//       const allTags = [formData.category, ...formData.tags.split(',').map(t => t.trim()).filter(Boolean)];
//       const threadData = { ...formData, tags: allTags, creator: currentUser.username, creatorId: currentUser.id, expiresAt: new Date(Date.now() + parseInt(formData.duration) * 3600000).toISOString() };

//       try {
//         await threadsAPI.create(threadData);
//         setShowCreateForm(false);
//         loadThreads();
//       } catch (error) {
//         alert('Error creating thread');
//       } finally {
//         setIsSubmitting(false);
//       }
//     };

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
//           <div className="flex justify-between items-center mb-4"><h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Create Event Thread</h2><button onClick={() => setShowCreateForm(false)} className={isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}><X/></button></div>
//           <div className="space-y-4">
//             <input type="text" placeholder="Event Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} dir="ltr" />
//             <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} rows={3} dir="ltr" />
//             <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} dir="ltr" />
//             <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
//               {categories.filter(c=>c.id!=='all').map(cat=><option key={cat.id} value={cat.id}>{cat.label}</option>)}
//             </select>
//             <input type="text" placeholder="Additional Tags (comma-separated)" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} dir="ltr" />
//             <select value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
//               <option value="1">1 hour</option><option value="2">2 hours</option><option value="4">4 hours</option><option value="8">8 hours</option>
//             </select>
//             <div className="flex gap-3"><button onClick={() => setShowCreateForm(false)} className={`flex-1 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>Cancel</button><button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{isSubmitting ? 'Creating...' : 'Create'}</button></div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const EditThreadForm = () => {
//     const [formData, setFormData] = useState({ title: editingThread?.title || '', description: editingThread?.description || '', location: editingThread?.location || '', tags: editingThread?.tags?.join(', ') || '' });
//     const [isSubmitting, setIsSubmitting] = useState(false);
    
//     const handleSubmit = async () => {
//       if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) return;
//       setIsSubmitting(true);
//       const updateData = { ...formData, tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean), userId: currentUser.id };
//       try {
//         await threadsAPI.update(editingThread.id, updateData);
//         setShowEditForm(false);
//         setEditingThread(null);
//         loadThreads();
//       } catch (error) {
//         alert('Error updating thread');
//       } finally {
//         setIsSubmitting(false);
//       }
//     };
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className={`rounded-lg p-6 w-full max-w-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
//           <div className="flex justify-between items-center mb-4"><h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Edit Thread</h2><button onClick={() => {setShowEditForm(false); setEditingThread(null);}} className={isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}><X/></button></div>
//           <div className="space-y-4">
//             <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} dir="ltr" />
//             <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} rows={3} dir="ltr" />
//             <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} dir="ltr" />
//             <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} dir="ltr" />
//             <div className="flex gap-3"><button onClick={() => {setShowEditForm(false); setEditingThread(null);}} className={`flex-1 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>Cancel</button><button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{isSubmitting ? 'Updating...' : 'Update'}</button></div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Chat View Component
//     // Chat View Component
//   const ChatView = () => {
//     if (!selectedThread) return null;

//     const [newMessage, setNewMessage] = useState('');
//     const isCreator = selectedThread.creatorId === currentUser.id;
//     const isMember = selectedThread.members.includes(currentUser.id);
//     const isAdmin = currentUser.isAdmin;
    
//     const chatEndRef = useRef(null);
//     const chatContainerRef = useRef(null); // Added missing ref
//     const isUserScrollingRef = useRef(false);
//     const scrollTimeoutRef = useRef(null);
//     const shouldAutoScrollRef = useRef(true); // Added missing ref
//     // Efficient scroll to bottom — avoids forced reflow
// // Smooth, reflow-safe scroll to bottom
// const scrollToBottom = (smooth = false) => {
//   const container = chatContainerRef.current;
//   if (!container || isUserScrollingRef.current) return;

//   // Avoid layout thrash by batching DOM write
//   requestAnimationFrame(() => {
//     container.scrollTo({
//       top: container.scrollHeight,
//       behavior: smooth ? 'smooth' : 'auto',
//     });
//   });
// };

// // Scroll on mount or when chat length changes
// useLayoutEffect(() => {
//   // UseLayoutEffect runs before paint → avoids layout jank
//   if (selectedThread?.chat?.length) {
//     scrollToBottom();
//   }
// }, [selectedThread?.chat?.length]);



//     // Detect user scrolling
//     const handleScroll = () => {
//         isUserScrollingRef.current = true;
        
//         if (scrollTimeoutRef.current) {
//             clearTimeout(scrollTimeoutRef.current);
//         }
        
//         scrollTimeoutRef.current = setTimeout(() => {
//             isUserScrollingRef.current = false;
//         }, 1000);
//     };

//     useEffect(() => {
//       if (socketRef.current && selectedThread) {
//         socketRef.current.emit('join-thread', selectedThread.id);
        
//         const handleNewMessage = (message) => {
//           setSelectedThread(prev => {
//             if (!prev || (message.threadId && prev.id !== message.threadId) || prev.chat.some(msg => msg.id === message.id)) {
//               return prev;
//             }
//             return { ...prev, chat: [...prev.chat, message] };
//           });

//           if (message.user === 'Alert' && message.userId !== currentUser.id && Notification.permission === 'granted') {
//             new Notification(`🚨 Alert from ${selectedThread.title}`, {
//               body: `\u202A${cleanBidi(message.message)}`, icon: '/vite.svg', tag: `alert-${message.id}`, requireInteraction: true,
//             }).onclick = () => { window.focus(); };
//           }
//         };

//         socketRef.current.on('new-message', handleNewMessage);
//         return () => {
//           socketRef.current.emit('leave-thread', selectedThread.id);
//           socketRef.current.off('new-message', handleNewMessage);
//         };
//       }
//     }, [selectedThread?.id, notificationsEnabled]);
    
//     const handleMessageChange = (e) => {
//         setNewMessage(e.target.value);
//     };
    
//     const sendMessage = async () => {
//       if (!newMessage.trim()) return;
//       const messageText = newMessage.trim();
//       setNewMessage('');
      
//       try {
//         await threadsAPI.sendMessage(selectedThread.id, { user: currentUser.username, userId: currentUser.id, message: messageText });
//         // Auto-scroll will happen via useEffect when new message arrives
//         shouldAutoScrollRef.current = true;
//       } catch (error) {
//         setNewMessage(messageText);
//         alert('Error sending message');
//       }
//     };

//     const handleKeyPress = (e) => {
//       if (e.key === 'Enter' && !e.shiftKey) {
//         e.preventDefault();
//         sendMessage();
//       }
//     };

//     const handleRequest = async (userId, approve) => {
//       try {
//         await threadsAPI.handleRequest(selectedThread.id, userId, approve, currentUser.id);
//         loadThreads();
//       } catch (error) { alert('Error handling request'); }
//     };

//     const sendAlert = async () => {
//       const messageText = cleanBidi(alertMessage);
//       if (!messageText) return alert('Please enter an alert message');
//       try {
//         await threadsAPI.sendMessage(selectedThread.id, { user: 'Alert', userId: currentUser.id, message: messageText });
//         setAlertMessage('');
//         setShowAlertModal(false);
//       } catch (error) { alert('Error sending alert.'); }
//     };

//     const getUsernameById = (userId) => (userId === currentUser?.id) ? currentUser.username : `User_${userId.slice(-4)}`;

//     const messagesWithDividers = useMemo(() => {
//         if (!selectedThread?.chat) return [];
//         const items = [];
//         let lastDate = null;
//         selectedThread.chat.forEach(msg => {
//             const msgDate = new Date(msg.timestamp).toDateString();
//             if (msgDate !== lastDate) {
//                 items.push({ id: `divider-${msgDate}`, type: 'divider', date: msg.timestamp });
//                 lastDate = msgDate;
//             }
//             items.push({ ...msg, type: 'message' });
//         });
//         return items;
//     }, [selectedThread?.chat]);


//     return (
//       <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 z-40 flex flex-col">
//         <div className={`shadow-lg p-4 transition-colors duration-300 ${isDark ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'}`}>
//           <div className="flex items-center justify-between">
//             <button onClick={() => setSelectedThread(null)} className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">← Back</button>
//             <div className="text-center flex-1 mx-4">
//               <h2 className={`font-bold text-lg truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedThread.title}</h2>
//               <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}><Users className="w-3 h-3 inline mr-1" />{selectedThread.members.length} members • {getTimeRemaining(selectedThread.expiresAt)} left</p>
//             </div>
//             {(isMember || isCreator) ? (<button onClick={() => setShowAlertModal(true)} className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700" title="Send alert"><AlertTriangle className="w-4 h-4" />Alert</button>) : <div className="w-20"></div>}
//           </div>
//         </div>

//         {isCreator && selectedThread.pendingRequests.length > 0 && (
//           <div className="bg-orange-100 dark:bg-orange-900 border-b border-orange-300 p-4">
//             <h3 className="font-medium text-orange-900 dark:text-orange-200 mb-2">Join Requests ({selectedThread.pendingRequests.length})</h3>
//             <div className="space-y-2">
//               {selectedThread.pendingRequests.map(userId => (
//                 <div key={userId} className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
//                   <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{getUsernameById(userId)}</span>
//                   <div className="flex gap-2">
//                     <button onClick={() => handleRequest(userId, false)} className="p-1 text-red-600 hover:bg-red-100 rounded" title="Reject"><X className="w-4 h-4" /></button>
//                     <button onClick={() => handleRequest(userId, true)} className="p-1 text-green-600 hover:bg-green-100 rounded" title="Approve"><Check className="w-4 h-4" /></button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         <div ref={chatContainerRef} className={`flex-1 overflow-y-auto p-4 space-y-3 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
//           {messagesWithDividers.length > 0 ? (
//             messagesWithDividers.map(item => {
//               if (item.type === 'divider') return <div key={item.id} className="flex justify-center my-4"><span className={`px-3 py-1 text-xs rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-white shadow-md'}`}>{formatDateDivider(item.date)}</span></div>;
//               return <ChatMessage key={item.id} msg={item} currentUser={currentUser} isDark={isDark} />;
//             })
//           ) : <div className={`text-center mt-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Start the conversation!</div>}
//           <div ref={chatEndRef} />
//         </div>

//         {(isMember || isAdmin) && (
//           <div className={`p-4 shadow-2xl ${isDark ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t'}`}>
//             <div className="flex gap-2 items-end">
//               <TextareaAutosize
//                 minRows={1}
//                 maxRows={5}
//                 placeholder={isAdmin && !isMember ? "Admin view only" : "Type a message..."}
//                 value={newMessage}
//                 onChange={handleMessageChange}
//                 onKeyDown={handleKeyPress}
//                 className={`flex-1 p-3 border rounded-xl resize-none ${isDark ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-gray-100 text-gray-900 border-gray-300 placeholder-gray-500'}`}
//                 autoFocus
//                 disabled={isAdmin && !isMember}
//                 dir="ltr"
//                 style={{ direction: 'ltr', textAlign: 'left' }}
//               />
//               <button onClick={sendMessage} disabled={!newMessage.trim() || (isAdmin && !isMember)} className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"><Send className="w-5 h-5" /></button>
//             </div>
//           </div>
//         )}

//         {showAlertModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className={`rounded-lg p-6 w-full max-w-md ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
//               <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><span className="text-2xl">🚨</span><h3 className="text-xl font-bold">Send Alert</h3></div><button onClick={() => setShowAlertModal(false)} className="text-gray-500 hover:text-red-500"><X /></button></div>
//               <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Choose a preset or type a custom message. This sends a persistent notification.</p>
//               <div className="space-y-2 mb-4">
//                 {ALERT_PRESETS.map(phrase => (<button key={phrase} type="button" onClick={() => setAlertMessage(phrase)} className={`w-full text-left px-4 py-3 border rounded-lg text-sm ${alertMessage === phrase ? 'bg-red-600 text-white' : isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>{phrase}</button>))}
//               </div>
//               <div className="mb-4">
//                 <label className="block text-xs font-semibold text-gray-500 mb-1">Or type a custom alert</label>
//                 <textarea 
//                   ref={alertInputRef} 
//                   placeholder="Your alert message..." 
//                   value={alertMessage} 
//                   onChange={(e) => setAlertMessage(e.target.value)} 
//                   className={`w-full p-3 border rounded-lg resize-none ${isDark ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'}`} 
//                   rows={3} 
//                   maxLength={200}
//                   dir="ltr"
//                   style={{ direction: 'ltr', textAlign: 'left' }}
//                 />
//                 {alertMessage && <div className="text-xs text-gray-500 mt-1">{alertMessage.length}/200</div>}
//               </div>
//               <div className="flex gap-3">
//                 <button onClick={() => setShowAlertModal(false)} className={`flex-1 px-4 py-2 rounded-lg ${isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-100 hover:bg-gray-200'}`}>Cancel</button>
//                 <button onClick={sendAlert} disabled={!alertMessage.trim()} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"><span className="text-lg">🚨</span>Send Alert</button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };
  
//   if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
//   if (showLoginForm) return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />;
//   if (showAdminDashboard) return <AdminDashboard />;
//   if (showGossips) return <GossipsPage currentUser={currentUser} socketRef={socketRef} onBack={() => setShowGossips(false)} />;

//   if (isMobile) {
//     if (selectedThread) return <ChatView />;
//     return <MobileRouter currentUser={currentUser} threads={getFilteredAndSortedThreads()} categories={categories} sortOptions={sortOptions} filterCategory={filterCategory} onCategoryChange={setFilterCategory} sortBy={sortBy} onSortChange={setSortBy} getTimeRemaining={getTimeRemaining} onThreadClick={setSelectedThread} onActionClick={async(thread) => { const { creatorId, members, pendingRequests } = thread; if (creatorId === currentUser.id && pendingRequests.length > 0) { setSelectedThread(thread); } else if (members.includes(currentUser.id)) { setSelectedThread(thread); } else if (!pendingRequests.includes(currentUser.id)) { try { await threadsAPI.requestJoin(thread.id, currentUser.id); loadThreads(); } catch (error) { alert('Error sending join request'); }}}} onCreateThread={async(formData)=>{ const allTags = [formData.category, ...formData.tags.split(',').map(t=>t.trim()).filter(Boolean)]; const threadData = { ...formData, tags: allTags, creator: currentUser.username, creatorId: currentUser.id, expiresAt: new Date(Date.now() + parseInt(formData.duration) * 3600000).toISOString() }; try { await threadsAPI.create(threadData); loadThreads(); } catch (error) { alert('Error creating thread'); }}} onLogout={()=>{ setCurrentUser(null); setShowLoginForm(true); localStorage.removeItem('currentUser');}} socketRef={socketRef} onShowGossips={()=>setShowGossips(true)} />;
//   }

//   return (
//     <div className={`min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-pink-50'}`}>
//       <header className={`shadow-lg border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-lg'}`}>
//         <div className="max-w-6xl mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600"><img src="/logo.jpg" alt="Logo" className="w-6 h-6 rounded-lg"/></div>
//               <div><h1 className={`text-2xl font-bold ${isDark ? 'text-white' : ''}`}>Prastha</h1><p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Connect • Chat • Expire</p></div>
//             </div>
//             <div className="flex items-center gap-3">
//               <span className={`text-sm ${isDark ? 'text-gray-300' : ''}`}>Hi, <span className="font-semibold">{currentUser.username}</span>!</span>
//               <button onClick={toggleTheme} className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100'}`} title="Toggle Theme">{isDark ? <Sun /> : <Moon />}</button>
//               <button onClick={() => setShowGossips(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white"><MessageSquare />Gossips</button>
//               {!notificationsEnabled && Notification.permission !== 'denied' && (
//                 <button onClick={async () => { const p = await Notification.requestPermission(); if(p === 'granted') setNotificationsEnabled(true); }} className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-lg animate-pulse">🔔 Enable Alerts</button>
//               )}
//               {notificationsEnabled && <span className="text-xs text-green-600 flex items-center gap-1">✅ Alerts On</span>}
//               {currentUser.isAdmin && <button onClick={() => setShowAdminDashboard(true)} className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg"><Shield className="w-4 h-4"/>Admin</button>}
//               <button onClick={() => { if(window.confirm('Logout?')) { setCurrentUser(null); setShowLoginForm(true); localStorage.removeItem('currentUser'); }}} className="text-gray-500 hover:text-red-600 p-2"><LogOut /></button>
//             </div>
//           </div>
//         </div>
//       </header>
      
//       <div className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-purple-900' : 'bg-gradient-to-br from-blue-50 to-pink-50'} border-b ${isDark ? 'border-gray-700' : ''}`}>
//         <div className="max-w-6xl mx-auto px-4 py-8">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-8">
//             <div className="flex-1 animate-slide-in">
//               <h2 className={`text-4xl font-bold mb-3 ${isDark ? 'text-white' : ''}`}>Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{currentUser.username}</span>! 👋</h2>
//               <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Discover temporary event threads.</p>
//               <div className="grid grid-cols-3 gap-4 mb-6">
//                 <div className={`${isDark?'bg-gray-800/50':'bg-white/80'} backdrop-blur-sm rounded-xl p-4 border ${isDark?'border-gray-700':''}`}><div className={`text-2xl font-bold ${isDark?'text-blue-400':'text-blue-600'}`}>{threads.length}</div><div className={`text-sm ${isDark?'text-gray-400':'text-gray-600'}`}>Active</div></div>
//                 <div className={`${isDark?'bg-gray-800/50':'bg-white/80'} backdrop-blur-sm rounded-xl p-4 border ${isDark?'border-gray-700':''}`}><div className={`text-2xl font-bold ${isDark?'text-green-400':'text-green-600'}`}>{threads.filter(t => t.members.includes(currentUser.id)).length}</div><div className={`text-sm ${isDark?'text-gray-400':'text-gray-600'}`}>Joined</div></div>
//                 <div className={`${isDark?'bg-gray-800/50':'bg-white/80'} backdrop-blur-sm rounded-xl p-4 border ${isDark?'border-gray-700':''}`}><div className={`text-2xl font-bold ${isDark?'text-purple-400':'text-purple-600'}`}>{threads.filter(t => t.creatorId === currentUser.id).length}</div><div className={`text-sm ${isDark?'text-gray-400':'text-gray-600'}`}>Created</div></div>
//               </div>
//             </div>
//             <div className="flex flex-col gap-3 animate-fade-in">
//               <button onClick={() => setShowCreateForm(true)} className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-2xl transform hover:scale-105"><Plus />Create Thread</button>
//               <button onClick={() => setShowGossips(true)} className="flex items-center gap-3 px-8 py-4 rounded-xl font-semibold shadow-xl transform hover:scale-105 bg-gradient-to-r from-purple-600 to-pink-600 text-white"><MessageSquare />Browse Gossips</button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <main className="max-w-6xl mx-auto px-4 py-8">
//         <div className="mb-8 space-y-6 animate-fade-in">
//           <div className={`rounded-2xl border shadow-xl ${isDark ? 'bg-gray-800/70 border-gray-700' : 'bg-white/90'}`}>
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4"><h3 className={`text-lg font-bold flex items-center gap-2 ${isDark?'text-white':''}`}><Hash />Filter by Category</h3><span className={`text-sm px-3 py-1 rounded-full ${isDark?'bg-gray-700':'bg-gray-100'}`}>{getFilteredAndSortedThreads().length} threads</span></div>
//               <div className="flex flex-wrap gap-3">
//                 {categories.map(cat => ( <button key={cat.id} onClick={() => setFilterCategory(cat.id)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transform hover:scale-105 ${filterCategory===cat.id ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl' : isDark ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-100 border'}`}>{cat.label}</button> ))}
//               </div>
//             </div>
//           </div>
//           <div className={`rounded-2xl border shadow-xl ${isDark ? 'bg-gray-800/70 border-gray-700' : 'bg-white/90'}`}>
//             <div className="p-6">
//               <h3 className={`text-lg font-bold flex items-center gap-2 mb-4 ${isDark?'text-white':''}`}><ArrowUpDown />Sort Threads</h3>
//               <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//                 {sortOptions.map(opt => ( <button key={opt.id} onClick={() => setSortBy(opt.id)} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transform hover:scale-105 ${sortBy===opt.id ? 'bg-gradient-to-br from-green-600 to-teal-600 text-white shadow-xl' : isDark ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-100 border'}`}>{opt.icon&&<opt.icon className="w-4"/>}{opt.label}</button> ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mb-6 flex items-center justify-between animate-fade-in">
//           <h2 className={`text-2xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : ''}`}><Sparkles className="text-yellow-500" />{categories.find(c=>c.id===filterCategory)?.label} Threads <span className={`text-lg px-3 py-1 rounded-full ${isDark?'bg-gray-800':'bg-gray-100'}`}>{getFilteredAndSortedThreads().length}</span></h2>
//         </div>
        
//         {getFilteredAndSortedThreads().length === 0 ? (
//           <div className={`text-center py-20 rounded-2xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80'} animate-fade-in`}>
//             <div className="max-w-md mx-auto">
//               <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center"><Calendar className={`w-12 h-12 ${isDark?'text-blue-400':'text-blue-600'}`} /></div>
//               <h3 className={`text-2xl font-bold mb-3 ${isDark?'text-white':''}`}>No Threads Yet</h3>
//               <p className={`text-lg mb-6 ${isDark?'text-gray-400':'text-gray-600'}`}>Be the first to create an event!</p>
//               <button onClick={() => setShowCreateForm(true)} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-2xl transform hover:scale-105"><Plus className="inline w-5 h-5"/> Create Thread</button>
//             </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {getFilteredAndSortedThreads().map(thread => {
//               const isCreator = thread.creatorId === currentUser.id;
//               const isMember = thread.members.includes(currentUser.id);
//               const hasPendingRequest = thread.pendingRequests.includes(currentUser.id);
//               const hasPendingRequests = isCreator && thread.pendingRequests.length > 0;
//               return (
//                 <div key={thread.id} className={`rounded-2xl border shadow-xl overflow-hidden animate-fade-in ${isDark ? 'bg-gray-800/70 border-gray-700' : 'bg-white/90'}`}>
//                   <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4"><h3 className="font-bold text-white text-xl">{thread.title}</h3><p className="text-blue-100 text-sm">{thread.description}</p></div>
//                   <div className="p-5">
//                     <div className="grid grid-cols-2 gap-3 mb-4 text-sm"><div className={`flex items-center gap-2 ${isDark?'text-gray-300':'text-gray-600'}`}><User className="w-4 text-blue-500"/>{thread.creator}</div><div className={`flex items-center gap-2 ${isDark?'text-gray-300':'text-gray-600'}`}><MapPin className="w-4 text-red-500"/>{thread.location}</div><div className={`flex items-center gap-2 ${isDark?'text-gray-300':'text-gray-600'}`}><Clock className="w-4 text-yellow-500"/>{getTimeRemaining(thread.expiresAt)}</div><div className={`flex items-center gap-2 ${isDark?'text-gray-300':'text-gray-600'}`}><Users className="w-4 text-green-500"/>{thread.members.length} members</div></div>
//                     {hasPendingRequests && <div className="mb-4 px-3 py-2 bg-orange-100 border rounded-lg flex items-center gap-2"><Bell className="w-4 text-orange-600"/><span className="text-sm text-orange-800 font-semibold">{thread.pendingRequests.length} pending</span></div>}
//                     <div className="flex flex-wrap gap-2 mb-4">
//                       {thread.tags.map(tag => ( <span key={tag} className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium ${isDark ? 'bg-blue-900/50 text-blue-300 border border-blue-700' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}><Hash className="w-3"/>{tag}</span> ))}
//                     </div>
//                     <div className="flex gap-2 flex-wrap">
//                       {isCreator && <button onClick={() => {setEditingThread(thread); setShowEditForm(true);}} className={`px-4 py-2.5 rounded-xl font-semibold border ${isDark?'bg-gray-700 text-blue-400 border-blue-700':'bg-white text-blue-600 border-blue-600'}`}>Edit Thread</button>}
//                       {isMember ? (<button onClick={() => setSelectedThread(thread)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl flex-1 font-semibold justify-center"><MessageCircle className="w-4"/>Chat ({thread.chat.length})</button>) : hasPendingRequest ? (<button className="px-4 py-2.5 bg-yellow-100 text-yellow-800 rounded-xl flex-1 cursor-not-allowed" disabled><Clock className="w-4 inline mr-2"/>Pending</button>) : (<button onClick={async () => { try { await threadsAPI.requestJoin(thread.id, currentUser.id); loadThreads(); } catch (e) { alert('Error sending request'); }}} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex-1 font-semibold justify-center"><Plus className="w-4"/>Request to Join</button>)}
//                       {hasPendingRequests && <button onClick={() => setSelectedThread(thread)} className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold">Review Requests</button>}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </main>
//       {showCreateForm && <CreateThreadForm />}
//       {showEditForm && <EditThreadForm />}
//       {selectedThread && <ChatView />}
//     </div>
//   );
// }

// export default App

//test
import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { Clock, Users, MapPin, MessageCircle, Plus, X, Check, Hash, Calendar, Send, LogOut, User, Shield, Trash2, Eye, MessageSquare, Moon, Sun, Bell, Sparkles, ArrowUpDown, TrendingUp, TrendingDown, Zap, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { authAPI, threadsAPI, adminAPI } from './services/api';
import LoginPage from './components/LoginPage';
import GossipsPage from './components/GossipsPage';
import MobileRouter from './components/mobile/MobileRouter';
import { io } from 'socket.io-client';
import { useTheme } from './context/ThemeContext';

const cleanBidi = (s = '') =>
  String(s)
    .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '')
    .normalize('NFC')
    .trim();

const ALERT_PRESETS = [
  'Urgent update: Please assemble in 10 minutes.',
  'Schedule change: Event starting immediately.',
  'Reminder: Check the event chat right away.',
  'Emergency: Contact the organizer ASAP.',
  'Weather alert: Move indoors now.'
];

const SOCKET_URL = import.meta.env.VITE_API_URL || '';

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDateDivider = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }
    return date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
};

const getTimeRemaining = (expiresAt) => {
  const diff = new Date(expiresAt) - new Date();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return 'Expiring soon';
};

const ChatMessage = React.memo(({ msg, currentUser, isDark }) => {
    const sanitizedMessage = cleanBidi(msg.message);
    const isAlert = msg.user === 'Alert';
    const isCurrentUser = msg.user === currentUser.username;
    const isSystemMessage = msg.user === 'System';
    
    const bubbleColor = isDark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 shadow-md';
    const myBubbleColor = isDark ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white shadow-lg';
    const alertBubbleColor = 'bg-gradient-to-r from-red-100 to-orange-100 border-2 border-orange-400 shadow-xl';

    if (isAlert) {
      return (
        <div className="flex justify-center my-2">
          <div className={`w-full max-w-lg px-5 py-3 rounded-xl ${alertBubbleColor}`}>
            <div className="flex items-center justify-center gap-2 mb-2 text-red-700 dark:text-red-500 font-bold">
              <span className="text-2xl animate-pulse" role="img" aria-label="alert">🚨</span>
              <span className="tracking-wide uppercase text-sm">Creator Alert</span>
              <span className="text-2xl animate-pulse" role="img" aria-label="alert">🚨</span>
            </div>
            <div
              className="text-base font-semibold text-center text-gray-900 dark:text-gray-800"
              dir="ltr"
              style={{ direction: 'ltr', unicodeBidi: 'plaintext' }}
            >
              {sanitizedMessage}
            </div>
            <div className="text-xs text-orange-700 opacity-80 mt-2 flex items-center justify-center gap-1">
              {formatTime(msg.timestamp)}
            </div>
          </div>
        </div>
      );
    }

    if (isSystemMessage) {
       return (
          <div className="flex justify-center my-2">
              <div className={`px-4 py-2 rounded-lg max-w-xs ${isDark ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-200 text-gray-600'} text-center text-sm`}>
                  {sanitizedMessage}
              </div>
          </div>
       );
    }

    return (
      <div
        className={`flex items-end ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
      >
        <div className="max-w-xs lg:max-w-md">
          <div className={`px-4 py-2.5 rounded-2xl ${isCurrentUser ? 'rounded-br-lg' : 'rounded-tl-lg'} ${
            isCurrentUser
              ? myBubbleColor
              : bubbleColor
          }`}>
            {!isCurrentUser && (
                <div className="text-xs font-bold mb-1 text-blue-400 dark:text-teal-400">
                    {msg.user}
                </div>
            )}
            <div
              className="text-sm"
              dir="ltr"
              style={{ direction: 'ltr', unicodeBidi: 'plaintext', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
            >
              {sanitizedMessage}
            </div>
            <div
              className={`text-xs opacity-80 mt-1.5 flex items-center justify-end gap-1`}
            >
              {formatTime(msg.timestamp)}
            </div>
          </div>
        </div>
      </div>
    );
});

function App() {
  const { isDark, toggleTheme } = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showGossips, setShowGossips] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingThread, setEditingThread] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const socketRef = useRef(null);
  
  const alertInputRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setShowLoginForm(false);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (currentUser && !showLoginForm && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            setNotificationsEnabled(true);
            new Notification('Prastha', {
              body: 'Notifications enabled! You\'ll be alerted for important messages.',
              icon: '/vite.svg'
            });
          }
        });
      }
    }
  }, [currentUser, showLoginForm]);

  const categories = [
    { id: 'all', label: '🌟 All', icon: Calendar },
    { id: 'sports', label: '⚽ Sports', icon: Users },
    { id: 'food', label: '🍕 Food & Drinks', icon: Users },
    { id: 'entertainment', label: '🎬 Entertainment', icon: Users },
    { id: 'tech', label: '💻 Tech & Coding', icon: Users },
    { id: 'study', label: '📚 Study Groups', icon: Users },
    { id: 'music', label: '🎵 Music', icon: Users },
    { id: 'fitness', label: '💪 Fitness', icon: Users },
    { id: 'gaming', label: '🎮 Gaming', icon: Users },
    { id: 'other', label: '✨ Other', icon: Users }
  ];

  const sortOptions = [
    { id: 'newest', label: 'Newest', icon: TrendingUp },
    { id: 'oldest', label: 'Oldest', icon: TrendingDown },
    { id: 'mostMembers', label: 'Most Members', icon: Users },
    { id: 'expiringSoon', label: 'Expiring Soon', icon: Zap },
    { id: 'mostActive', label: 'Most Active', icon: MessageCircle }
  ];

  useEffect(() => {
    if (currentUser && !showLoginForm) {
      socketRef.current = io(SOCKET_URL, { transports: ['websocket', 'polling'] });

      socketRef.current.on('connect', () => console.log('✅ Socket connected'));
      socketRef.current.on('refresh-threads', () => loadThreads());
      socketRef.current.on('disconnect', () => console.log('❌ Socket disconnected'));

      socketRef.current.on('new-thread-created', (data) => {
        if (notificationsEnabled && data.creatorId !== currentUser.id) {
          const notification = new Notification('🎉 New Event Thread!', {
            body: `${data.creator} created: "${data.title}"`,
            icon: '/vite.svg',
            tag: `thread-${data.threadId}`,
          });
          notification.onclick = () => { window.focus(); loadThreads(); notification.close(); };
        }
        loadThreads();
      });

      return () => { if (socketRef.current) socketRef.current.disconnect(); };
    }
  }, [currentUser, showLoginForm, notificationsEnabled]);

  useEffect(() => {
    if (currentUser && !showLoginForm) {
      loadThreads();
      const interval = setInterval(() => { if (!showCreateForm && !showEditForm) loadThreads(); }, 60000);
      return () => clearInterval(interval);
    }
  }, [currentUser, showLoginForm, showCreateForm, showEditForm]);

  useEffect(() => {
    if (currentUser?.isAdmin && showAdminDashboard) loadAdminDashboard();
  }, [currentUser, showAdminDashboard]);

  const loadThreads = async () => {
    try {
      const response = await threadsAPI.getAll();
      if (response.data.success) {
        setThreads(response.data.threads);
        if (selectedThread) {
          const updatedThread = response.data.threads.find(t => t.id === selectedThread.id);
          setSelectedThread(updatedThread || null);
        }
      }
    } catch (error) { console.error('Error loading threads:', error); }
  };

  const getFilteredAndSortedThreads = () => {
  if (!Array.isArray(threads)) return [];

  // Normalize the filter category
  const category = (filterCategory || 'all').toString().trim().toLowerCase();

  // Step 1: Filter threads
  let filtered = threads.filter(thread => {
    if (category === 'all') return true;

    const tags = (thread.tags || []).map(tag => (tag || '').toString().trim().toLowerCase());

    // Define category synonyms
    const categoryKeywords = {
      tech: ['tech', 'coding', 'programming', 'developer', 'software'],
      study: ['study', 'learning', 'education', 'school'],
      sports: ['sport', 'sports', 'fitness', 'workout', 'gym'],
      food: ['food', 'drink', 'coffee', 'restaurant'],
      entertainment: ['entertainment', 'movie', 'film', 'show', 'music'],
    };

    // Direct match
    if (tags.includes(category)) return true;

    // Keyword match (if category exists in map)
    if (categoryKeywords[category]) {
      return tags.some(tag =>
        categoryKeywords[category].some(keyword => tag.includes(keyword))
      );
    }

    // Partial text match
    return tags.some(tag => tag.includes(category));
  });

  // Step 2: Sort threads
  return [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'mostMembers':
        return (b.members?.length || 0) - (a.members?.length || 0);
      case 'expiringSoon':
        return new Date(a.expiresAt) - new Date(b.expiresAt);
      case 'mostActive':
        return (b.chat?.length || 0) - (a.chat?.length || 0);
      default:
        return 0;
    }
  });
};


  const loadAdminDashboard = async () => {
    try {
      const response = await adminAPI.getDashboard(currentUser.id);
      if (response.data.success) setAdminData(response.data.data);
    } catch (error) { console.error('Error loading admin dashboard:', error); }
  };

  const handleLogin = async (username, password, isAdmin) => {
    try {
      const response = await authAPI.login(username, password, isAdmin);
      if (response.data.success) {
        setCurrentUser(response.data.user);
        setShowLoginForm(false);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      } else { throw new Error(response.data.message || 'Login failed.'); }
    } catch (error) { throw new Error(error.response?.data?.message || 'Login failed.'); }
  };

  const handleRegister = async (username, password) => {
    try {
      const response = await authAPI.register(username, password);
      if (response.data.success) {
        setCurrentUser(response.data.user);
        setShowLoginForm(false);
        localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        if ('Notification' in window && Notification.permission === 'default') {
          setTimeout(() => {
            Notification.requestPermission().then(p => { if (p === 'granted') setNotificationsEnabled(true); });
          }, 1000);
        }
      } else { throw new Error(response.data.message || 'Registration failed.'); }
    } catch (error) { throw new Error(error.response?.data?.message || 'Registration failed.'); }
  };

  const AdminDashboard = () => {
    const handleDeleteThread = async (threadId) => {
      if (window.confirm('Are you sure?')) {
        try {
          await threadsAPI.delete(threadId, currentUser.id);
          loadAdminDashboard();
          loadThreads();
        } catch (error) {
          alert('Error deleting thread');
        }
      }
    };
    const handleViewThread = (thread) => {
      setSelectedThread({
        ...thread,
        id: thread.id || thread._id
      });
      setShowAdminDashboard(false);
    };
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="opacity-90">System Overview</p>
          </div>
          <button onClick={() => setShowAdminDashboard(false)} className="text-white hover:text-blue-200"><X /></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border"><h3 className="text-lg font-semibold mb-2">Total Threads</h3><p className="text-3xl font-bold text-blue-600">{adminData?.totalThreads ?? 0}</p></div>
            <div className="bg-white p-6 rounded-lg border"><h3 className="text-lg font-semibold mb-2">Active Users</h3><p className="text-3xl font-bold text-green-600">{adminData?.activeUsers ?? 0}</p></div>
            <div className="bg-white p-6 rounded-lg border"><h3 className="text-lg font-semibold mb-2">Total Users</h3><p className="text-3xl font-bold text-purple-600">{adminData?.totalUsers ?? 0}</p></div>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Active Threads</h2>
            {(adminData?.threads?.length === 0) ? <p>No active threads.</p> : (
              <div className="space-y-4">
                {adminData?.threads.map(thread => (
                  <div key={thread.id || thread._id} className="bg-white p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{thread.title}</h3>
                        <p className="text-sm text-gray-600">{thread.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                          <span>👤 {thread.creatorUsername}</span><span>📍 {thread.location}</span><span>⏰ {getTimeRemaining(thread.expiresAt)}</span><span>👥 {thread.members.length}</span><span>💬 {thread.chat.length}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleViewThread(thread)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="View"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteThread(thread.id || thread._id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {adminData?.users?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Users</h2>
              <div className="bg-white rounded-lg border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-sm font-medium">Username</th><th className="px-4 py-3 text-left text-sm font-medium">Joined</th><th className="px-4 py-3 text-left text-sm font-medium">Status</th></tr></thead>
                  <tbody className="divide-y">
                    {adminData.users.map(user => (
                      <tr key={user.id || user._id}><td className="px-4 py-3">{user.username}</td><td className="px-4 py-3 text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td><td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const CreateThreadForm = () => {
    const [formData, setFormData] = useState({ title: '', description: '', location: '', category: 'other', tags: '', duration: '2' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
      if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) return;
      setIsSubmitting(true);
      
      const allTags = [formData.category, ...formData.tags.split(',').map(t => t.trim()).filter(Boolean)];
      const threadData = { ...formData, tags: allTags, creator: currentUser.username, creatorId: currentUser.id, expiresAt: new Date(Date.now() + parseInt(formData.duration) * 3600000).toISOString() };

      try {
        await threadsAPI.create(threadData);
        setShowCreateForm(false);
        loadThreads();
      } catch (error) {
        alert('Error creating thread');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md my-8 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white dark:bg-gray-800 pb-2 z-10">
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Create Event Thread</h2>
            <button onClick={() => setShowCreateForm(false)} className={isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}><X/></button>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder="Event Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} dir="ltr" />
            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} rows={3} dir="ltr" />
            <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} dir="ltr" />
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
              {categories.filter(c=>c.id!=='all').map(cat=><option key={cat.id} value={cat.id}>{cat.label}</option>)}
            </select>
            <input type="text" placeholder="Additional Tags (comma-separated)" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`} dir="ltr" />
            <select value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
              <option value="1">1 hour</option><option value="2">2 hours</option><option value="4">4 hours</option><option value="8">8 hours</option>
            </select>
            <div className="flex gap-3 pt-2 sticky bottom-0 bg-white dark:bg-gray-800 pb-2">
              <button onClick={() => setShowCreateForm(false)} className={`flex-1 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>Cancel</button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{isSubmitting ? 'Creating...' : 'Create'}</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EditThreadForm = () => {
    const [formData, setFormData] = useState({ title: editingThread?.title || '', description: editingThread?.description || '', location: editingThread?.location || '', tags: editingThread?.tags?.join(', ') || '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = async () => {
      if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) return;
      setIsSubmitting(true);
      const updateData = { ...formData, tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean), userId: currentUser.id };
      try {
        await threadsAPI.update(editingThread.id, updateData);
        setShowEditForm(false);
        setEditingThread(null);
        loadThreads();
      } catch (error) {
        alert('Error updating thread');
      } finally {
        setIsSubmitting(false);
      }
    };
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`rounded-lg p-6 w-full max-w-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-4"><h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Edit Thread</h2><button onClick={() => {setShowEditForm(false); setEditingThread(null);}} className={isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}><X/></button></div>
          <div className="space-y-4">
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} dir="ltr" />
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} rows={3} dir="ltr" />
            <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} dir="ltr" />
            <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className={`w-full p-3 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`} dir="ltr" />
            <div className="flex gap-3"><button onClick={() => {setShowEditForm(false); setEditingThread(null);}} className={`flex-1 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>Cancel</button><button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{isSubmitting ? 'Updating...' : 'Update'}</button></div>
          </div>
        </div>
      </div>
    );
  };

  const ChatView = () => {
    if (!selectedThread) return null;

    const [newMessage, setNewMessage] = useState('');
    const isCreator = selectedThread.creatorId === currentUser.id;
    const isMember = selectedThread.members.includes(currentUser.id);
    const isAdmin = currentUser.isAdmin;
    
    const chatEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const isUserScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef(null);
    const shouldAutoScrollRef = useRef(true);

    const scrollToBottom = (smooth = false) => {
      const container = chatContainerRef.current;
      if (!container || isUserScrollingRef.current) return;

      requestAnimationFrame(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: smooth ? 'smooth' : 'auto',
        });
      });
    };

    useLayoutEffect(() => {
      if (selectedThread?.chat?.length) {
        scrollToBottom();
      }
    }, [selectedThread?.chat?.length]);

    const handleScroll = () => {
        isUserScrollingRef.current = true;
        
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        
        scrollTimeoutRef.current = setTimeout(() => {
            isUserScrollingRef.current = false;
        }, 1000);
    };

    useEffect(() => {
      if (socketRef.current && selectedThread) {
        socketRef.current.emit('join-thread', selectedThread.id);
        
        const handleNewMessage = (message) => {
          setSelectedThread(prev => {
            if (!prev || (message.threadId && prev.id !== message.threadId) || prev.chat.some(msg => msg.id === message.id)) {
              return prev;
            }
            return { ...prev, chat: [...prev.chat, message] };
          });

          if (message.user === 'Alert' && message.userId !== currentUser.id && Notification.permission === 'granted') {
            new Notification(`🚨 Alert from ${selectedThread.title}`, {
              body: `\u202A${cleanBidi(message.message)}`, icon: '/vite.svg', tag: `alert-${message.id}`, requireInteraction: true,
            }).onclick = () => { window.focus(); };
          }
        };

        socketRef.current.on('new-message', handleNewMessage);
        return () => {
          socketRef.current.emit('leave-thread', selectedThread.id);
          socketRef.current.off('new-message', handleNewMessage);
        };
      }
    }, [selectedThread?.id, notificationsEnabled]);
    
    const handleMessageChange = (e) => {
        setNewMessage(e.target.value);
    };
    
    const sendMessage = async () => {
      if (!newMessage.trim()) return;
      const messageText = newMessage.trim();
      setNewMessage('');
      
      try {
        await threadsAPI.sendMessage(selectedThread.id, { user: currentUser.username, userId: currentUser.id, message: messageText });
        shouldAutoScrollRef.current = true;
      } catch (error) {
        setNewMessage(messageText);
        alert('Error sending message');
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };

    const handleRequest = async (userId, approve) => {
      try {
        await threadsAPI.handleRequest(selectedThread.id, userId, approve, currentUser.id);
        loadThreads();
      } catch (error) { alert('Error handling request'); }
    };

    const sendAlert = async () => {
      const messageText = cleanBidi(alertMessage);
      if (!messageText) return alert('Please enter an alert message');
      try {
        await threadsAPI.sendMessage(selectedThread.id, { user: 'Alert', userId: currentUser.id, message: messageText });
        setAlertMessage('');
        setShowAlertModal(false);
      } catch (error) { alert('Error sending alert.'); }
    };

    const getUsernameById = (userId) => (userId === currentUser?.id) ? currentUser.username : `User_${userId.slice(-4)}`;

    const messagesWithDividers = useMemo(() => {
        if (!selectedThread?.chat) return [];
        const items = [];
        let lastDate = null;
        selectedThread.chat.forEach(msg => {
            const msgDate = new Date(msg.timestamp).toDateString();
            if (msgDate !== lastDate) {
                items.push({ id: `divider-${msgDate}`, type: 'divider', date: msg.timestamp });
                lastDate = msgDate;
            }
            items.push({ ...msg, type: 'message' });
        });
        return items;
    }, [selectedThread?.chat]);

    return (
      <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 z-40 flex flex-col">
        <div className={`shadow-lg p-4 transition-colors duration-300 ${isDark ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <button onClick={() => setSelectedThread(null)} className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">← Back</button>
            <div className="text-center flex-1 mx-4">
              <h2 className={`font-bold text-lg truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedThread.title}</h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}><Users className="w-3 h-3 inline mr-1" />{selectedThread.members.length} members • {getTimeRemaining(selectedThread.expiresAt)} left</p>
            </div>
            {(isMember || isCreator) ? (<button onClick={() => setShowAlertModal(true)} className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700" title="Send alert"><AlertTriangle className="w-4 h-4" />Alert</button>) : <div className="w-20"></div>}
          </div>
        </div>

        {isCreator && selectedThread.pendingRequests.length > 0 && (
          <div className="bg-orange-100 dark:bg-orange-900 border-b border-orange-300 p-4">
            <h3 className="font-medium text-orange-900 dark:text-orange-200 mb-2">Join Requests ({selectedThread.pendingRequests.length})</h3>
            <div className="space-y-2">
              {selectedThread.pendingRequests.map(userId => (
                <div key={userId} className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{getUsernameById(userId)}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleRequest(userId, false)} className="p-1 text-red-600 hover:bg-red-100 rounded" title="Reject"><X className="w-4 h-4" /></button>
                    <button onClick={() => handleRequest(userId, true)} className="p-1 text-green-600 hover:bg-green-100 rounded" title="Approve"><Check className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div ref={chatContainerRef} className={`flex-1 overflow-y-auto p-4 space-y-3 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
          {messagesWithDividers.length > 0 ? (
            messagesWithDividers.map(item => {
              if (item.type === 'divider') return <div key={item.id} className="flex justify-center my-4"><span className={`px-3 py-1 text-xs rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-white shadow-md'}`}>{formatDateDivider(item.date)}</span></div>;
              return <ChatMessage key={item.id} msg={item} currentUser={currentUser} isDark={isDark} />;
            })
          ) : <div className={`text-center mt-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Start the conversation!</div>}
          <div ref={chatEndRef} />
        </div>

        {(isMember || isAdmin) && (
          <div className={`p-4 shadow-2xl ${isDark ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t'}`}>
            <div className="flex gap-2 items-end">
              <TextareaAutosize
                minRows={1}
                maxRows={5}
                placeholder={isAdmin && !isMember ? "Admin view only" : "Type a message..."}
                value={newMessage}
                onChange={handleMessageChange}
                onKeyDown={handleKeyPress}
                className={`flex-1 p-3 border rounded-xl resize-none ${isDark ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-gray-100 text-gray-900 border-gray-300 placeholder-gray-500'}`}
                autoFocus
                disabled={isAdmin && !isMember}
                dir="ltr"
                style={{ direction: 'ltr', textAlign: 'left' }}
              />
              <button onClick={sendMessage} disabled={!newMessage.trim() || (isAdmin && !isMember)} className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"><Send className="w-5 h-5" /></button>
            </div>
          </div>
        )}

        {showAlertModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`rounded-lg p-6 w-full max-w-md ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><span className="text-2xl">🚨</span><h3 className="text-xl font-bold">Send Alert</h3></div><button onClick={() => setShowAlertModal(false)} className="text-gray-500 hover:text-red-500"><X /></button></div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Choose a preset or type a custom message. This sends a persistent notification.</p>
              <div className="space-y-2 mb-4">
                {ALERT_PRESETS.map(phrase => (<button key={phrase} type="button" onClick={() => setAlertMessage(phrase)} className={`w-full text-left px-4 py-3 border rounded-lg text-sm ${alertMessage === phrase ? 'bg-red-600 text-white' : isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>{phrase}</button>))}
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Or type a custom alert</label>
                <textarea 
                  ref={alertInputRef} 
                  placeholder="Your alert message..." 
                  value={alertMessage} 
                  onChange={(e) => setAlertMessage(e.target.value)} 
                  className={`w-full p-3 border rounded-lg resize-none ${isDark ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'}`} 
                  rows={3} 
                  maxLength={200}
                  dir="ltr"
                  style={{ direction: 'ltr', textAlign: 'left' }}
                />
                {alertMessage && <div className="text-xs text-gray-500 mt-1">{alertMessage.length}/200</div>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowAlertModal(false)} className={`flex-1 px-4 py-2 rounded-lg ${isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-100 hover:bg-gray-200'}`}>Cancel</button>
                <button onClick={sendAlert} disabled={!alertMessage.trim()} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"><span className="text-lg">🚨</span>Send Alert</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (showLoginForm) return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />;
  if (showAdminDashboard) return <AdminDashboard />;
  if (showGossips) return <GossipsPage currentUser={currentUser} socketRef={socketRef} onBack={() => setShowGossips(false)} />;

  if (isMobile) {
    if (selectedThread) return <ChatView />;
    return <MobileRouter currentUser={currentUser} threads={getFilteredAndSortedThreads()} categories={categories} sortOptions={sortOptions} filterCategory={filterCategory} onCategoryChange={setFilterCategory} sortBy={sortBy} onSortChange={setSortBy} getTimeRemaining={getTimeRemaining} onThreadClick={setSelectedThread} onActionClick={async(thread) => { const { creatorId, members, pendingRequests } = thread; if (creatorId === currentUser.id && pendingRequests.length > 0) { setSelectedThread(thread); } else if (members.includes(currentUser.id)) { setSelectedThread(thread); } else if (!pendingRequests.includes(currentUser.id)) { try { await threadsAPI.requestJoin(thread.id, currentUser.id); loadThreads(); } catch (error) { alert('Error sending join request'); }}}} onCreateThread={async(formData)=>{ const allTags = [formData.category, ...formData.tags.split(',').map(t=>t.trim()).filter(Boolean)]; const threadData = { ...formData, tags: allTags, creator: currentUser.username, creatorId: currentUser.id, expiresAt: new Date(Date.now() + parseInt(formData.duration) * 3600000).toISOString() }; try { await threadsAPI.create(threadData); loadThreads(); } catch (error) { alert('Error creating thread'); }}} onLogout={()=>{ setCurrentUser(null); setShowLoginForm(true); localStorage.removeItem('currentUser');}} socketRef={socketRef} onShowGossips={()=>setShowGossips(true)} />;
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-pink-50'}`}>
      <header className={`shadow-lg border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white/80 backdrop-blur-lg'}`}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600"><img src="/logo.jpg" alt="Logo" className="w-6 h-6 rounded-lg"/></div>
              <div><h1 className={`text-2xl font-bold ${isDark ? 'text-white' : ''}`}>Prastha</h1><p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Connect • Chat • Expire</p></div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm ${isDark ? 'text-gray-300' : ''}`}>Hi, <span className="font-semibold">{currentUser.username}</span>!</span>
              <button onClick={toggleTheme} className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100'}`} title="Toggle Theme">{isDark ? <Sun /> : <Moon />}</button>
              <button onClick={() => setShowGossips(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white"><MessageSquare />Gossips</button>
              {!notificationsEnabled && Notification.permission !== 'denied' && (
                <button onClick={async () => { const p = await Notification.requestPermission(); if(p === 'granted') setNotificationsEnabled(true); }} className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-lg animate-pulse">🔔 Enable Alerts</button>
              )}
              {notificationsEnabled && <span className="text-xs text-green-600 flex items-center gap-1">✅ Alerts On</span>}
              {currentUser.isAdmin && <button onClick={() => setShowAdminDashboard(true)} className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg"><Shield className="w-4 h-4"/>Admin</button>}
              <button onClick={() => { if(window.confirm('Logout?')) { setCurrentUser(null); setShowLoginForm(true); localStorage.removeItem('currentUser'); }}} className="text-gray-500 hover:text-red-600 p-2"><LogOut /></button>
            </div>
          </div>
        </div>
      </header>
      
      <div className={`${isDark ? 'bg-gradient-to-br from-gray-900 to-purple-900' : 'bg-gradient-to-br from-blue-50 to-pink-50'} border-b ${isDark ? 'border-gray-700' : ''}`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 animate-slide-in">
              <h2 className={`text-4xl font-bold mb-3 ${isDark ? 'text-white' : ''}`}>Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{currentUser.username}</span>! 👋</h2>
              <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Discover temporary event threads.</p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className={`${isDark?'bg-gray-800/50':'bg-white/80'} backdrop-blur-sm rounded-xl p-4 border ${isDark?'border-gray-700':''}`}><div className={`text-2xl font-bold ${isDark?'text-blue-400':'text-blue-600'}`}>{threads.length}</div><div className={`text-sm ${isDark?'text-gray-400':'text-gray-600'}`}>Active</div></div>
                <div className={`${isDark?'bg-gray-800/50':'bg-white/80'} backdrop-blur-sm rounded-xl p-4 border ${isDark?'border-gray-700':''}`}><div className={`text-2xl font-bold ${isDark?'text-green-400':'text-green-600'}`}>{threads.filter(t => t.members.includes(currentUser.id)).length}</div><div className={`text-sm ${isDark?'text-gray-400':'text-gray-600'}`}>Joined</div></div>
                <div className={`${isDark?'bg-gray-800/50':'bg-white/80'} backdrop-blur-sm rounded-xl p-4 border ${isDark?'border-gray-700':''}`}><div className={`text-2xl font-bold ${isDark?'text-purple-400':'text-purple-600'}`}>{threads.filter(t => t.creatorId === currentUser.id).length}</div><div className={`text-sm ${isDark?'text-gray-400':'text-gray-600'}`}>Created</div></div>
              </div>
            </div>
            <div className="flex flex-col gap-3 animate-fade-in">
              <button onClick={() => setShowCreateForm(true)} className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-2xl transform hover:scale-105"><Plus />Create Thread</button>
              <button onClick={() => setShowGossips(true)} className="flex items-center gap-3 px-8 py-4 rounded-xl font-semibold shadow-xl transform hover:scale-105 bg-gradient-to-r from-purple-600 to-pink-600 text-white"><MessageSquare />Browse Gossips</button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 space-y-6 animate-fade-in">
          <div className={`rounded-2xl border shadow-xl ${isDark ? 'bg-gray-800/70 border-gray-700' : 'bg-white/90'}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4"><h3 className={`text-lg font-bold flex items-center gap-2 ${isDark?'text-white':''}`}><Hash />Filter by Category</h3><span className={`text-sm px-3 py-1 rounded-full ${isDark?'bg-gray-700':'bg-gray-100'}`}>{getFilteredAndSortedThreads().length} threads</span></div>
              <div className="flex flex-wrap gap-3">
                {categories.map(cat => ( <button key={cat.id} onClick={() => setFilterCategory(cat.id)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transform hover:scale-105 ${filterCategory===cat.id ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl' : isDark ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-100 border'}`}>{cat.label}</button> ))}
              </div>
            </div>
          </div>
          <div className={`rounded-2xl border shadow-xl ${isDark ? 'bg-gray-800/70 border-gray-700' : 'bg-white/90'}`}>
            <div className="p-6">
              <h3 className={`text-lg font-bold flex items-center gap-2 mb-4 ${isDark?'text-white':''}`}><ArrowUpDown />Sort Threads</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {sortOptions.map(opt => ( <button key={opt.id} onClick={() => setSortBy(opt.id)} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transform hover:scale-105 ${sortBy===opt.id ? 'bg-gradient-to-br from-green-600 to-teal-600 text-white shadow-xl' : isDark ? 'bg-gray-700/50 border border-gray-600' : 'bg-gray-100 border'}`}>{opt.icon&&<opt.icon className="w-4"/>}{opt.label}</button> ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between animate-fade-in">
          <h2 className={`text-2xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : ''}`}><Sparkles className="text-yellow-500" />{categories.find(c=>c.id===filterCategory)?.label} Threads <span className={`text-lg px-3 py-1 rounded-full ${isDark?'bg-gray-800':'bg-gray-100'}`}>{getFilteredAndSortedThreads().length}</span></h2>
        </div>
        
        {getFilteredAndSortedThreads().length === 0 ? (
          <div className={`text-center py-20 rounded-2xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/80'} animate-fade-in`}>
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center"><Calendar className={`w-12 h-12 ${isDark?'text-blue-400':'text-blue-600'}`} /></div>
              <h3 className={`text-2xl font-bold mb-3 ${isDark?'text-white':''}`}>No Threads Yet</h3>
              <p className={`text-lg mb-6 ${isDark?'text-gray-400':'text-gray-600'}`}>Be the first to create an event!</p>
              <button onClick={() => setShowCreateForm(true)} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-2xl transform hover:scale-105"><Plus className="inline w-5 h-5"/> Create Thread</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getFilteredAndSortedThreads().map(thread => {
              const isCreator = thread.creatorId === currentUser.id;
              const isMember = thread.members.includes(currentUser.id);
              const hasPendingRequest = thread.pendingRequests.includes(currentUser.id);
              const hasPendingRequests = isCreator && thread.pendingRequests.length > 0;
              return (
                <div key={thread.id} className={`rounded-2xl border shadow-xl overflow-hidden animate-fade-in ${isDark ? 'bg-gray-800/70 border-gray-700' : 'bg-white/90'}`}>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4"><h3 className="font-bold text-white text-xl">{thread.title}</h3><p className="text-blue-100 text-sm">{thread.description}</p></div>
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm"><div className={`flex items-center gap-2 ${isDark?'text-gray-300':'text-gray-600'}`}><User className="w-4 text-blue-500"/>{thread.creator}</div><div className={`flex items-center gap-2 ${isDark?'text-gray-300':'text-gray-600'}`}><MapPin className="w-4 text-red-500"/>{thread.location}</div><div className={`flex items-center gap-2 ${isDark?'text-gray-300':'text-gray-600'}`}><Clock className="w-4 text-yellow-500"/>{getTimeRemaining(thread.expiresAt)}</div><div className={`flex items-center gap-2 ${isDark?'text-gray-300':'text-gray-600'}`}><Users className="w-4 text-green-500"/>{thread.members.length} members</div></div>
                    {hasPendingRequests && <div className="mb-4 px-3 py-2 bg-orange-100 border rounded-lg flex items-center gap-2"><Bell className="w-4 text-orange-600"/><span className="text-sm text-orange-800 font-semibold">{thread.pendingRequests.length} pending</span></div>}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {thread.tags.map(tag => ( <span key={tag} className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium ${isDark ? 'bg-blue-900/50 text-blue-300 border border-blue-700' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}><Hash className="w-3"/>{tag}</span> ))}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {isCreator && <button onClick={() => {setEditingThread(thread); setShowEditForm(true);}} className={`px-4 py-2.5 rounded-xl font-semibold border ${isDark?'bg-gray-700 text-blue-400 border-blue-700':'bg-white text-blue-600 border-blue-600'}`}>Edit Thread</button>}
                      {isMember ? (<button onClick={() => setSelectedThread(thread)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl flex-1 font-semibold justify-center"><MessageCircle className="w-4"/>Chat ({thread.chat.length})</button>) : hasPendingRequest ? (<button className="px-4 py-2.5 bg-yellow-100 text-yellow-800 rounded-xl flex-1 cursor-not-allowed" disabled><Clock className="w-4 inline mr-2"/>Pending</button>) : (<button onClick={async () => { try { await threadsAPI.requestJoin(thread.id, currentUser.id); loadThreads(); } catch (e) { alert('Error sending request'); }}} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex-1 font-semibold justify-center"><Plus className="w-4"/>Request to Join</button>)}
                      {hasPendingRequests && <button onClick={() => setSelectedThread(thread)} className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold">Review Requests</button>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      {showCreateForm && <CreateThreadForm />}
      {showEditForm && <EditThreadForm />}
      {selectedThread && <ChatView />}
    </div>
  );
}

export default App;