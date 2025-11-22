// src/utils/axiosClient.ts
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const axiosClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// attach token from localStorage to each request (if any)
axiosClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

export default axiosClient;

