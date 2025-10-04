

import axios from 'axios';
import { BASE_URL } from './config';

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL|| 'http://localhost:5000/api', // Change for production
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: true, // For cookies (if using JWT in cookies)
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // If using token-based auth
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add response interceptor for handling 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized: Redirecting to login...');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;


