import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
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

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (email, password) => 
    api.post('/auth/register', { email, password }),
  
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
};

// Mood API calls
export const moodAPI = {
  createMoodEntry: (mood, note) => 
    api.post('/moods', { mood, note }),
  
  getMoodEntries: (page = 1, limit = 10) => 
    api.get(`/moods?page=${page}&limit=${limit}`),
  
  updateMoodEntry: (id, mood, note) => 
    api.put(`/moods/${id}`, { mood, note }),
  
  deleteMoodEntry: (id) => 
    api.delete(`/moods/${id}`),
  
  getMoodAnalytics: () => 
    api.get('/moods/analytics'),
};

export default api;