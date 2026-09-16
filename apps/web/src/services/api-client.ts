import axios, { AxiosError } from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor: Attach JWT Token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Standardize error extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[] }>) => {
    let message = 'An unexpected error occurred. Please try again.';
    if (error.response?.data?.message) {
      const msg = error.response.data.message;
      message = Array.isArray(msg) ? msg.join(', ') : msg;
    } else if (error.message) {
      message = error.message;
    }

    // Auto logout on 401 Unauthorized if not on auth endpoints
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      // Avoid redirecting if guest user
      const hasToken = !!localStorage.getItem('token');
      if (hasToken) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    return Promise.reject(new Error(message));
  },
);
