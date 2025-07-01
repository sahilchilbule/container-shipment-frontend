// src/api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000', // Your Laravel API base URL
    withCredentials: true, // Important for sending cookies (Sanctum session)
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Interceptor to get CSRF cookie for initial requests (Laravel Sanctum SPA authentication)
api.interceptors.request.use(async config => {
    if (['post', 'put', 'patch', 'delete'].includes(config.method) && !config.url.includes('/login') && !config.url.includes('/register') && !config.url.includes('/sanctum/csrf-cookie')) {
        try {
            await api.get('/sanctum/csrf-cookie');
        } catch (error) {
            console.error("Failed to get CSRF cookie:", error);
            // Handle error, e.g., redirect to login or show a message
        }
    }
    return config;
});

export default api;
