
// // import React, { useState, useEffect, useRef } from 'react';
// // import { Clock, Users, MapPin, MessageCircle, Plus, X, Check, Hash, Calendar, Send, LogOut, User, Shield, Trash2, Eye } from 'lucide-react';
// // import { authAPI, threadsAPI, adminAPI } from './services/api';

// // // Helper functions
// // const formatTime = (dateString) => {
// //   return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // };

// // const getTimeRemaining = (expiresAt) => {
// //   const diff = new Date(expiresAt) - new Date();
// //   const hours = Math.floor(diff / (1000 * 60 * 60));
// //   const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
// //   if (hours > 0) return `${hours}h ${minutes}m`;
// //   if (minutes > 0) return `${minutes}m`;
// //   return 'Expiring soon';
// // };

// // function App() {
// //   const [currentUser, setCurrentUser] = useState(null);
// //   const [threads, setThreads] = useState([]);
// //   const [selectedThread, setSelectedThread] = useState(null);
// //   const [showCreateForm, setShowCreateForm] = useState(false);
// //   const [showLoginForm, setShowLoginForm] = useState(true);
// //   const [showAdminDashboard, setShowAdminDashboard] = useState(false);
// //   const [newMessage, setNewMessage] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [adminData, setAdminData] = useState(null);
// //   const [showEditForm, setShowEditForm] = useState(false);
// //   const [editingThread, setEditingThread] = useState(null);
// //   const chatEndRef = useRef(null);

// //   // Auto-scroll chat
// //   useEffect(() => {
// //     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //   }, [selectedThread?.chat]);

// //   // Load threads periodically
// //   useEffect(() => {
// //     if (currentUser && !showLoginForm) {
// //       loadThreads();
      
// //       const interval = setInterval(() => {
// //         if (!showCreateForm && !showEditForm) {
// //           loadThreads();
// //         }
// //       }, 30000);
      
// //       return () => clearInterval(interval);
// //     }
// //   }, [currentUser, showLoginForm, showCreateForm, showEditForm]);

// //   // Load admin dashboard
// //   useEffect(() => {
// //     if (currentUser?.isAdmin && showAdminDashboard) {
// //       loadAdminDashboard();
// //     }
// //   }, [currentUser, showAdminDashboard]);

// //   const loadThreads = async () => {
// //     try {
// //       const response = await threadsAPI.getAll();
// //       if (response.data.success) {
// //         setThreads(response.data.threads);
// //         if (selectedThread) {
// //           const updatedThread = response.data.threads.find(t => t.id === selectedThread.id);
// //           setSelectedThread(updatedThread || null);
// //         }
// //       }
// //     } catch (error) {
// //       console.error('Error loading threads:', error);
// //     }
// //   };

// //   const loadAdminDashboard = async () => {
// //     try {
// //       const response = await adminAPI.getDashboard(currentUser.id);
// //       if (response.data.success) {
// //         setAdminData(response.data.data);
// //       }
// //     } catch (error) {
// //       console.error('Error loading admin dashboard:', error);
// //     }
// //   };

// //   // Login Form Component
// //   const LoginForm = () => {
// //     const [username, setUsername] = useState('');
// //     const [password, setPassword] = useState('');
// //     const [isAdminLogin, setIsAdminLogin] = useState(false);
// //     const [loginLoading, setLoginLoading] = useState(false);
// //     const [error, setError] = useState('');

// //     const handleLogin = async () => {
// //       if (!username.trim() || (isAdminLogin && !password.trim())) {
// //         setError('Please fill in all fields');
// //         return;
// //       }
// //       setLoginLoading(true);
// //       setError('');
// //       try {
// //         const response = await authAPI.login(username, password, isAdminLogin);
// //         if (response.data.success) {
// //           setCurrentUser(response.data.user);
// //           setShowLoginForm(false);
// //         } else {
// //           setError(response.data.message);
// //         }
// //       } catch (error) {
// //         setError(error.response?.data?.message || 'Login failed. Please try again.');
// //       }
// //       setLoginLoading(false);
// //     };

// //     return (
// //       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
// //         <div className="bg-white rounded-lg p-6 w-full max-w-md">
// //           <h2 className="text-2xl font-bold text-gray-900 mb-4">
// //             {isAdminLogin ? 'Admin Login' : 'Welcome to EventThreads'}
// //           </h2>
// //           <p className="text-gray-600 mb-4">
// //             {isAdminLogin ? 'Access admin dashboard' : 'Connect with others through temporary interest-based events'}
// //           </p>
// //           {error && (
// //             <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>
// //           )}
// //           <div>
// //             <input
// //               type="text"
// //               placeholder={isAdminLogin ? "Admin username" : "Enter your username"}
// //               value={username}
// //               onChange={(e) => setUsername(e.target.value)}
// //               onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
// //               className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //             />
// //             {isAdminLogin && (
// //               <input
// //                 type="password"
// //                 placeholder="Admin password"
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //                 onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
// //                 className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //             )}
// //             <button
// //               onClick={handleLogin}
// //               disabled={loginLoading}
// //               className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors mb-3 disabled:opacity-50"
// //             >
// //               {loginLoading ? 'Logging in...' : (isAdminLogin ? 'Admin Login' : 'Join EventThreads')}
// //             </button>
// //             <button
// //               onClick={() => {
// //                 setIsAdminLogin(!isAdminLogin);
// //                 setUsername('');
// //                 setPassword('');
// //                 setError('');
// //               }}
// //               className="w-full text-sm text-blue-600 hover:text-blue-800"
// //             >
// //               {isAdminLogin ? '← Back to regular login' : 'Admin Login →'}
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   // Admin Dashboard Component
// //   const AdminDashboard = () => {
// //     const handleDeleteThread = async (threadId) => {
// //       if (window.confirm('Are you sure you want to delete this thread?')) {
// //         try {
// //           const result = await threadsAPI.delete(threadId, currentUser.id);
// //           if (result.data.success) {
// //             loadAdminDashboard();
// //             loadThreads();
// //           }
// //         } catch (error) {
// //           alert('Error deleting thread');
// //         }
// //       }
// //     };

// //     const handleViewThread = (thread) => {
// //       const formattedThread = {
// //         ...thread,
// //         members: thread.members || [],
// //         pendingRequests: thread.pendingRequests || [],
// //         chat: thread.chat || [],
// //         tags: thread.tags || []
// //       };
// //       setSelectedThread(formattedThread);
// //       setShowAdminDashboard(false);
// //     };

// //     return (
// //       <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
// //         <div className="bg-blue-600 text-white p-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h1 className="text-2xl font-bold">Admin Dashboard</h1>
// //               <p className="opacity-90">Monitor all threads and users</p>
// //             </div>
// //             <button onClick={() => setShowAdminDashboard(false)} className="text-white hover:text-blue-200">
// //               <X className="w-6 h-6" />
// //             </button>
// //           </div>
// //         </div>
// //         <div className="p-6">
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
// //             <div className="bg-white p-6 rounded-lg border border-gray-200">
// //               <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Threads</h3>
// //               <p className="text-3xl font-bold text-blue-600">{adminData?.totalThreads || 0}</p>
// //             </div>
// //             <div className="bg-white p-6 rounded-lg border border-gray-200">
// //               <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Users</h3>
// //               <p className="text-3xl font-bold text-green-600">{adminData?.activeUsers || 0}</p>
// //             </div>
// //             <div className="bg-white p-6 rounded-lg border border-gray-200">
// //               <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
// //               <p className="text-3xl font-bold text-purple-600">{adminData?.totalUsers || 0}</p>
// //             </div>
// //           </div>
// //           <div className="mb-8">
// //             <h2 className="text-xl font-bold text-gray-900 mb-4">Active Threads</h2>
// //             {!adminData?.threads || adminData.threads.length === 0 ? (
// //               <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
// //                 <p className="text-gray-500">No active threads</p>
// //               </div>
// //             ) : (
// //               <div className="space-y-4">
// //                 {adminData.threads.map(thread => (
// //                   <div key={thread.id} className="bg-white p-4 rounded-lg border border-gray-200">
// //                     <div className="flex justify-between items-start mb-3">
// //                       <div className="flex-1">
// //                         <h3 className="font-semibold text-gray-900">{thread.title}</h3>
// //                         <p className="text-sm text-gray-600 mb-2">{thread.description}</p>
// //                         <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
// //                           <span>👤 {thread.creator}</span>
// //                           <span>📍 {thread.location}</span>
// //                           <span>⏰ {getTimeRemaining(thread.expiresAt)}</span>
// //                           <span>👥 {thread.members?.length || 0} members</span>
// //                           <span>💬 {thread.chat?.length || 0} messages</span>
// //                         </div>
// //                       </div>
// //                       <div className="flex gap-2">
// //                         <button
// //                           onClick={() => handleViewThread(thread)}
// //                           className="p-2 text-blue-600 hover:bg-blue-50 rounded"
// //                           title="View Thread"
// //                         >
// //                           <Eye className="w-4 h-4" />
// //                         </button>
// //                         <button
// //                           onClick={() => handleDeleteThread(thread.id)}
// //                           className="p-2 text-red-600 hover:bg-red-50 rounded"
// //                           title="Delete Thread"
// //                         >
// //                           <Trash2 className="w-4 h-4" />
// //                         </button>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   // Create Thread Form Component
// //   const CreateThreadForm = () => {
// //     const [formData, setFormData] = useState({
// //       title: '',
// //       description: '',
// //       location: '',
// //       tags: '',
// //       duration: '2'
// //     });

// //     const handleSubmit = async () => {
// //       if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) return;
// //       setLoading(true);
// //       const threadData = {
// //         title: formData.title,
// //         description: formData.description,
// //         creator: currentUser.username,
// //         creatorId: currentUser.id,
// //         location: formData.location,
// //         tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
// //         expiresAt: new Date(Date.now() + parseInt(formData.duration) * 60 * 60 * 1000).toISOString()
// //       };
// //       try {
// //         const result = await threadsAPI.create(threadData);
// //         if (result.data.success) {
// //           setShowCreateForm(false);
// //           setFormData({ title: '', description: '', location: '', tags: '', duration: '2' });
// //           loadThreads();
// //         }
// //       } catch (error) {
// //         alert('Error creating thread');
// //       }
// //       setLoading(false);
// //     };

// //     return (
// //       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
// //         <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
// //           <div className="flex justify-between items-center mb-4">
// //             <h2 className="text-xl font-bold text-gray-900">Create Event Thread</h2>
// //             <button onClick={() => setShowCreateForm(false)} className="text-gray-500 hover:text-gray-700">
// //               <X className="w-5 h-5" />
// //             </button>
// //           </div>
// //           <div>
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
// //               <input
// //                 type="text"
// //                 placeholder="e.g., Coffee & Code meetup"
// //                 value={formData.title}
// //                 onChange={(e) => setFormData({...formData, title: e.target.value})}
// //                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //             </div>
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
// //               <textarea
// //                 placeholder="What's this event about?"
// //                 value={formData.description}
// //                 onChange={(e) => setFormData({...formData, description: e.target.value})}
// //                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 rows={3}
// //               />
// //             </div>
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
// //               <input
// //                 type="text"
// //                 placeholder="e.g., Starbucks Downtown"
// //                 value={formData.location}
// //                 onChange={(e) => setFormData({...formData, location: e.target.value})}
// //                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //             </div>
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
// //               <input
// //                 type="text"
// //                 placeholder="coffee, coding, social (comma separated)"
// //                 value={formData.tags}
// //                 onChange={(e) => setFormData({...formData, tags: e.target.value})}
// //                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //             </div>
// //             <div className="mb-6">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
// //               <select
// //                 value={formData.duration}
// //                 onChange={(e) => setFormData({...formData, duration: e.target.value})}
// //                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               >
// //                 <option value="1">1 hour</option>
// //                 <option value="2">2 hours</option>
// //                 <option value="4">4 hours</option>
// //                 <option value="8">8 hours</option>
// //               </select>
// //             </div>
// //             <div className="flex gap-3">
// //               <button
// //                 onClick={() => setShowCreateForm(false)}
// //                 className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleSubmit}
// //                 disabled={loading}
// //                 className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
// //               >
// //                 {loading ? 'Creating...' : 'Create Thread'}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   // Edit Thread Form Component
// //   const EditThreadForm = () => {
// //     const [formData, setFormData] = useState({
// //       title: editingThread?.title || '',
// //       description: editingThread?.description || '',
// //       location: editingThread?.location || '',
// //       tags: editingThread?.tags?.join(', ') || ''
// //     });

// //     const handleSubmit = async () => {
// //       if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) return;
// //       setLoading(true);

// //       const updateData = {
// //         title: formData.title,
// //         description: formData.description,
// //         location: formData.location,
// //         tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
// //         userId: currentUser.id
// //       };

// //       try {
// //         const result = await threadsAPI.update(editingThread.id, updateData);
// //         if (result.data.success) {
// //           setShowEditForm(false);
// //           setEditingThread(null);
// //           loadThreads();
// //           alert('Thread updated successfully!');
// //         }
// //       } catch (error) {
// //         alert('Error updating thread');
// //       }
// //       setLoading(false);
// //     };

// //     return (
// //       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
// //         <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
// //           <div className="flex justify-between items-center mb-4">
// //             <h2 className="text-xl font-bold text-gray-900">Edit Thread</h2>
// //             <button onClick={() => {
// //               setShowEditForm(false);
// //               setEditingThread(null);
// //             }} className="text-gray-500 hover:text-gray-700">
// //               <X className="w-5 h-5" />
// //             </button>
// //           </div>
          
// //           <div>
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
// //               <input
// //                 type="text"
// //                 placeholder="e.g., Coffee & Code meetup"
// //                 value={formData.title}
// //                 onChange={(e) => setFormData({...formData, title: e.target.value})}
// //                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //             </div>
            
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
// //               <textarea
// //                 placeholder="What's this event about?"
// //                 value={formData.description}
// //                 onChange={(e) => setFormData({...formData, description: e.target.value})}
// //                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 rows={3}
// //               />
// //             </div>
            
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
// //               <input
// //                 type="text"
// //                 placeholder="e.g., Starbucks Downtown"
// //                 value={formData.location}
// //                 onChange={(e) => setFormData({...formData, location: e.target.value})}
// //                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //             </div>
            
// //             <div className="mb-6">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
// //               <input
// //                 type="text"
// //                 placeholder="coffee, coding, social (comma separated)"
// //                 value={formData.tags}
// //                 onChange={(e) => setFormData({...formData, tags: e.target.value})}
// //                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //             </div>
            
// //             <div className="flex gap-3">
// //               <button
// //                 onClick={() => {
// //                   setShowEditForm(false);
// //                   setEditingThread(null);
// //                 }}
// //                 className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleSubmit}
// //                 disabled={loading}
// //                 className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
// //               >
// //                 {loading ? 'Updating...' : 'Update Thread'}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   // Chat View Component
// //   const ChatView = () => {
// //     if (!selectedThread) return null;
// //     const isCreator = selectedThread.creatorId === currentUser.id;
// //     const isMember = selectedThread.members.includes(currentUser.id);

// //     const sendMessage = async () => {
// //       if (!newMessage.trim()) return;
// //       const messageData = {
// //         user: currentUser.username,
// //         userId: currentUser.id,
// //         message: newMessage.trim()
// //       };
// //       try {
// //         const result = await threadsAPI.sendMessage(selectedThread.id, messageData);
// //         if (result.data.success) {
// //           setNewMessage('');
// //           loadThreads();
// //         }
// //       } catch (error) {
// //         alert('Error sending message');
// //       }
// //     };

// //     const handleKeyPress = (e) => {
// //       if (e.key === 'Enter' && !e.shiftKey) {
// //         e.preventDefault();
// //         sendMessage();
// //       }
// //     };

// //     const handleRequest = async (userId, approve) => {
// //       try {
// //         const result = await threadsAPI.handleRequest(selectedThread.id, userId, approve, currentUser.id);
// //         if (result.data.success) {
// //           loadThreads();
// //         }
// //       } catch (error) {
// //         alert('Error handling request');
// //       }
// //     };

// //     const getUsernameById = (userId) => {
// //       if (userId === currentUser?.id) return currentUser.username;
// //       return `User_${userId.slice(-4)}`;
// //     };

// //     return (
// //       <div className="fixed inset-0 bg-white z-40 flex flex-col">
// //         <div className="bg-white border-b border-gray-200 p-4">
// //           <div className="flex items-center justify-between">
// //             <button onClick={() => setSelectedThread(null)} className="text-gray-600 hover:text-gray-800">
// //               ← Back
// //             </button>
// //             <div className="text-center flex-1">
// //               <h2 className="font-semibold text-gray-900">{selectedThread.title}</h2>
// //               <p className="text-sm text-gray-500">{selectedThread.members.length} members • {getTimeRemaining(selectedThread.expiresAt)} left</p>
// //             </div>
// //             <div className="w-6"></div>
// //           </div>
// //         </div>
// //         {isCreator && selectedThread.pendingRequests.length > 0 && (
// //           <div className="bg-orange-50 border-b border-orange-200 p-4">
// //             <h3 className="font-medium text-orange-900 mb-2">Join Requests ({selectedThread.pendingRequests.length})</h3>
// //             <div className="space-y-2">
// //               {selectedThread.pendingRequests.map(userId => (
// //                 <div key={userId} className="flex items-center justify-between bg-white p-2 rounded-lg">
// //                   <span className="text-sm font-medium">{getUsernameById(userId)}</span>
// //                   <div className="flex gap-2">
// //                     <button
// //                       onClick={() => handleRequest(userId, false)}
// //                       className="p-1 text-red-600 hover:bg-red-50 rounded"
// //                     >
// //                       <X className="w-4 h-4" />
// //                     </button>
// //                     <button
// //                       onClick={() => handleRequest(userId, true)}
// //                       className="p-1 text-green-600 hover:bg-green-50 rounded"
// //                     >
// //                       <Check className="w-4 h-4" />
// //                     </button>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         )}
// //         <div className="flex-1 overflow-y-auto p-4 space-y-3 chat-container">
// //           {selectedThread.chat.map(msg => (
// //             <div key={msg.id} className={`flex ${msg.user === currentUser.username ? 'justify-end' : 'justify-start'}`}>
// //               <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
// //                 msg.user === currentUser.username
// //                   ? 'bg-blue-600 text-white'
// //                   : msg.user === 'System'
// //                   ? 'bg-gray-100 text-gray-600 text-center text-sm'
// //                   : 'bg-gray-100 text-gray-900'
// //               }`}>
// //                 {msg.user !== currentUser.username && msg.user !== 'System' && (
// //                   <div className="text-xs font-medium mb-1 opacity-70">{msg.user}</div>
// //                 )}
// //                 <div className="text-sm">{msg.message}</div>
// //                 <div className="text-xs opacity-70 mt-1">{formatTime(msg.timestamp)}</div>
// //               </div>
// //             </div>
// //           ))}
// //           <div ref={chatEndRef} />
// //         </div>
// //         {isMember && (
// //           <div className="bg-white border-t border-gray-200 p-4">
// //             <div className="flex gap-2">
// //               <input
// //                 type="text"
// //                 placeholder="Type a message..."
// //                 value={newMessage}
// //                 onChange={(e) => setNewMessage(e.target.value)}
// //                 onKeyDown={handleKeyPress}
// //                 className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 autoFocus
// //               />
// //               <button
// //                 onClick={sendMessage}
// //                 disabled={!newMessage.trim()}
// //                 className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //               >
// //                 <Send className="w-5 h-5" />
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     );
// //   };

// //   // Main render
// //   if (showLoginForm) return <LoginForm />;
// //   if (showAdminDashboard) return <AdminDashboard />;

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <header className="bg-white shadow-sm border-b border-gray-200">
// //         <div className="max-w-4xl mx-auto px-4 py-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h1 className="text-2xl font-bold text-gray-900">EventThreads</h1>
// //               <p className="text-sm text-gray-600">Temporary interest-based connections</p>
// //             </div>
// //             <div className="flex items-center gap-3">
// //               <span className="text-sm text-gray-600">Hi, {currentUser.username}!</span>
// //               {currentUser.isAdmin && (
// //                 <button
// //                   onClick={() => setShowAdminDashboard(true)}
// //                   className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
// //                 >
// //                   <Shield className="w-4 h-4" />
// //                   Admin
// //                 </button>
// //               )}
// //               <button
// //                 onClick={() => {
// //                   setCurrentUser(null);
// //                   setShowLoginForm(true);
// //                 }}
// //                 className="text-gray-500 hover:text-gray-700"
// //               >
// //                 <LogOut className="w-5 h-5" />
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </header>
// //       <main className="max-w-4xl mx-auto px-4 py-6">
// //         <div className="mb-6">
// //           <button
// //             onClick={() => setShowCreateForm(true)}
// //             className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
// //           >
// //             <Plus className="w-5 h-5" />
// //             Create Event Thread
// //           </button>
// //         </div>
// //         <div className="mb-6">
// //           <h2 className="text-lg font-semibold text-gray-900 mb-4">
// //             Active Threads ({threads.length})
// //           </h2>
// //           {threads.length === 0 ? (
// //             <div className="text-center py-12">
// //               <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
// //               <h3 className="text-lg font-medium text-gray-900 mb-2">No active threads</h3>
// //               <p className="text-gray-600 mb-4">Be the first to create an event thread!</p>
// //               <button
// //                 onClick={() => setShowCreateForm(true)}
// //                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// //               >
// //                 Create Thread
// //               </button>
// //             </div>
// //           ) : (
// //             <div className="space-y-4">
// //               {threads.map(thread => {
// //                 const isCreator = thread.creatorId === currentUser.id;
// //                 const isMember = thread.members.includes(currentUser.id);
// //                 const hasPendingRequest = thread.pendingRequests.includes(currentUser.id);
// //                 const hasPendingRequests = isCreator && thread.pendingRequests.length > 0;
// //                 return (
// //                   <div key={thread.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
// //                     <div className="flex justify-between items-start mb-3">
// //                       <div className="flex-1">
// //                         <h3 className="font-semibold text-gray-900 mb-1">{thread.title}</h3>
// //                         <p className="text-gray-600 text-sm mb-2">{thread.description}</p>
// //                         <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
// //                           <div className="flex items-center gap-1">
// //                             <User className="w-4 h-4" />
// //                             <span>{thread.creator}</span>
// //                           </div>
// //                           <div className="flex items-center gap-1">
// //                             <MapPin className="w-4 h-4" />
// //                             <span>{thread.location}</span>
// //                           </div>
// //                           <div className="flex items-center gap-1">
// //                             <Clock className="w-4 h-4" />
// //                             <span>{getTimeRemaining(thread.expiresAt)}</span>
// //                           </div>
// //                         </div>
// //                         <div className="flex items-center gap-2 mb-3">
// //                           <Users className="w-4 h-4 text-gray-400" />
// //                           <span className="text-sm text-gray-600">{thread.members.length} members</span>
// //                           {hasPendingRequests && (
// //                             <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
// //                               {thread.pendingRequests.length} pending
// //                             </span>
// //                           )}
// //                         </div>
// //                         <div className="flex flex-wrap gap-1 mb-3">
// //                           {thread.tags.map(tag => (
// //                             <span key={tag} className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
// //                               <Hash className="w-3 h-3" />
// //                               {tag}
// //                             </span>
// //                           ))}
// //                         </div>
// //                       </div>
// //                     </div>
                    
// //                     <div className="flex gap-2">
// //                       {isCreator && (
// //                         <button
// //                           onClick={() => {
// //                             setEditingThread(thread);
// //                             setShowEditForm(true);
// //                           }}
// //                           className="px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
// //                         >
// //                           Edit
// //                         </button>
// //                       )}
// //                       {isMember ? (
// //                         <button
// //                           onClick={() => setSelectedThread(thread)}
// //                           className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-1"
// //                         >
// //                           <MessageCircle className="w-4 h-4" />
// //                           Chat ({thread.chat.length})
// //                         </button>
// //                       ) : hasPendingRequest ? (
// //                         <button className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg flex-1 cursor-not-allowed">
// //                           Request Pending...
// //                         </button>
// //                       ) : (
// //                         <button
// //                           onClick={async () => {
// //                             try {
// //                               await threadsAPI.requestJoin(thread.id, currentUser.id);
// //                               loadThreads();
// //                             } catch (error) {
// //                               alert('Error sending join request');
// //                             }
// //                           }}
// //                           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1"
// //                         >
// //                           <Plus className="w-4 h-4" />
// //                           Request to Join
// //                         </button>
// //                       )}
// //                       {hasPendingRequests && (
// //                         <button
// //                           onClick={() => setSelectedThread(thread)}
// //                           className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
// //                         >
// //                           Review Requests
// //                         </button>
// //                       )}
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           )}
// //         </div>
// //       </main>
// //       {showCreateForm && <CreateThreadForm />}
// //       {showEditForm && <EditThreadForm />}
// //       {selectedThread && <ChatView />}
// //     </div>
// //   );
// // }

// // export default App;

// //2
// // import React, { useState, useEffect, useRef } from 'react';
// // import { Clock, Users, MapPin, MessageCircle, Plus, X, Check, Hash, Calendar, Send, LogOut, User, Shield, Trash2, Eye } from 'lucide-react';
// // import { authAPI, threadsAPI, adminAPI } from './services/api';
// // import LoginPage from './components/LoginPage';

// // // Helper functions
// // const formatTime = (dateString) => {
// //   return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// // };

// // const getTimeRemaining = (expiresAt) => {
// //   const diff = new Date(expiresAt) - new Date();
// //   const hours = Math.floor(diff / (1000 * 60 * 60));
// //   const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
// //   if (hours > 0) return `${hours}h ${minutes}m`;
// //   if (minutes > 0) return `${minutes}m`;
// //   return 'Expiring soon';
// // };

// // function App() {
// //   const [currentUser, setCurrentUser] = useState(null);
// //   const [threads, setThreads] = useState([]);
// //   const [selectedThread, setSelectedThread] = useState(null);
// //   const [showCreateForm, setShowCreateForm] = useState(false);
// //   const [showLoginForm, setShowLoginForm] = useState(true);
// //   const [showAdminDashboard, setShowAdminDashboard] = useState(false);
// //   const [newMessage, setNewMessage] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [adminData, setAdminData] = useState(null);
// //   const [showEditForm, setShowEditForm] = useState(false);
// //   const [editingThread, setEditingThread] = useState(null);
// //   const chatEndRef = useRef(null);

// //   // Auto-scroll chat
// //   useEffect(() => {
// //     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //   }, [selectedThread?.chat]);

// //   // Load threads periodically
// //   useEffect(() => {
// //     if (currentUser && !showLoginForm) {
// //       loadThreads();
      
// //       const interval = setInterval(() => {
// //         if (!showCreateForm && !showEditForm) {
// //           loadThreads();
// //         }
// //       }, 30000);
      
// //       return () => clearInterval(interval);
// //     }
// //   }, [currentUser, showLoginForm, showCreateForm, showEditForm]);

// //   // Load admin dashboard
// //   useEffect(() => {
// //     if (currentUser?.isAdmin && showAdminDashboard) {
// //       loadAdminDashboard();
// //     }
// //   }, [currentUser, showAdminDashboard]);

// //   const loadThreads = async () => {
// //     try {
// //       const response = await threadsAPI.getAll();
// //       if (response.data.success) {
// //         setThreads(response.data.threads);
// //         if (selectedThread) {
// //           const updatedThread = response.data.threads.find(t => t.id === selectedThread.id);
// //           setSelectedThread(updatedThread || null);
// //         }
// //       }
// //     } catch (error) {
// //       console.error('Error loading threads:', error);
// //     }
// //   };

// //   const loadAdminDashboard = async () => {
// //     try {
// //       const response = await adminAPI.getDashboard(currentUser.id);
// //       if (response.data.success) {
// //         setAdminData(response.data.data);
// //       }
// //     } catch (error) {
// //       console.error('Error loading admin dashboard:', error);
// //     }
// //   };

// //   const handleLogin = async (username, password, isAdmin) => {
// //     try {
// //       const response = await authAPI.login(username, password, isAdmin);
// //       if (response.data.success) {
// //         setCurrentUser(response.data.user);
// //         setShowLoginForm(false);
// //       } else {
// //         throw new Error(response.data.message);
// //       }
// //     } catch (error) {
// //       throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
// //     }
// //   };

// //   // Admin Dashboard Component
// //   const AdminDashboard = () => {
// //     const handleDeleteThread = async (threadId) => {
// //       if (window.confirm('Are you sure you want to delete this thread?')) {
// //         try {
// //           const result = await threadsAPI.delete(threadId, currentUser.id);
// //           if (result.data.success) {
// //             loadAdminDashboard();
// //             loadThreads();
// //           }
// //         } catch (error) {
// //           alert('Error deleting thread');
// //         }
// //       }
// //     };

// //     const handleViewThread = (thread) => {
// //       const formattedThread = {
// //         ...thread,
// //         members: thread.members || [],
// //         pendingRequests: thread.pendingRequests || [],
// //         chat: thread.chat || [],
// //         tags: thread.tags || []
// //       };
// //       setSelectedThread(formattedThread);
// //       setShowAdminDashboard(false);
// //     };

// //     return (
// //       <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
// //         <div className="bg-blue-600 text-white p-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h1 className="text-2xl font-bold">Admin Dashboard</h1>
// //               <p className="opacity-90">Monitor all threads and users</p>
// //             </div>
// //             <button onClick={() => setShowAdminDashboard(false)} className="text-white hover:text-blue-200">
// //               <X className="w-6 h-6" />
// //             </button>
// //           </div>
// //         </div>
// //         <div className="p-6">
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
// //             <div className="bg-white p-6 rounded-lg border border-gray-200">
// //               <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Threads</h3>
// //               <p className="text-3xl font-bold text-blue-600">{adminData?.totalThreads || 0}</p>
// //             </div>
// //             <div className="bg-white p-6 rounded-lg border border-gray-200">
// //               <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Users</h3>
// //               <p className="text-3xl font-bold text-green-600">{adminData?.activeUsers || 0}</p>
// //             </div>
// //             <div className="bg-white p-6 rounded-lg border border-gray-200">
// //               <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
// //               <p className="text-3xl font-bold text-purple-600">{adminData?.totalUsers || 0}</p>
// //             </div>
// //           </div>
// //           <div className="mb-8">
// //             <h2 className="text-xl font-bold text-gray-900 mb-4">Active Threads</h2>
// //             {!adminData?.threads || adminData.threads.length === 0 ? (
// //               <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
// //                 <p className="text-gray-500">No active threads</p>
// //               </div>
// //             ) : (
// //               <div className="space-y-4">
// //                 {adminData.threads.map(thread => (
// //                   <div key={thread.id} className="bg-white p-4 rounded-lg border border-gray-200">
// //                     <div className="flex justify-between items-start mb-3">
// //                       <div className="flex-1">
// //                         <h3 className="font-semibold text-gray-900">{thread.title}</h3>
// //                         <p className="text-sm text-gray-600 mb-2">{thread.description}</p>
// //                         <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
// //                           <span>👤 {thread.creator}</span>
// //                           <span>📍 {thread.location}</span>
// //                           <span>⏰ {getTimeRemaining(thread.expiresAt)}</span>
// //                           <span>👥 {thread.members?.length || 0} members</span>
// //                           <span>💬 {thread.chat?.length || 0} messages</span>
// //                         </div>
// //                       </div>
// //                       <div className="flex gap-2">
// //                         <button
// //                           onClick={() => handleViewThread(thread)}
// //                           className="p-2 text-blue-600 hover:bg-blue-50 rounded"
// //                           title="View Thread"
// //                         >
// //                           <Eye className="w-4 h-4" />
// //                         </button>
// //                         <button
// //                           onClick={() => handleDeleteThread(thread.id)}
// //                           className="p-2 text-red-600 hover:bg-red-50 rounded"
// //                           title="Delete Thread"
// //                         >
// //                           <Trash2 className="w-4 h-4" />
// //                         </button>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   // Create Thread Form Component
// //   const CreateThreadForm = () => {
// //     const [formData, setFormData] = useState({
// //       title: '',
// //       description: '',
// //       location: '',
// //       tags: '',
// //       duration: '2'
// //     });

// //     const handleSubmit = async () => {
// //       if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) return;
// //       setLoading(true);
// //       const threadData = {
// //         title: formData.title,
// //         description: formData.description,
// //         creator: currentUser.username,
// //         creatorId: currentUser.id,
// //         location: formData.location,
// //         tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
// //         expiresAt: new Date(Date.now() + parseInt(formData.duration) * 60 * 60 * 1000).toISOString()
// //       };
// //       try {
// //         const result = await threadsAPI.create(threadData);
// //         if (result.data.success) {
// //           setShowCreateForm(false);
// //           setFormData({ title: '', description: '', location: '', tags: '', duration: '2' });
// //           loadThreads();
// //         }
// //       } catch (error) {
// //         alert('Error creating thread');
// //       }
// //       setLoading(false);
// //     };

// //     return (
// //       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
// //         <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
// //           <div className="flex justify-between items-center mb-4">
// //             <h2 className="text-xl font-bold text-gray-900">Create Event Thread</h2>
// //             <button onClick={() => setShowCreateForm(false)} className="text-gray-500 hover:text-gray-700">
// //               <X className="w-5 h-5" />
// //             </button>
// //           </div>
// //           <div>
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
// //               <input
// //                 type="text"
// //                 placeholder="e.g., Coffee & Code meetup"
// //                 value={formData.title}
// //                 onChange={(e) => setFormData({...formData, title: e.target.value})}
// //                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //             </div>
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
// //               <textarea
// //                 placeholder="What's this event about?"
// //                 value={formData.description}
// //                 onChange={(e) => setFormData({...formData, description: e.target.value})}
// //                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 rows={3}
// //               />
// //             </div>
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
// //               <input
// //                 type="text"
// //                 placeholder="e.g., Starbucks Downtown"
// //                 value={formData.location}
// //                 onChange={(e) => setFormData({...formData, location: e.target.value})}
// //                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //             </div>
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
// //               <input
// //                 type="text"
// //                 placeholder="coffee, coding, social (comma separated)"
// //                 value={formData.tags}
// //                 onChange={(e) => setFormData({...formData, tags: e.target.value})}
// //                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //             </div>
// //             <div className="mb-6">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
// //               <select
// //                 value={formData.duration}
// //                 onChange={(e) => setFormData({...formData, duration: e.target.value})}
// //                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               >
// //                 <option value="1">1 hour</option>
// //                 <option value="2">2 hours</option>
// //                 <option value="4">4 hours</option>
// //                 <option value="8">8 hours</option>
// //               </select>
// //             </div>
// //             <div className="flex gap-3">
// //               <button
// //                 onClick={() => setShowCreateForm(false)}
// //                 className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleSubmit}
// //                 disabled={loading}
// //                 className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
// //               >
// //                 {loading ? 'Creating...' : 'Create Thread'}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   // Edit Thread Form Component
// //   const EditThreadForm = () => {
// //     const [formData, setFormData] = useState({
// //       title: editingThread?.title || '',
// //       description: editingThread?.description || '',
// //       location: editingThread?.location || '',
// //       tags: editingThread?.tags?.join(', ') || ''
// //     });

// //     const handleSubmit = async () => {
// //       if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) return;
// //       setLoading(true);

// //       const updateData = {
// //         title: formData.title,
// //         description: formData.description,
// //         location: formData.location,
// //         tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
// //         userId: currentUser.id
// //       };

// //       try {
// //         const result = await threadsAPI.update(editingThread.id, updateData);
// //         if (result.data.success) {
// //           setShowEditForm(false);
// //           setEditingThread(null);
// //           loadThreads();
// //           alert('Thread updated successfully!');
// //         }
// //       } catch (error) {
// //         alert('Error updating thread');
// //       }
// //       setLoading(false);
// //     };

// //     return (
// //       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
// //         <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
// //           <div className="flex justify-between items-center mb-4">
// //             <h2 className="text-xl font-bold text-gray-900">Edit Thread</h2>
// //             <button onClick={() => {
// //               setShowEditForm(false);
// //               setEditingThread(null);
// //             }} className="text-gray-500 hover:text-gray-700">
// //               <X className="w-5 h-5" />
// //             </button>
// //           </div>
          
// //           <div>
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
// //               <input
// //                 type="text"
// //                 placeholder="e.g., Coffee & Code meetup"
// //                 value={formData.title}
// //                 onChange={(e) => setFormData({...formData, title: e.target.value})}
// //                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //             </div>
            
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
// //               <textarea
// //                 placeholder="What's this event about?"
// //                 value={formData.description}
// //                 onChange={(e) => setFormData({...formData, description: e.target.value})}
// //                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 rows={3}
// //               />
// //             </div>
            
// //             <div className="mb-4">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
// //               <input
// //                 type="text"
// //                 placeholder="e.g., Starbucks Downtown"
// //                 value={formData.location}
// //                 onChange={(e) => setFormData({...formData, location: e.target.value})}
// //                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //             </div>
            
// //             <div className="mb-6">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
// //               <input
// //                 type="text"
// //                 placeholder="coffee, coding, social (comma separated)"
// //                 value={formData.tags}
// //                 onChange={(e) => setFormData({...formData, tags: e.target.value})}
// //                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               />
// //             </div>
            
// //             <div className="flex gap-3">
// //               <button
// //                 onClick={() => {
// //                   setShowEditForm(false);
// //                   setEditingThread(null);
// //                 }}
// //                 className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 onClick={handleSubmit}
// //                 disabled={loading}
// //                 className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
// //               >
// //                 {loading ? 'Updating...' : 'Update Thread'}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   // Chat View Component
// //   const ChatView = () => {
// //     if (!selectedThread) return null;
// //     const isCreator = selectedThread.creatorId === currentUser.id;
// //     const isMember = selectedThread.members.includes(currentUser.id);

// //     const sendMessage = async () => {
// //       if (!newMessage.trim()) return;
// //       const messageData = {
// //         user: currentUser.username,
// //         userId: currentUser.id,
// //         message: newMessage.trim()
// //       };
// //       try {
// //         const result = await threadsAPI.sendMessage(selectedThread.id, messageData);
// //         if (result.data.success) {
// //           setNewMessage('');
// //           loadThreads();
// //         }
// //       } catch (error) {
// //         alert('Error sending message');
// //       }
// //     };

// //     const handleKeyPress = (e) => {
// //       if (e.key === 'Enter' && !e.shiftKey) {
// //         e.preventDefault();
// //         sendMessage();
// //       }
// //     };

// //     const handleRequest = async (userId, approve) => {
// //       try {
// //         const result = await threadsAPI.handleRequest(selectedThread.id, userId, approve, currentUser.id);
// //         if (result.data.success) {
// //           loadThreads();
// //         }
// //       } catch (error) {
// //         alert('Error handling request');
// //       }
// //     };

// //     const getUsernameById = (userId) => {
// //       if (userId === currentUser?.id) return currentUser.username;
// //       return `User_${userId.slice(-4)}`;
// //     };

// //     return (
// //       <div className="fixed inset-0 bg-white z-40 flex flex-col">
// //         <div className="bg-white border-b border-gray-200 p-4">
// //           <div className="flex items-center justify-between">
// //             <button onClick={() => setSelectedThread(null)} className="text-gray-600 hover:text-gray-800">
// //               ← Back
// //             </button>
// //             <div className="text-center flex-1">
// //               <h2 className="font-semibold text-gray-900">{selectedThread.title}</h2>
// //               <p className="text-sm text-gray-500">{selectedThread.members.length} members • {getTimeRemaining(selectedThread.expiresAt)} left</p>
// //             </div>
// //             <div className="w-6"></div>
// //           </div>
// //         </div>
// //         {isCreator && selectedThread.pendingRequests.length > 0 && (
// //           <div className="bg-orange-50 border-b border-orange-200 p-4">
// //             <h3 className="font-medium text-orange-900 mb-2">Join Requests ({selectedThread.pendingRequests.length})</h3>
// //             <div className="space-y-2">
// //               {selectedThread.pendingRequests.map(userId => (
// //                 <div key={userId} className="flex items-center justify-between bg-white p-2 rounded-lg">
// //                   <span className="text-sm font-medium">{getUsernameById(userId)}</span>
// //                   <div className="flex gap-2">
// //                     <button
// //                       onClick={() => handleRequest(userId, false)}
// //                       className="p-1 text-red-600 hover:bg-red-50 rounded"
// //                     >
// //                       <X className="w-4 h-4" />
// //                     </button>
// //                     <button
// //                       onClick={() => handleRequest(userId, true)}
// //                       className="p-1 text-green-600 hover:bg-green-50 rounded"
// //                     >
// //                       <Check className="w-4 h-4" />
// //                     </button>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         )}
// //         <div className="flex-1 overflow-y-auto p-4 space-y-3 chat-container">
// //           {selectedThread.chat.map(msg => (
// //             <div key={msg.id} className={`flex ${msg.user === currentUser.username ? 'justify-end' : 'justify-start'}`}>
// //               <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
// //                 msg.user === currentUser.username
// //                   ? 'bg-blue-600 text-white'
// //                   : msg.user === 'System'
// //                   ? 'bg-gray-100 text-gray-600 text-center text-sm'
// //                   : 'bg-gray-100 text-gray-900'
// //               }`}>
// //                 {msg.user !== currentUser.username && msg.user !== 'System' && (
// //                   <div className="text-xs font-medium mb-1 opacity-70">{msg.user}</div>
// //                 )}
// //                 <div className="text-sm">{msg.message}</div>
// //                 <div className="text-xs opacity-70 mt-1">{formatTime(msg.timestamp)}</div>
// //               </div>
// //             </div>
// //           ))}
// //           <div ref={chatEndRef} />
// //         </div>
// //         {isMember && (
// //           <div className="bg-white border-t border-gray-200 p-4">
// //             <div className="flex gap-2">
// //               <input
// //                 type="text"
// //                 placeholder="Type a message..."
// //                 value={newMessage}
// //                 onChange={(e) => setNewMessage(e.target.value)}
// //                 onKeyDown={handleKeyPress}
// //                 className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                 autoFocus
// //               />
// //               <button
// //                 onClick={sendMessage}
// //                 disabled={!newMessage.trim()}
// //                 className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //               >
// //                 <Send className="w-5 h-5" />
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     );
// //   };

// //   // Main render
// //   if (showLoginForm) return <LoginPage onLogin={handleLogin} />;
// //   if (showAdminDashboard) return <AdminDashboard />;

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <header className="bg-white shadow-sm border-b border-gray-200">
// //         <div className="max-w-4xl mx-auto px-4 py-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h1 className="text-2xl font-bold text-gray-900">EventThreads</h1>
// //               <p className="text-sm text-gray-600">Temporary interest-based connections</p>
// //             </div>
// //             <div className="flex items-center gap-3">
// //               <span className="text-sm text-gray-600">Hi, {currentUser.username}!</span>
// //               {currentUser.isAdmin && (
// //                 <button
// //                   onClick={() => setShowAdminDashboard(true)}
// //                   className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
// //                 >
// //                   <Shield className="w-4 h-4" />
// //                   Admin
// //                 </button>
// //               )}
// //               <button
// //                 onClick={() => {
// //                   setCurrentUser(null);
// //                   setShowLoginForm(true);
// //                 }}
// //                 className="text-gray-500 hover:text-gray-700"
// //               >
// //                 <LogOut className="w-5 h-5" />
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </header>
// //       <main className="max-w-4xl mx-auto px-4 py-6">
// //         <div className="mb-6">
// //           <button
// //             onClick={() => setShowCreateForm(true)}
// //             className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
// //           >
// //             <Plus className="w-5 h-5" />
// //             Create Event Thread
// //           </button>
// //         </div>
// //         <div className="mb-6">
// //           <h2 className="text-lg font-semibold text-gray-900 mb-4">
// //             Active Threads ({threads.length})
// //           </h2>
// //           {threads.length === 0 ? (
// //             <div className="text-center py-12">
// //               <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
// //               <h3 className="text-lg font-medium text-gray-900 mb-2">No active threads</h3>
// //               <p className="text-gray-600 mb-4">Be the first to create an event thread!</p>
// //               <button
// //                 onClick={() => setShowCreateForm(true)}
// //                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// //               >
// //                 Create Thread
// //               </button>
// //             </div>
// //           ) : (
// //             <div className="space-y-4">
// //               {threads.map(thread => {
// //                 const isCreator = thread.creatorId === currentUser.id;
// //                 const isMember = thread.members.includes(currentUser.id);
// //                 const hasPendingRequest = thread.pendingRequests.includes(currentUser.id);
// //                 const hasPendingRequests = isCreator && thread.pendingRequests.length > 0;
// //                 return (
// //                   <div key={thread.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
// //                     <div className="flex justify-between items-start mb-3">
// //                       <div className="flex-1">
// //                         <h3 className="font-semibold text-gray-900 mb-1">{thread.title}</h3>
// //                         <p className="text-gray-600 text-sm mb-2">{thread.description}</p>
// //                         <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
// //                           <div className="flex items-center gap-1">
// //                             <User className="w-4 h-4" />
// //                             <span>{thread.creator}</span>
// //                           </div>
// //                           <div className="flex items-center gap-1">
// //                             <MapPin className="w-4 h-4" />
// //                             <span>{thread.location}</span>
// //                           </div>
// //                           <div className="flex items-center gap-1">
// //                             <Clock className="w-4 h-4" />
// //                             <span>{getTimeRemaining(thread.expiresAt)}</span>
// //                           </div>
// //                         </div>
// //                         <div className="flex items-center gap-2 mb-3">
// //                           <Users className="w-4 h-4 text-gray-400" />
// //                           <span className="text-sm text-gray-600">{thread.members.length} members</span>
// //                           {hasPendingRequests && (
// //                             <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
// //                               {thread.pendingRequests.length} pending
// //                             </span>
// //                           )}
// //                         </div>
// //                         <div className="flex flex-wrap gap-1 mb-3">
// //                           {thread.tags.map(tag => (
// //                             <span key={tag} className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
// //                               <Hash className="w-3 h-3" />
// //                               {tag}
// //                             </span>
// //                           ))}
// //                         </div>
// //                       </div>
// //                     </div>
                    
// //                     <div className="flex gap-2">
// //                       {isCreator && (
// //                         <button
// //                           onClick={() => {
// //                             setEditingThread(thread);
// //                             setShowEditForm(true);
// //                           }}
// //                           className="px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
// //                         >
// //                           Edit
// //                         </button>
// //                       )}
// //                       {isMember ? (
// //                         <button
// //                           onClick={() => setSelectedThread(thread)}
// //                           className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-1"
// //                         >
// //                           <MessageCircle className="w-4 h-4" />
// //                           Chat ({thread.chat.length})
// //                         </button>
// //                       ) : hasPendingRequest ? (
// //                         <button className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg flex-1 cursor-not-allowed">
// //                           Request Pending...
// //                         </button>
// //                       ) : (
// //                         <button
// //                           onClick={async () => {
// //                             try {
// //                               await threadsAPI.requestJoin(thread.id, currentUser.id);
// //                               loadThreads();
// //                             } catch (error) {
// //                               alert('Error sending join request');
// //                             }
// //                           }}
// //                           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1"
// //                         >
// //                           <Plus className="w-4 h-4" />
// //                           Request to Join
// //                         </button>
// //                       )}
// //                       {hasPendingRequests && (
// //                         <button
// //                           onClick={() => setSelectedThread(thread)}
// //                           className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
// //                         >
// //                           Review Requests
// //                         </button>
// //                       )}
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           )}
// //         </div>
// //       </main>
// //       {showCreateForm && <CreateThreadForm />}
// //       {showEditForm && <EditThreadForm />}
// //       {selectedThread && <ChatView />}
// //     </div>
// //   );
// // }

// // export default App;

// //4
// import React, { useState, useEffect, useRef } from 'react';
// import { Clock, Users, MapPin, MessageCircle, Plus, X, Check, Hash, Calendar, Send, LogOut, User, Shield, Trash2, Eye } from 'lucide-react';
// import { authAPI, threadsAPI, adminAPI } from './services/api';
// import LoginPage from './components/LoginPage';

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
//   const chatEndRef = useRef(null);

//   // Auto-scroll chat
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [selectedThread?.chat]);

//   // Load threads periodically
//   useEffect(() => {
//     if (currentUser && !showLoginForm) {
//       loadThreads();
      
//       const interval = setInterval(() => {
//         if (!showCreateForm && !showEditForm) {
//           loadThreads();
//         }
//       }, 30000);
      
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
//         ...thread,
//         members: thread.members || [],
//         pendingRequests: thread.pendingRequests || [],
//         chat: thread.chat || [],
//         tags: thread.tags || []
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
//               <p className="text-3xl font-bold text-blue-600">{adminData?.totalThreads || 0}</p>
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
//             {!adminData?.threads || adminData.threads.length === 0 ? (
//               <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
//                 <p className="text-gray-500">No active threads</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {adminData.threads.map(thread => (
//                   <div key={thread.id} className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex justify-between items-start mb-3">
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-gray-900">{thread.title}</h3>
//                         <p className="text-sm text-gray-600 mb-2">{thread.description}</p>
//                         <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
//                           <span>👤 {thread.creator}</span>
//                           <span>📍 {thread.location}</span>
//                           <span>⏰ {getTimeRemaining(thread.expiresAt)}</span>
//                           <span>👥 {thread.members?.length || 0} members</span>
//                           <span>💬 {thread.chat?.length || 0} messages</span>
//                         </div>
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
//                           onClick={() => handleDeleteThread(thread.id)}
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
//       tags: '',
//       duration: '2'
//     });

//     const handleSubmit = async () => {
//       if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) return;
//       setLoading(true);
//       const threadData = {
//         title: formData.title,
//         description: formData.description,
//         creator: currentUser.username,
//         creatorId: currentUser.id,
//         location: formData.location,
//         tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
//         expiresAt: new Date(Date.now() + parseInt(formData.duration) * 60 * 60 * 1000).toISOString()
//       };
//       try {
//         const result = await threadsAPI.create(threadData);
//         if (result.data.success) {
//           setShowCreateForm(false);
//           setFormData({ title: '', description: '', location: '', tags: '', duration: '2' });
//           loadThreads();
//         }
//       } catch (error) {
//         alert('Error creating thread');
//       }
//       setLoading(false);
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
//               <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
//               <input
//                 type="text"
//                 placeholder="coffee, coding, social (comma separated)"
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

//     const sendMessage = async () => {
//       if (!newMessage.trim()) return;
//       const messageData = {
//         user: currentUser.username,
//         userId: currentUser.id,
//         message: newMessage.trim()
//       };
//       try {
//         const result = await threadsAPI.sendMessage(selectedThread.id, messageData);
//         if (result.data.success) {
//           setNewMessage('');
//           loadThreads();
//         }
//       } catch (error) {
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
//           loadThreads();
//         }
//       } catch (error) {
//         alert('Error handling request');
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
//             <div className="w-6"></div>
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
//           {selectedThread.chat.map(msg => (
//             <div key={msg.id} className={`flex ${msg.user === currentUser.username ? 'justify-end' : 'justify-start'}`}>
//               <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//                 msg.user === currentUser.username
//                   ? 'bg-blue-600 text-white'
//                   : msg.user === 'System'
//                   ? 'bg-gray-100 text-gray-600 text-center text-sm'
//                   : 'bg-gray-100 text-gray-900'
//               }`}>
//                 {msg.user !== currentUser.username && msg.user !== 'System' && (
//                   <div className="text-xs font-medium mb-1 opacity-70">{msg.user}</div>
//                 )}
//                 <div className="text-sm">{msg.message}</div>
//                 <div className="text-xs opacity-70 mt-1">{formatTime(msg.timestamp)}</div>
//               </div>
//             </div>
//           ))}
//           <div ref={chatEndRef} />
//         </div>
//         {isMember && (
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
//               />
//               <button
//                 onClick={sendMessage}
//                 disabled={!newMessage.trim()}
//                 className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Send className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Main render
// if (showLoginForm) return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />;

//   if (showAdminDashboard) return <AdminDashboard />;

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
//         <div className="mb-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">
//             Active Threads ({threads.length})
//           </h2>
//           {threads.length === 0 ? (
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
//               {threads.map(thread => {
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
//                             try {
//                               await threadsAPI.requestJoin(thread.id, currentUser.id);
//                               loadThreads();
//                             } catch (error) {
//                               alert('Error sending join request');
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

//5
// import React, { useState, useEffect, useRef } from 'react';
// import { Clock, Users, MapPin, MessageCircle, Plus, X, Check, Hash, Calendar, Send, LogOut, User, Shield, Trash2, Eye } from 'lucide-react';
// import { authAPI, threadsAPI, adminAPI } from './services/api';
// import LoginPage from './components/LoginPage';
// import { io } from 'socket.io-client';

// const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
//   const chatEndRef = useRef(null);
//   const socketRef = useRef(null);

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
//         ...thread,
//         members: thread.members || [],
//         pendingRequests: thread.pendingRequests || [],
//         chat: thread.chat || [],
//         tags: thread.tags || []
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
//               <p className="text-3xl font-bold text-blue-600">{adminData?.totalThreads || 0}</p>
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
//             {!adminData?.threads || adminData.threads.length === 0 ? (
//               <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
//                 <p className="text-gray-500">No active threads</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {adminData.threads.map(thread => (
//                   <div key={thread.id} className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex justify-between items-start mb-3">
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-gray-900">{thread.title}</h3>
//                         <p className="text-sm text-gray-600 mb-2">{thread.description}</p>
//                         <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
//                           <span>👤 {thread.creator}</span>
//                           <span>📍 {thread.location}</span>
//                           <span>⏰ {getTimeRemaining(thread.expiresAt)}</span>
//                           <span>👥 {thread.members?.length || 0} members</span>
//                           <span>💬 {thread.chat?.length || 0} messages</span>
//                         </div>
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
//                           onClick={() => handleDeleteThread(thread.id)}
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
//       tags: '',
//       duration: '2'
//     });

//     const handleSubmit = async () => {
//       if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) return;
//       setLoading(true);
      
//       const threadData = {
//         title: formData.title,
//         description: formData.description,
//         creator: currentUser.username,
//         creatorId: currentUser.id,
//         location: formData.location,
//         tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
//         expiresAt: new Date(Date.now() + parseInt(formData.duration) * 60 * 60 * 1000).toISOString()
//       };

//       // Optimistic update - close form immediately
//       setShowCreateForm(false);
//       const tempFormData = { ...formData };
//       setFormData({ title: '', description: '', location: '', tags: '', duration: '2' });

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
//               <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
//               <input
//                 type="text"
//                 placeholder="coffee, coding, social (comma separated)"
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

//     // Join thread room on mount
//     useEffect(() => {
//       if (socketRef.current && selectedThread) {
//         socketRef.current.emit('join-thread', selectedThread.id);
        
//         // Listen for new messages
//         const handleNewMessage = (message) => {
//           console.log('📨 New message received:', message);
//           setSelectedThread(prev => ({
//             ...prev,
//             chat: [...prev.chat.filter(msg => !msg.isPending), message]
//           }));
//         };

//         socketRef.current.on('new-message', handleNewMessage);

//         return () => {
//           socketRef.current.emit('leave-thread', selectedThread.id);
//           socketRef.current.off('new-message', handleNewMessage);
//         };
//       }
//     }, [selectedThread?.id]);

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
//             <div className="w-6"></div>
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
//           {selectedThread.chat.map(msg => (
//             <div key={msg.id} className={`flex ${msg.user === currentUser.username ? 'justify-end' : 'justify-start'}`}>
//               <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//                 msg.user === currentUser.username
//                   ? `bg-blue-600 text-white ${msg.isPending ? 'opacity-70' : ''}`
//                   : msg.user === 'System'
//                   ? 'bg-gray-100 text-gray-600 text-center text-sm'
//                   : 'bg-gray-100 text-gray-900'
//               }`}>
//                 {msg.user !== currentUser.username && msg.user !== 'System' && (
//                   <div className="text-xs font-medium mb-1 opacity-70">{msg.user}</div>
//                 )}
//                 <div className="text-sm">{msg.message}</div>
//                 <div className="text-xs opacity-70 mt-1 flex items-center gap-1">
//                   {formatTime(msg.timestamp)}
//                   {msg.isPending && <span className="text-xs">⏳</span>}
//                 </div>
//               </div>
//             </div>
//           ))}
//           <div ref={chatEndRef} />
//         </div>
//         {isMember && (
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
//               />
//               <button
//                 onClick={sendMessage}
//                 disabled={!newMessage.trim()}
//                 className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Send className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Main render
//   if (showLoginForm) return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />;
//   if (showAdminDashboard) return <AdminDashboard />;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-4xl mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Prastha</h1>
//               <p className="text-sm text-gray-600">Temporary interest-based connections</p>
//             </div>
//             <div className="flex items-center gap-3">
//               <span className="text-sm text-gray-600">Hi, {currentUser.username}!</span>
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
//         <div className="mb-6">
//           <h2 className="text-lg font-semibold text-gray-900 mb-4">
//             Active Threads ({threads.length})
//           </h2>
//           {threads.length === 0 ? (
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
//               {threads.map(thread => {
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

//6
import React, { useState, useEffect, useRef } from 'react';
import { Clock, Users, MapPin, MessageCircle, Plus, X, Check, Hash, Calendar, Send, LogOut, User, Shield, Trash2, Eye } from 'lucide-react';
import { authAPI, threadsAPI, adminAPI } from './services/api';
import LoginPage from './components/LoginPage';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper functions
const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getTimeRemaining = (expiresAt) => {
  const diff = new Date(expiresAt) - new Date();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return 'Expiring soon';
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingThread, setEditingThread] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const chatEndRef = useRef(null);
  const socketRef = useRef(null);

  // Request notification permission on login
  useEffect(() => {
    if (currentUser && !showLoginForm && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            setNotificationsEnabled(true);
            new Notification('EventThreads', {
              body: 'Notifications enabled! You\'ll be alerted for important messages.',
              icon: '/vite.svg'
            });
          }
        });
      }
    }
  }, [currentUser, showLoginForm]);

  // Categories for filtering
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

  // Initialize Socket.io
  useEffect(() => {
    if (currentUser && !showLoginForm) {
      socketRef.current = io(SOCKET_URL, {
        transports: ['websocket', 'polling']
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Socket connected');
      });

      socketRef.current.on('refresh-threads', () => {
        console.log('🔄 Refreshing threads from socket');
        loadThreads();
      });

      socketRef.current.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [currentUser, showLoginForm]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedThread?.chat]);

  // Load threads periodically (as backup, socket handles real-time)
  useEffect(() => {
    if (currentUser && !showLoginForm) {
      loadThreads();
      
      // Backup polling every 60s (socket handles real-time updates)
      const interval = setInterval(() => {
        if (!showCreateForm && !showEditForm) {
          loadThreads();
        }
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [currentUser, showLoginForm, showCreateForm, showEditForm]);

  // Load admin dashboard
  useEffect(() => {
    if (currentUser?.isAdmin && showAdminDashboard) {
      loadAdminDashboard();
    }
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
    } catch (error) {
      console.error('Error loading threads:', error);
    }
  };

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

  const loadAdminDashboard = async () => {
    try {
      const response = await adminAPI.getDashboard(currentUser.id);
      if (response.data.success) {
        setAdminData(response.data.data);
      }
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
    }
  };

  const handleLogin = async (username, password, isAdmin) => {
    try {
      const response = await authAPI.login(username, password, isAdmin);
      if (response.data.success) {
        setCurrentUser(response.data.user);
        setShowLoginForm(false);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleRegister = async (username, password) => {
    try {
      const response = await authAPI.register(username, password);
      if (response.data.success) {
        setCurrentUser(response.data.user);
        setShowLoginForm(false);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  // Admin Dashboard Component
  const AdminDashboard = () => {
    const handleDeleteThread = async (threadId) => {
      if (window.confirm('Are you sure you want to delete this thread?')) {
        try {
          const result = await threadsAPI.delete(threadId, currentUser.id);
          if (result.data.success) {
            loadAdminDashboard();
            loadThreads();
          }
        } catch (error) {
          alert('Error deleting thread');
        }
      }
    };

    const handleViewThread = (thread) => {
      const formattedThread = {
        id: thread.id || thread._id,
        title: thread.title,
        description: thread.description,
        creator: thread.creator || thread.creatorUsername,
        creatorId: thread.creatorId || thread.creator,
        location: thread.location,
        members: thread.members || [],
        pendingRequests: thread.pendingRequests || [],
        chat: thread.chat || [],
        tags: thread.tags || [],
        expiresAt: thread.expiresAt
      };
      setSelectedThread(formattedThread);
      setShowAdminDashboard(false);
    };

    return (
      <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
        <div className="bg-blue-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="opacity-90">Monitor all threads and users</p>
            </div>
            <button onClick={() => setShowAdminDashboard(false)} className="text-white hover:text-blue-200">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Threads</h3>
              <p className="text-3xl font-bold text-blue-600">{adminData?.totalThreads || threads.length || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Users</h3>
              <p className="text-3xl font-bold text-green-600">{adminData?.activeUsers || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-purple-600">{adminData?.totalUsers || 0}</p>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Active Threads</h2>
            {(!adminData?.threads || adminData.threads.length === 0) && (!threads || threads.length === 0) ? (
              <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-500">No active threads</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(adminData?.threads || threads).map(thread => (
                  <div key={thread.id || thread._id} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{thread.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{thread.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <span>👤 {thread.creator || thread.creatorUsername}</span>
                          <span>📍 {thread.location}</span>
                          <span>⏰ {getTimeRemaining(thread.expiresAt)}</span>
                          <span>👥 {thread.members?.length || 0} members</span>
                          <span>💬 {thread.chat?.length || 0} messages</span>
                        </div>
                        {thread.memberDetails && thread.memberDetails.length > 0 && (
                          <div className="text-sm text-gray-600">
                            <strong>Members:</strong> {thread.memberDetails.map(m => m.username).join(', ')}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewThread(thread)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="View Thread"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteThread(thread.id || thread._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete Thread"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {adminData?.users && adminData.users.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Users</h2>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Username</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Joined</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {adminData.users.map(user => (
                      <tr key={user.id || user._id}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.username}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                      </tr>
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

  // Create Thread Form Component
  const CreateThreadForm = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      location: '',
      category: 'other',
      tags: '',
      duration: '2'
    });

    const handleSubmit = async () => {
      if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) return;
      setLoading(true);
      
      // Combine category with custom tags
      const allTags = [formData.category];
      if (formData.tags.trim()) {
        allTags.push(...formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag));
      }

      const threadData = {
        title: formData.title,
        description: formData.description,
        creator: currentUser.username,
        creatorId: currentUser.id,
        location: formData.location,
        tags: allTags,
        expiresAt: new Date(Date.now() + parseInt(formData.duration) * 60 * 60 * 1000).toISOString()
      };

      // Optimistic update - close form immediately
      setShowCreateForm(false);
      const tempFormData = { ...formData };
      setFormData({ title: '', description: '', location: '', category: 'other', tags: '', duration: '2' });

      try {
        const result = await threadsAPI.create(threadData);
        if (result.data.success) {
          loadThreads();
        }
      } catch (error) {
        alert('Error creating thread');
        // Restore form on error
        setShowCreateForm(true);
        setFormData(tempFormData);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Create Event Thread</h2>
            <button onClick={() => setShowCreateForm(false)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
              <input
                type="text"
                placeholder="e.g., Coffee & Code meetup"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                placeholder="What's this event about?"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                placeholder="e.g., Starbucks Downtown"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Tags (Optional)</label>
              <input
                type="text"
                placeholder="e.g., beginner-friendly, casual (comma separated)"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="4">4 hours</option>
                <option value="8">8 hours</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Thread'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Edit Thread Form Component
  const EditThreadForm = () => {
    const [formData, setFormData] = useState({
      title: editingThread?.title || '',
      description: editingThread?.description || '',
      location: editingThread?.location || '',
      tags: editingThread?.tags?.join(', ') || ''
    });

    const handleSubmit = async () => {
      if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) return;
      setLoading(true);

      const updateData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        userId: currentUser.id
      };

      try {
        const result = await threadsAPI.update(editingThread.id, updateData);
        if (result.data.success) {
          setShowEditForm(false);
          setEditingThread(null);
          loadThreads();
          alert('Thread updated successfully!');
        }
      } catch (error) {
        alert('Error updating thread');
      }
      setLoading(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Edit Thread</h2>
            <button onClick={() => {
              setShowEditForm(false);
              setEditingThread(null);
            }} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
              <input
                type="text"
                placeholder="e.g., Coffee & Code meetup"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                placeholder="What's this event about?"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                placeholder="e.g., Starbucks Downtown"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <input
                type="text"
                placeholder="coffee, coding, social (comma separated)"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEditForm(false);
                  setEditingThread(null);
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Thread'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Chat View Component
  const ChatView = () => {
    if (!selectedThread) return null;
    const isCreator = selectedThread.creatorId === currentUser.id;
    const isMember = selectedThread.members.includes(currentUser.id);
    const isAdmin = currentUser.isAdmin;

    // Join thread room on mount
    useEffect(() => {
      if (socketRef.current && selectedThread) {
        socketRef.current.emit('join-thread', selectedThread.id);
        
        // Listen for new messages
        const handleNewMessage = (message) => {
          console.log('📨 New message received:', message);
          
          setSelectedThread(prev => ({
            ...prev,
            chat: [...prev.chat.filter(msg => !msg.isPending), message]
          }));

          // Show web notification for alerts
          if (message.user === 'Alert' && message.userId !== currentUser.id) {
            console.log('Alert received, checking notifications...');
            
            if ('Notification' in window && Notification.permission === 'granted') {
              console.log('Showing notification...');
              
              // Extract alert text
              const alertText = message.message.replace(/^🚨 ALERT:\s*/i, '').normalize('NFC').trim();
              
              const notification = new Notification(`🚨 ${selectedThread.title}`, {
                body: alertText,
                icon: '/vite.svg',
                tag: `alert-${message.id}`,
                requireInteraction: true
              });

              // Play sound
              try {
                const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjmL0fPTgjMGHm7A7+OZSA0PVqzn8LJfGAg+ltryxnMpBSh+zPLaizsIGGS57OmiUBELTKXh8bllHAU2jdXzzn0vBSp5yu/glEIJEVqv5O+zYhYHPJPY8saxKgUneMrw3JI+CRVateXur10ZCTqO0/TOfy8GKnfJ8N+UQAkSV63k8LJgGQc7kdXzzn0wBSh1xe/hlUQJD1ap5O+yYRYIP5LX88p3LgUodMPu4JU/CRBUquPvsF8bCDuO0vPPgC0FKnTE7+KWRAkPUKfh76teFgo9j9Xz0H4xBSdywu/hlUIKD06k4O6vXhoJPIzS8s+ALwUpccHu4JM/ChFPpuHtr18cCDqOz/LQgS4GKnHA7uCUQAoQTaXg765dGAk7jdDyzn0xBShywO3gkT4KD0+k4O+wXhoJO43Q8s98MAUndrzv4JRAChBOpN/tr14bCDqLz/LPgC8GJ3K+7uCQPgkQTqPg77BeGQc5jM/y0H0zBCdvu+7gkz4KEFPI3+2uXRoJOYvP8c99MQUndr3v4JI+CRBNod/tr14aCTmLzvHNfDEFJ3S77+CRPgkPTaHf7a9dGQg5i87xzn0zBSd0u+/gkD4JD0uh3+2vXhoJOIrO8c59MgUodLrv4I8+CRBLod/sr10aCDiJzvHNfTIFJ3O67+COPQkQS6Df7K9dGgg4iM/xzXwyBSdyu+/gjz4JEFPI3+2uXRoJOIjO8c59MQUocrvv4I4+CRBLod/sr10aCDiJzvHNfDEFJ3K67+CNPwkQS6Df7K5dGgk4iM7xzXwyBSdxuO/gjj4JD0ug3+yvXRoIOInO8c59MQUncLrt4I4+CQ9LoN/sr10aCDiJzvHNfDEFJ3C67+CN') ;
                audio.play().catch(e => console.log('Audio play failed:', e));
              } catch (e) {
                console.log('Audio not supported');
              }

              // Auto-close after 10 seconds
              setTimeout(() => notification.close(), 10000);
            } else {
              console.log('Notifications not granted:', Notification.permission);
            }
          }
        };

        socketRef.current.on('new-message', handleNewMessage);

        return () => {
          socketRef.current.emit('leave-thread', selectedThread.id);
          socketRef.current.off('new-message', handleNewMessage);
        };
      }
    }, [selectedThread?.id, notificationsEnabled]);

    const sendMessage = async () => {
      if (!newMessage.trim()) return;
      
      const tempMessage = {
        id: `temp-${Date.now()}`,
        user: currentUser.username,
        userId: currentUser.id,
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
        isPending: true
      };

      // Optimistic update
      setSelectedThread(prev => ({
        ...prev,
        chat: [...prev.chat, tempMessage]
      }));
      
      const messageText = newMessage.trim();
      setNewMessage('');

      try {
        const messageData = {
          user: currentUser.username,
          userId: currentUser.id,
          message: messageText
        };
        
        await threadsAPI.sendMessage(selectedThread.id, messageData);
        // Socket will handle adding the real message
      } catch (error) {
        // Remove pending message on error
        setSelectedThread(prev => ({
          ...prev,
          chat: prev.chat.filter(msg => msg.id !== tempMessage.id)
        }));
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
        const result = await threadsAPI.handleRequest(selectedThread.id, userId, approve, currentUser.id);
        if (result.data.success) {
          // Optimistic update for request handling
          setSelectedThread(prev => ({
            ...prev,
            pendingRequests: prev.pendingRequests.filter(id => id !== userId),
            members: approve ? [...prev.members, userId] : prev.members
          }));
          loadThreads();
        }
      } catch (error) {
        alert('Error handling request');
        loadThreads(); // Revert on error
      }
    };

    const sendAlert = async () => {
      if (!alertMessage.trim()) {
        alert('Please enter an alert message');
        return;
      }

      const messageText = alertMessage.trim();
      
      try {
        const messageData = {
          user: 'Alert',
          userId: currentUser.id,
          message: `🚨 ALERT: ${messageText}`
        };
        
        console.log('Sending alert:', messageData);
        
        const result = await threadsAPI.sendMessage(selectedThread.id, messageData);
        
        if (result.data.success) {
          setAlertMessage('');
          setShowAlertModal(false);
          console.log('Alert sent successfully');
        }
      } catch (error) {
        console.error('Error sending alert:', error);
        alert('Error sending alert. Please try again.');
      }
    };

    const getUsernameById = (userId) => {
      if (userId === currentUser?.id) return currentUser.username;
      return `User_${userId.slice(-4)}`;
    };

    return (
      <div className="fixed inset-0 bg-white z-40 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setSelectedThread(null)} className="text-gray-600 hover:text-gray-800">
              ← Back
            </button>
            <div className="text-center flex-1">
              <h2 className="font-semibold text-gray-900">{selectedThread.title}</h2>
              <p className="text-sm text-gray-500">{selectedThread.members.length} members • {getTimeRemaining(selectedThread.expiresAt)} left</p>
            </div>
            {isCreator && (
              <button
                onClick={() => setShowAlertModal(true)}
                className="flex items-center gap-1 px-3 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
                title="Send Alert to All Members"
              >
                <span className="text-lg">🚨</span>
                Alert
              </button>
            )}
            {!isCreator && <div className="w-20"></div>}
          </div>
        </div>
        {isCreator && selectedThread.pendingRequests.length > 0 && (
          <div className="bg-orange-50 border-b border-orange-200 p-4">
            <h3 className="font-medium text-orange-900 mb-2">Join Requests ({selectedThread.pendingRequests.length})</h3>
            <div className="space-y-2">
              {selectedThread.pendingRequests.map(userId => (
                <div key={userId} className="flex items-center justify-between bg-white p-2 rounded-lg">
                  <span className="text-sm font-medium">{getUsernameById(userId)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRequest(userId, false)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRequest(userId, true)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 chat-container">
          {selectedThread.chat && selectedThread.chat.length > 0 ? (
            selectedThread.chat.map(msg => (
              <div key={msg.id} className={`flex ${
                msg.user === 'Alert' ? 'justify-center' : 
                msg.user === currentUser.username ? 'justify-end' : 
                'justify-start'
              }`}>
                <div className={`${
                  msg.user === 'Alert' ? 'max-w-full w-full' : 'max-w-xs lg:max-w-md'
                } px-4 py-3 rounded-lg ${
                  msg.user === 'Alert'
                    ? 'bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-400 shadow-lg'
                    : msg.user === currentUser.username
                    ? `bg-blue-600 text-white ${msg.isPending ? 'opacity-70' : ''}`
                    : msg.user === 'System'
                    ? 'bg-gray-100 text-gray-600 text-center text-sm'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {msg.user === 'Alert' && (
                    <div className="flex items-center justify-center gap-2 mb-2 font-bold text-red-700">
                      <span className="text-2xl animate-pulse">🚨</span>
                      <span className="text-lg">CREATOR ALERT</span>
                      <span className="text-2xl animate-pulse">🚨</span>
                    </div>
                  )}
                  {msg.user !== currentUser.username && msg.user !== 'System' && msg.user !== 'Alert' && (
                    <div className="text-xs font-medium mb-1 opacity-70">{msg.user}</div>
                  )}
                  <div className={`${
                    msg.user === 'Alert' 
                      ? 'text-base font-bold text-center text-gray-900' 
                      : 'text-sm'
                  }`}>
                    {msg.user === 'Alert' 
                      ? msg.message.replace(/^🚨\s*ALERT:\s*/i, '').trim()
                      : msg.message}
                  </div>
                  <div className={`text-xs opacity-70 mt-1 flex items-center ${
                    msg.user === 'Alert' ? 'justify-center' : ''
                  } gap-1`}>
                    {formatTime(msg.timestamp)}
                    {msg.isPending && <span className="text-xs">⏳</span>}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 mt-8">No messages yet</div>
          )}
          <div ref={chatEndRef} />
        </div>
        {(isMember || isAdmin) && (
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                disabled={isAdmin && !isMember}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || (isAdmin && !isMember)}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            {isAdmin && !isMember && (
              <p className="text-xs text-gray-500 mt-2">Admin view only - cannot send messages</p>
            )}
          </div>
        )}

        {/* Alert Modal */}
        {showAlertModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚨</span>
                  <h3 className="text-xl font-bold text-gray-900">Send Alert</h3>
                </div>
                <button onClick={() => setShowAlertModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                This will send a highlighted message to all members. Use for important announcements like location changes, cancellations, or urgent updates.
              </p>
              <textarea
                placeholder="e.g., Location changed to Central Park! See you there at 5 PM."
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
                rows={4}
                maxLength={200}
                autoFocus
              />
              <div className="text-xs text-gray-500 mb-4">
                {alertMessage.length}/200 characters
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAlertModal(false);
                    setAlertMessage('');
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={sendAlert}
                  disabled={!alertMessage.trim()}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span className="text-lg">🚨</span>
                  Send Alert
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Main render
  if (showLoginForm) return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />;
  if (showAdminDashboard) return <AdminDashboard />;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">EventThreads</h1>
              <p className="text-sm text-gray-600">Temporary interest-based connections</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Hi, {currentUser.username}!</span>
              
              {/* Notification Permission Button */}
              {!notificationsEnabled && 'Notification' in window && Notification.permission !== 'denied' && (
                <button
                  onClick={async () => {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                      setNotificationsEnabled(true);
                      new Notification('EventThreads Notifications Enabled! 🎉', {
                        body: 'You will now receive alerts for important updates.',
                        icon: '/vite.svg',
                        tag: 'notification-enabled'
                      });
                    } else {
                      alert('Please enable notifications in your browser settings to receive alerts.');
                    }
                  }}
                  className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-lg hover:bg-green-200 transition-colors animate-pulse"
                  title="Enable notifications for alerts"
                >
                  🔔 Enable Alerts
                </button>
              )}

              {notificationsEnabled && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  ✅ Alerts On
                </span>
              )}

              {currentUser.isAdmin && (
                <button
                  onClick={() => setShowAdminDashboard(true)}
                  className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </button>
              )}
              <button
                onClick={() => {
                  setCurrentUser(null);
                  setShowLoginForm(true);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Event Thread
          </button>
        </div>

        {/* Filter and Sort Bar */}
        <div className="mb-6 space-y-4">
          {/* Category Filter */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Sort By</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSortBy('newest')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'newest'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🆕 Newest First
              </button>
              <button
                onClick={() => setSortBy('oldest')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'oldest'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ⏰ Oldest First
              </button>
              <button
                onClick={() => setSortBy('mostMembers')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'mostMembers'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👥 Most Members
              </button>
              <button
                onClick={() => setSortBy('expiringSoon')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'expiringSoon'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ⚡ Expiring Soon
              </button>
              <button
                onClick={() => setSortBy('mostActive')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'mostActive'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                💬 Most Active
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {filterCategory === 'all' ? 'All Threads' : `${categories.find(c => c.id === filterCategory)?.label} Threads`} ({getFilteredAndSortedThreads().length})
          </h2>
          {getFilteredAndSortedThreads().length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No active threads</h3>
              <p className="text-gray-600 mb-4">Be the first to create an event thread!</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Thread
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {getFilteredAndSortedThreads().map(thread => {
                const isCreator = thread.creatorId === currentUser.id;
                const isMember = thread.members.includes(currentUser.id);
                const hasPendingRequest = thread.pendingRequests.includes(currentUser.id);
                const hasPendingRequests = isCreator && thread.pendingRequests.length > 0;
                return (
                  <div key={thread.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{thread.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{thread.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{thread.creator}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{thread.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{getTimeRemaining(thread.expiresAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{thread.members.length} members</span>
                          {hasPendingRequests && (
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                              {thread.pendingRequests.length} pending
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {thread.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              <Hash className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {isCreator && (
                        <button
                          onClick={() => {
                            setEditingThread(thread);
                            setShowEditForm(true);
                          }}
                          className="px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                        >
                          Edit
                        </button>
                      )}
                      {isMember ? (
                        <button
                          onClick={() => setSelectedThread(thread)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-1"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Chat ({thread.chat.length})
                        </button>
                      ) : hasPendingRequest ? (
                        <button className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg flex-1 cursor-not-allowed">
                          Request Pending...
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            // Optimistic update
                            setThreads(prevThreads => 
                              prevThreads.map(t => 
                                t.id === thread.id 
                                  ? { ...t, pendingRequests: [...t.pendingRequests, currentUser.id] }
                                  : t
                              )
                            );

                            try {
                              await threadsAPI.requestJoin(thread.id, currentUser.id);
                              loadThreads();
                            } catch (error) {
                              alert('Error sending join request');
                              // Revert optimistic update on error
                              loadThreads();
                            }
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1"
                        >
                          <Plus className="w-4 h-4" />
                          Request to Join
                        </button>
                      )}
                      {hasPendingRequests && (
                        <button
                          onClick={() => setSelectedThread(thread)}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          Review Requests
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      {showCreateForm && <CreateThreadForm />}
      {showEditForm && <EditThreadForm />}
      {selectedThread && <ChatView />}
    </div>
  );
}

export default App;