import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../auth/authStore';

const PRIMARY_URL = process.env.EXPO_PUBLIC_PRIMARY_API_URL || 'https://pocketca-3tl1.onrender.com/api/v1';
const SECONDARY_URL = process.env.EXPO_PUBLIC_SECONDARY_API_URL || 'https://pocketca-backend-production.up.railway.app/api/v1';

const BACKENDS = [PRIMARY_URL, SECONDARY_URL];
let currentActiveIndex = 0;

export const apiClient = axios.create({
  baseURL: BACKENDS[currentActiveIndex],
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach Auth Token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from in-memory store
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Ensure the request uses the active base URL
    config.baseURL = BACKENDS[currentActiveIndex];
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling & Multi-Backend Fallback
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check for Network Error (Server down, timeout, 502/503)
    const isNetworkError = 
      !error.response || 
      error.code === 'ECONNABORTED' || 
      error.code === 'ERR_NETWORK' ||
      error.response?.status === 502 || 
      error.response?.status === 503;

    if (isNetworkError && !originalRequest._isRetryFromFallback) {
      // Switch to the next backend
      const nextIndex = (currentActiveIndex + 1) % BACKENDS.length;
      console.warn(`[API] Backend ${BACKENDS[currentActiveIndex]} failed. Switching to ${BACKENDS[nextIndex]}`);
      
      currentActiveIndex = nextIndex;
      apiClient.defaults.baseURL = BACKENDS[currentActiveIndex];
      originalRequest.baseURL = BACKENDS[currentActiveIndex];
      originalRequest._isRetryFromFallback = true;
      
      // Retry request on the new backend
      return apiClient(originalRequest);
    }
    
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refresh_token');
        if (!refreshToken) {
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        const { data } = await axios.post(`${BACKENDS[currentActiveIndex]}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = data.data;

        await useAuthStore.getState().updateAccessToken(accessToken, newRefreshToken);
        
        processQueue(null, accessToken);
        originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
        
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        useAuthStore.getState().logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
