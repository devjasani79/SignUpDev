// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Set up token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // could use cookie if needed
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
