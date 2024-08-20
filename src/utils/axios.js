// src/utils/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080",
  // baseURL: 'http://223.130.160.171:8080',
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default instance;
