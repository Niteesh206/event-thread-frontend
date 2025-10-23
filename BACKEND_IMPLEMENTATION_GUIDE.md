# Backend Implementation Guide for Prastha (Event Thread Frontend)

## Overview
This document provides complete instructions for implementing the backend API and Socket.io server to support the Prastha frontend application. The frontend is a React-based event management platform where users can create temporary event threads, chat in real-time, and share gossips.

---

## Project Setup

### Required Technologies
- **Node.js** (v16 or higher)
- **Express.js** (REST API framework)
- **Socket.io** (Real-time bidirectional communication)
- **MongoDB** or **PostgreSQL** (Database)
- **Mongoose** or **Sequelize** (ORM)
- **bcrypt** (Password hashing)
- **jsonwebtoken** (Optional: for token-based auth)
- **cors** (Cross-origin resource sharing)
- **dotenv** (Environment variables)

### Installation Command
```bash
npm init -y
npm install express socket.io mongoose bcrypt cors dotenv
npm install --save-dev nodemon
```

### Environment Variables (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prastha
# or
POSTGRES_URI=postgresql://localhost:5432/prastha

NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

---

## 1. Database Schema

### User Model
```javascript
{
  id: String (UUID or ObjectId),
  username: String (unique, required),
  password: String (hashed, required),
  isAdmin: Boolean (default: false),
  createdAt: Date (default: Date.now)
}
```

### Thread Model
```javascript
{
  id: String (UUID or ObjectId),
  title: String (required, max: 60),
  description: String (required, max: 200),
  creator: String (username, required),
  creatorId: String (user ID, required),
  location: String (required),
  tags: Array of Strings (required),
  members: Array of Strings (user IDs),
  pendingRequests: Array of Strings (user IDs),
  chat: Array of Objects [
    {
      id: String (UUID),
      user: String (username or 'Alert' or 'System'),
      userId: String (user ID),
      message: String (required),
      timestamp: Date (default: Date.now)
    }
  ],
  expiresAt: Date (required),
  createdAt: Date (default: Date.now)
}
```

### Gossip Model
```javascript
{
  id: String (UUID or ObjectId),
  content: String (required, max: 500),
  author: String (username, required),
  authorId: String (user ID, required),
  upvotes: Array of Strings (user IDs who upvoted),
  downvotes: Array of Strings (user IDs who downvoted),
  comments: Array of Objects [
    {
      id: String (UUID),
      author: String (username, required),
      authorId: String (user ID, required),
      text: String (required, max: 300),
      timestamp: Date (default: Date.now)
    }
  ],
  createdAt: Date (default: Date.now)
}
```

---

## 2. Authentication API Endpoints

### POST /api/auth/register
**Purpose:** Register a new user account

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": "user123",
    "username": "johndoe",
    "isAdmin": false,
    "createdAt": "2025-10-23T10:30:00Z"
  }
}
```

**Implementation:**
```javascript
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }
    
    // Check if username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = await User.create({
      username,
      password: hashedPassword,
      isAdmin: false
    });
    
    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        isAdmin: newUser.isAdmin,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
```

### POST /api/auth/login
**Purpose:** Login user (regular or admin)

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepassword123",
  "isAdmin": false
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": "user123",
    "username": "johndoe",
    "isAdmin": false
  }
}
```

**Implementation:**
```javascript
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, isAdmin } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check admin status if admin login
    if (isAdmin && !user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access denied'
      });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
```

---

## 3. Thread API Endpoints

### GET /api/threads
**Purpose:** Get all active threads

**Response:**
```json
{
  "success": true,
  "threads": [
    {
      "id": "thread123",
      "title": "Coffee & Code Meetup",
      "description": "Let's grab coffee and code together",
      "creator": "johndoe",
      "creatorId": "user123",
      "location": "Starbucks Downtown",
      "tags": ["tech", "coding", "social"],
      "members": ["user123", "user456"],
      "pendingRequests": ["user789"],
      "chat": [],
      "expiresAt": "2025-10-23T18:00:00Z",
      "createdAt": "2025-10-23T10:00:00Z"
    }
  ]
}
```

### POST /api/threads
**Purpose:** Create a new thread

**Request Body:**
```json
{
  "title": "Coffee & Code Meetup",
  "description": "Let's grab coffee and code together",
  "creator": "johndoe",
  "creatorId": "user123",
  "location": "Starbucks Downtown",
  "tags": ["tech", "coding"],
  "expiresAt": "2025-10-23T18:00:00Z"
}
```

**Implementation:**
```javascript
app.post('/api/threads', async (req, res) => {
  try {
    const threadData = {
      title: req.body.title,
      description: req.body.description,
      creator: req.body.creator,
      creatorId: req.body.creatorId,
      location: req.body.location,
      tags: req.body.tags,
      members: [req.body.creatorId], // Creator auto-joins
      pendingRequests: [],
      chat: [
        {
          id: generateId(),
          user: 'System',
          userId: 'system',
          message: `${req.body.creator} created this thread`,
          timestamp: new Date()
        }
      ],
      expiresAt: req.body.expiresAt
    };
    
    const newThread = await Thread.create(threadData);
    
    // IMPORTANT: Emit socket event for notifications
    io.emit('new-thread-created', {
      threadId: newThread.id,
      title: newThread.title,
      creator: newThread.creator,
      creatorId: newThread.creatorId
    });
    
    // Also emit general refresh
    io.emit('refresh-threads');
    
    res.status(201).json({
      success: true,
      thread: newThread
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
```

### PUT /api/threads/:id
**Purpose:** Update thread details (creator only)

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "location": "New Location",
  "tags": ["tag1", "tag2"],
  "userId": "user123"
}
```

### DELETE /api/threads/:id
**Purpose:** Delete a thread (creator or admin only)

**Query Params:** `?userId=user123`

### POST /api/threads/:id/join
**Purpose:** Request to join a thread

**Request Body:**
```json
{
  "userId": "user456"
}
```

**Implementation:**
```javascript
app.post('/api/threads/:id/join', async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    const { userId } = req.body;
    
    if (!thread.pendingRequests.includes(userId)) {
      thread.pendingRequests.push(userId);
      await thread.save();
      
      io.emit('refresh-threads');
    }
    
    res.json({ success: true, thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### POST /api/threads/:id/handle-request
**Purpose:** Approve/reject join request (creator only)

**Request Body:**
```json
{
  "userId": "user456",
  "approve": true,
  "requesterId": "user123"
}
```

**Implementation:**
```javascript
app.post('/api/threads/:id/handle-request', async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    const { userId, approve, requesterId } = req.body;
    
    // Verify requester is creator
    if (thread.creatorId !== requesterId) {
      return res.status(403).json({
        success: false,
        message: 'Only creator can handle requests'
      });
    }
    
    // Remove from pending
    thread.pendingRequests = thread.pendingRequests.filter(id => id !== userId);
    
    // Add to members if approved
    if (approve && !thread.members.includes(userId)) {
      thread.members.push(userId);
      
      // Add system message
      const user = await User.findById(userId);
      thread.chat.push({
        id: generateId(),
        user: 'System',
        userId: 'system',
        message: `${user.username} joined the thread`,
        timestamp: new Date()
      });
    }
    
    await thread.save();
    io.emit('refresh-threads');
    
    res.json({ success: true, thread });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### POST /api/threads/:id/message
**Purpose:** Send a message in thread chat

**Request Body:**
```json
{
  "user": "johndoe",
  "userId": "user123",
  "message": "Hello everyone!"
}
```

**Implementation:**
```javascript
app.post('/api/threads/:id/message', async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    const { user, userId, message } = req.body;
    
    const newMessage = {
      id: generateId(),
      user,
      userId,
      message,
      timestamp: new Date()
    };
    
    thread.chat.push(newMessage);
    await thread.save();
    
    // Emit to all clients in this thread room
    io.to(`thread-${thread.id}`).emit('new-message', newMessage);
    
    res.json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

---

## 4. Gossip API Endpoints

### GET /api/gossips
**Purpose:** Get all gossips with sorting

**Query Params:** `?sortBy=newest` (options: newest, oldest, trending)

**Response:**
```json
{
  "success": true,
  "gossips": [
    {
      "id": "gossip123",
      "content": "Did you hear about the new coffee shop?",
      "author": "johndoe",
      "authorId": "user123",
      "upvotes": ["user456"],
      "downvotes": [],
      "comments": [],
      "createdAt": "2025-10-23T10:00:00Z"
    }
  ]
}
```

### POST /api/gossips
**Purpose:** Create a new gossip

**Request Body:**
```json
{
  "content": "Did you hear about the new coffee shop?",
  "author": "johndoe",
  "authorId": "user123"
}
```

**Implementation:**
```javascript
app.post('/api/gossips', async (req, res) => {
  try {
    const gossipData = {
      content: req.body.content,
      author: req.body.author,
      authorId: req.body.authorId,
      upvotes: [],
      downvotes: [],
      comments: []
    };
    
    const newGossip = await Gossip.create(gossipData);
    
    // Emit socket event
    io.emit('gossip-created', newGossip);
    
    res.status(201).json({
      success: true,
      gossip: newGossip
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### DELETE /api/gossips/:id
**Purpose:** Delete a gossip (author or admin only)

**Query Params:** `?userId=user123`

### POST /api/gossips/:id/vote
**Purpose:** Upvote or downvote a gossip

**Request Body:**
```json
{
  "userId": "user123",
  "voteType": "upvote"
}
```

**Implementation:**
```javascript
app.post('/api/gossips/:id/vote', async (req, res) => {
  try {
    const gossip = await Gossip.findById(req.params.id);
    const { userId, voteType } = req.body;
    
    // Remove from both arrays first
    gossip.upvotes = gossip.upvotes.filter(id => id !== userId);
    gossip.downvotes = gossip.downvotes.filter(id => id !== userId);
    
    // Add to appropriate array
    if (voteType === 'upvote') {
      gossip.upvotes.push(userId);
    } else if (voteType === 'downvote') {
      gossip.downvotes.push(userId);
    }
    
    await gossip.save();
    io.emit('gossip-updated', gossip);
    
    res.json({ success: true, gossip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### POST /api/gossips/:id/comment
**Purpose:** Add a comment to a gossip

**Request Body:**
```json
{
  "author": "johndoe",
  "authorId": "user123",
  "text": "Great gossip!"
}
```

**Implementation:**
```javascript
app.post('/api/gossips/:id/comment', async (req, res) => {
  try {
    const gossip = await Gossip.findById(req.params.id);
    const { author, authorId, text } = req.body;
    
    const newComment = {
      id: generateId(),
      author,
      authorId,
      text,
      timestamp: new Date()
    };
    
    gossip.comments.push(newComment);
    await gossip.save();
    
    io.emit('gossip-comment-added', { gossipId: gossip.id, comment: newComment });
    
    res.json({ success: true, comment: newComment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### DELETE /api/gossips/:gossipId/comments/:commentId
**Purpose:** Delete a comment (author or admin only)

**Query Params:** `?userId=user123`

---

## 5. Admin API Endpoints

### GET /api/admin/dashboard/:userId
**Purpose:** Get admin dashboard data

**Response:**
```json
{
  "success": true,
  "data": {
    "totalThreads": 25,
    "activeUsers": 50,
    "totalUsers": 100,
    "threads": [...],
    "users": [...]
  }
}
```

**Implementation:**
```javascript
app.get('/api/admin/dashboard/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    
    const threads = await Thread.find().populate('memberDetails');
    const users = await User.find().select('-password');
    
    res.json({
      success: true,
      data: {
        totalThreads: threads.length,
        activeUsers: users.filter(u => /* active logic */).length,
        totalUsers: users.length,
        threads,
        users
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

---

## 6. Socket.io Implementation

### Server Setup
```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Make io accessible in routes
app.set('io', io);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);
  
  // Join thread room
  socket.on('join-thread', (threadId) => {
    socket.join(`thread-${threadId}`);
    console.log(`User ${socket.id} joined thread-${threadId}`);
  });
  
  // Leave thread room
  socket.on('leave-thread', (threadId) => {
    socket.leave(`thread-${threadId}`);
    console.log(`User ${socket.id} left thread-${threadId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});
```

### Socket Events to Emit

1. **new-thread-created** - When thread is created
   ```javascript
   io.emit('new-thread-created', {
     threadId, title, creator, creatorId
   });
   ```

2. **refresh-threads** - When threads need to be refreshed
   ```javascript
   io.emit('refresh-threads');
   ```

3. **new-message** - When message is sent in thread
   ```javascript
   io.to(`thread-${threadId}`).emit('new-message', messageObject);
   ```

4. **gossip-created** - When gossip is created
   ```javascript
   io.emit('gossip-created', gossipObject);
   ```

5. **gossip-updated** - When gossip is voted on
   ```javascript
   io.emit('gossip-updated', gossipObject);
   ```

6. **gossip-comment-added** - When comment is added
   ```javascript
   io.emit('gossip-comment-added', { gossipId, comment });
   ```

7. **gossip-deleted** - When gossip is deleted
   ```javascript
   io.emit('gossip-deleted', { gossipId });
   ```

---

## 7. Complete Server.js Example

```javascript
require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.set('io', io);

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// Import routes
const authRoutes = require('./routes/auth');
const threadRoutes = require('./routes/threads');
const gossipRoutes = require('./routes/gossips');
const adminRoutes = require('./routes/admin');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/threads', threadRoutes);
app.use('/api/gossips', gossipRoutes);
app.use('/api/admin', adminRoutes);

// Socket.io
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);
  
  socket.on('join-thread', (threadId) => {
    socket.join(`thread-${threadId}`);
  });
  
  socket.on('leave-thread', (threadId) => {
    socket.leave(`thread-${threadId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = { app, io };
```

---

## 8. Testing Checklist

### Authentication
- [ ] User registration works
- [ ] Username uniqueness validation
- [ ] Password hashing
- [ ] User login (regular)
- [ ] Admin login
- [ ] Invalid credentials handling

### Threads
- [ ] Create thread
- [ ] Get all threads
- [ ] Update thread (creator only)
- [ ] Delete thread (creator/admin)
- [ ] Join request
- [ ] Approve/reject requests
- [ ] Send messages
- [ ] Real-time message updates

### Gossips
- [ ] Create gossip
- [ ] Get all gossips with sorting
- [ ] Upvote/downvote
- [ ] Add comment
- [ ] Delete gossip (author/admin)
- [ ] Delete comment (author/admin)

### Real-time Features
- [ ] New thread notifications
- [ ] Thread refresh on create
- [ ] Chat messages update in real-time
- [ ] Gossip updates in real-time

### Admin
- [ ] Dashboard data retrieval
- [ ] View all threads
- [ ] View all users
- [ ] Delete any thread

---

## 9. Frontend API Base URL

Update your frontend `src/services/api.js` to point to your backend:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';
```

---

## 10. Deployment Considerations

### Environment Variables
- Set `NODE_ENV=production`
- Configure database connection string
- Set proper `CORS_ORIGIN`

### Security
- Implement rate limiting
- Add helmet for security headers
- Sanitize user inputs
- Implement JWT tokens (optional)
- Add input validation middleware

### Performance
- Add database indexing (username, threadId, etc.)
- Implement caching for frequently accessed data
- Use compression middleware
- Set up load balancing for scale

---

## Support
For questions or issues, refer to:
- Express.js documentation: https://expressjs.com
- Socket.io documentation: https://socket.io
- MongoDB/Mongoose: https://mongoosejs.com

---

**Last Updated:** October 23, 2025
**Frontend Version:** Latest with notification support
