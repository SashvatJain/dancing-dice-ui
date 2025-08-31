// src/config/endpoints.ts

export const ENDPOINTS = {
    localhost: 'http://localhost:8000',
    production: 'https://your-production-url.com', // Replace with actual production URL
};

// Set environment manually here: 'localhost' or 'production'
export const API_ENV: 'localhost' | 'production' = 'localhost';

export const getApiBaseUrl = () => ENDPOINTS[API_ENV];
