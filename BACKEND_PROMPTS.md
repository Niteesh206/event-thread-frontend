# Backend Development Prompt for Prastha

## Quick Start Prompt for AI Assistants

```
I need you to build a complete Node.js backend for a React event management application called "Prastha". 

The application allows users to:
1. Create temporary event threads that expire after a set time
2. Join threads and chat in real-time
3. Share and comment on gossips (anonymous posts)
4. Receive browser notifications for new threads

Please create a backend with:

TECH STACK:
- Express.js for REST API
- Socket.io for real-time features
- MongoDB with Mongoose (or PostgreSQL with Sequelize)
- bcrypt for password hashing
- CORS enabled

DATABASE MODELS:
1. User: { id, username, password(hashed), isAdmin, createdAt }
2. Thread: { id, title, description, creator, creatorId, location, tags[], members[], pendingRequests[], chat[], expiresAt, createdAt }
3. Gossip: { id, content, author, authorId, upvotes[], downvotes[], comments[], createdAt }

REQUIRED API ENDPOINTS:

Authentication:
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user (with isAdmin check)

Threads:
- GET /api/threads - Get all threads
- POST /api/threads - Create thread (emit 'new-thread-created' socket event)
- PUT /api/threads/:id - Update thread (creator only)
- DELETE /api/threads/:id - Delete thread (creator/admin)
- POST /api/threads/:id/join - Request to join
- POST /api/threads/:id/handle-request - Approve/reject join request
- POST /api/threads/:id/message - Send chat message

Gossips:
- GET /api/gossips?sortBy=newest - Get all gossips
- POST /api/gossips - Create gossip
- DELETE /api/gossips/:id - Delete gossip (author/admin)
- POST /api/gossips/:id/vote - Upvote/downvote
- POST /api/gossips/:id/comment - Add comment
- DELETE /api/gossips/:gossipId/comments/:commentId - Delete comment

Admin:
- GET /api/admin/dashboard/:userId - Get dashboard data (admin only)

SOCKET.IO EVENTS TO EMIT:
1. 'new-thread-created' - { threadId, title, creator, creatorId }
2. 'refresh-threads' - (no data)
3. 'new-message' - Emit to specific thread room
4. 'gossip-created', 'gossip-updated', 'gossip-comment-added', 'gossip-deleted'

IMPORTANT FEATURES:
- Creator automatically joins their thread as first member
- Support thread rooms for Socket.io (join-thread, leave-thread events)
- Add system messages to chat (e.g., "User joined the thread")
- Implement proper error handling and validation
- Return success/error responses in consistent format

Please provide complete, production-ready code with proper structure, error handling, and comments.
```

## Alternative Detailed Prompt

```
Build a complete backend server for Prastha - an event management platform.

PROJECT REQUIREMENTS:

1. SERVER SETUP
   - Node.js + Express.js
   - Socket.io for real-time communication
   - MongoDB/Mongoose or PostgreSQL/Sequelize
   - Port: 5000
   - CORS enabled for http://localhost:5173

2. USER AUTHENTICATION
   - Registration endpoint with username/password
   - Login endpoint supporting regular and admin users
   - Password hashing with bcrypt
   - Return user object: { id, username, isAdmin }

3. EVENT THREADS SYSTEM
   - Users create temporary threads with title, description, location, tags
   - Threads expire at specified time
   - Creator auto-joins as first member
   - Other users request to join
   - Creator approves/rejects join requests
   - Members chat in real-time within threads
   - Support system messages (user joined, etc.)
   - Support alert messages from creator

4. GOSSIPS SYSTEM
   - Users post short gossips (max 500 chars)
   - Upvote/downvote functionality
   - Comment system (max 300 chars per comment)
   - Sorting: newest, oldest, trending
   - Users can delete their own gossips
   - Admins can delete any gossip/comment

5. REAL-TIME FEATURES (Socket.io)
   - Emit 'new-thread-created' when thread is created (for browser notifications)
   - Emit 'refresh-threads' for general thread updates
   - Emit 'new-message' to thread room for chat messages
   - Emit gossip events: created, updated, comment-added, deleted
   - Support thread rooms: join-thread, leave-thread

6. ADMIN FEATURES
   - Dashboard endpoint with stats
   - View all threads with member details
   - View all users
   - Delete any thread or gossip

7. DATABASE SCHEMA
   User: id, username, password, isAdmin, createdAt
   Thread: id, title(60), description(200), creator, creatorId, location, tags, 
           members, pendingRequests, chat[{id, user, userId, message, timestamp}], 
           expiresAt, createdAt
   Gossip: id, content(500), author, authorId, upvotes, downvotes, 
           comments[{id, author, authorId, text, timestamp}], createdAt

8. API RESPONSE FORMAT
   Success: { success: true, data/user/thread/gossip: {...} }
   Error: { success: false, message: "error description" }

9. CRITICAL SOCKET EVENTS
   When creating a thread, emit: io.emit('new-thread-created', {threadId, title, creator, creatorId})
   When sending message: io.to(`thread-${threadId}`).emit('new-message', messageObject)

Please create:
1. Complete server.js with Socket.io setup
2. All route handlers with proper validation
3. Database models/schemas
4. Error handling middleware
5. Environment variable setup (.env example)
6. README with setup instructions

Ensure code is clean, well-commented, and production-ready.
```

## Copy-Paste Quick Prompt

```
Create Node.js backend for event management app:
- Express + Socket.io + MongoDB
- Auth: register/login (username/password, bcrypt)
- Threads: CRUD + join requests + real-time chat
- Gossips: CRUD + vote + comments
- Admin dashboard
- Socket events: new-thread-created (for notifications), refresh-threads, new-message
- Thread chat with system messages
- Full error handling
See BACKEND_IMPLEMENTATION_GUIDE.md for detailed specs.
```

---

## Usage Instructions

1. **For AI Assistants (Claude, GPT, etc.):**
   - Copy the "Quick Start Prompt" section
   - Paste into the AI chat
   - AI will generate complete backend code

2. **For Human Developers:**
   - Read BACKEND_IMPLEMENTATION_GUIDE.md for complete documentation
   - Follow the API endpoint specifications
   - Implement Socket.io events as described
   - Test with provided checklist

3. **For Team Handoff:**
   - Share both documents
   - Point to specific sections for different features
   - Reference the example implementations

---

**Related Files:**
- `BACKEND_IMPLEMENTATION_GUIDE.md` - Complete detailed documentation
- `BACKEND_NOTIFICATION_REQUIREMENTS.md` - Notification-specific requirements
- `src/services/api.js` - Frontend API configuration
