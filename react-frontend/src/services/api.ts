import axios from 'axios';
// API configuration and interceptors
import { ErrorHandler } from '../utils/errorHandler';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
  withCredentials: true, // Important for Flask session cookies
});

// Request interceptor for adding auth headers if needed
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens or headers here in future tasks
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const appError = ErrorHandler.handleApiError(error);
    
    // Log error for debugging
    console.error('API Error:', appError);
    
    // Don't automatically redirect on auth errors
    // Let the components handle authentication state
    return Promise.reject(appError);
  }
);

export default api;