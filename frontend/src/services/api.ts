import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      error.response.data.code === 'token_not_valid' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem('refresh');
      try {
        const res = await axios.post('http://localhost:8000/api/token/refresh/', { refresh });
        localStorage.setItem('access', res.data.access);

        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
