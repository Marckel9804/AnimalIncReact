// src/utils/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const member = JSON.parse(sessionStorage.getItem('users'));
  if (member && member.token) {  // Assuming 'token' is stored in 'member'
    config.headers.Authorization = `Bearer ${member.token}`;
  }
  return config;
});

export default instance;