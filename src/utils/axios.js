// src/utils/axios.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080.com/api',
    withCredentials: true
});

instance.interceptors.request.use((config) => {
    const member = JSON.parse(sessionStorage.getItem('member'));
    if (member && member.token) {  // Assuming 'token' is stored in 'member'
        config.headers.Authorization = `Bearer ${member.token}`;
    }
    return config;
});

export default instance;
