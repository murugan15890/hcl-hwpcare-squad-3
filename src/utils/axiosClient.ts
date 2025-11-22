import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store } from '@/app/store';
import { logout } from '@/features/auth/authSlice';
import { MOCK_API_CONFIG } from './constants';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || MOCK_API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - attach JWT token
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 and logout
axiosClient.interceptors.response.use(
  (response) => {
    // JSON Server returns arrays directly, wrap single item responses if needed
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;


