import axios from 'axios';
import { getAccessToken, isTokenExpired, refreshAccessToken, logout } from './auth';


const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});


let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

const onRefreshError = (error: unknown) => {
  refreshSubscribers = [];
  logout();
  if (typeof window !== 'undefined') {
    window.location.href = '/signin';
  }
  return Promise.reject(error);
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    let token = getAccessToken();
    
    if (token && isTokenExpired(token)) {
      try {
        token = await refreshTokenIfNeeded();
      } catch (error) {
        return onRefreshError(error);
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If unauthorized and not a retry attempt
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Wait for token refresh if already in progress
        if (isRefreshing) {
          return new Promise((resolve) => {
            subscribeTokenRefresh((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            });
          });
        }
        
        // Otherwise refresh the token
        const token = await refreshTokenIfNeeded();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        return onRefreshError(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// This function manages token refresh and prevents multiple simultaneous refresh attempts
async function refreshTokenIfNeeded() {
  const token = getAccessToken();
  
  // If token is valid, return it
  if (token && !isTokenExpired(token)) {
    return token;
  }
  
  // Start refresh process if not already in progress
  if (!isRefreshing) {
    isRefreshing = true;
    
    try {
      const newToken = await refreshAccessToken(refreshApi);
      isRefreshing = false;
      onRefreshed(newToken);
      return newToken;
    } catch (error) {
      isRefreshing = false;
      throw error;
    }
  }
  
  return new Promise((resolve) => {
    subscribeTokenRefresh((token) => {
      resolve(token);
    });
  });
}

export default api;
export { refreshApi };