// import axios from 'axios';

// // Use environment variable for API URL
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// // Create axios instance with default config
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Request interceptor for adding auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for handling errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized access
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;
import axios from 'axios';

// Use environment variable for API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username, password, isAdmin) => {
    return api.post('/api/auth/login', { username, password, isAdmin });
  }
};

// Threads API
export const threadsAPI = {
  getAll: () => {
    return api.get('/api/threads');
  },
  
  create: (threadData) => {
    return api.post('/api/threads', threadData);
  },
  
  update: (threadId, updateData) => {
    return api.put(`/api/threads/${threadId}`, updateData);
  },
  
  delete: (threadId, userId) => {
    return api.delete(`/api/threads/${threadId}`, { data: { userId } });
  },
  
  requestJoin: (threadId, userId) => {
    return api.post(`/api/threads/${threadId}/request`, { userId });
  },
  
  handleRequest: (threadId, userId, approve, creatorId) => {
    return api.post(`/api/threads/${threadId}/handle-request`, { 
      userId, 
      approve, 
      creatorId 
    });
  },
  
  sendMessage: (threadId, messageData) => {
    return api.post(`/api/threads/${threadId}/message`, messageData);
  }
};

// Admin API
export const adminAPI = {
  getDashboard: (userId) => {
    return api.get(`/api/admin/dashboard/${userId}`);
  }
};

export default api;