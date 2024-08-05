// src/utils/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  const member = JSON.parse(sessionStorage.getItem("users"));
  const token = localStorage.getItem("accessToken");
  if (member && member.token) {
    // Assuming 'token' is stored in 'member'
    // config.headers.Authorization = `Bearer ${member.token}`;
  }
  config.headers.Authorization = `Bearer ${token}`;
  console.log("Starting Request", config);
  return config;
});

export default instance;
