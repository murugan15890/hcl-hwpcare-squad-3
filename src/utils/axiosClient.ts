// src/utils/axiosClient.ts
import axios from 'axios';

const API_BASE ='http://localhost:4000';

const axiosClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;
