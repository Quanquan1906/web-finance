import axios, { AxiosInstance } from 'axios';
import { API_URL } from '@/shared/config';
import qs from 'qs';

let isLoggingOut = false;

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' })
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken') || import.meta.env.VITE_ACCESS_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isLoggingOut) {
      isLoggingOut = true;

      alert('Phiên đăng nhập đã hết hạn');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);
