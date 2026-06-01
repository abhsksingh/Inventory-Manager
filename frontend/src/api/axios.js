import axios from 'axios';

// In production (nginx), /api/* is proxied to backend
// In dev (Vite), same proxy is configured in vite.config.js
// For standalone deployment (Vercel/Fly), set VITE_API_URL to backend URL
const BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${BASE}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail?.detail ||
      error.response?.data?.detail ||
      error.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
