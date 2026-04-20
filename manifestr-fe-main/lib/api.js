import axios from 'axios';
import Router from 'next/router';

// Default base URL - Production vs Development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 
    (process.env.NODE_ENV === 'production' 
        ? 'https://api.manifestr.ai' 
        : 'http://localhost:8000');

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Required for HttpOnly cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedQueue = [];
let isRedirectingToLogin = false; // Prevent multiple simultaneous redirects

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Request interceptor for API calls
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Don't try to refresh token on login/signup requests - just let them fail
        const isAuthRequest = originalRequest.url?.includes('/auth/login') ||
            originalRequest.url?.includes('/auth/signup') ||
            originalRequest.url?.includes('/auth/refresh-token');

        // Prevent infinite loops
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call refresh token endpoint (it uses the HttpOnly cookie)
                const response = await api.post('/auth/refresh-token');
                const { accessToken } = response.data.details;

                localStorage.setItem('accessToken', accessToken);
                api.defaults.headers.common.Authorization = 'Bearer ' + accessToken;

                processQueue(null, accessToken);

                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                
                // SILENT LOGOUT - Don't show error popup to user
                if (typeof window !== 'undefined' && !isRedirectingToLogin) {
                    isRedirectingToLogin = true;

                    // Clear ALL auth data
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                    localStorage.removeItem('pendingUser');
                    localStorage.removeItem('pendingVerificationEmail');

                    // Use replace to avoid stacking URLs
                    Router.replace('/login');

                    // Reset flag after redirect
                    setTimeout(() => {
                        isRedirectingToLogin = false;
                    }, 1000);
                }
                
                // DON'T reject - return a resolved promise to prevent error popup
                return Promise.resolve({
                    data: { status: 'error', message: 'Session expired' }
                });
            } finally {
                isRefreshing = false;
            }
        }

        // If we get 401 on auth requests themselves, clear everything and redirect
        if (error.response?.status === 401 && isAuthRequest && typeof window !== 'undefined' && !isRedirectingToLogin) {
            isRedirectingToLogin = true;

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            localStorage.removeItem('pendingUser');
            localStorage.removeItem('pendingVerificationEmail');

            Router.replace('/login');

            setTimeout(() => {
                isRedirectingToLogin = false;
            }, 1000);
            
            // Return resolved promise to prevent error popup
            return Promise.resolve({
                data: { status: 'error', message: 'Session expired' }
            });
        }

        return Promise.reject(error);
    }
);

export default api;
