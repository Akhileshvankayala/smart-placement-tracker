import axios from 'axios';

let apiURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Automatically append /api if it is missing from VITE_API_URL
if (apiURL && !apiURL.endsWith('/api') && !apiURL.endsWith('/api/')) {
  apiURL = apiURL.endsWith('/') ? `${apiURL}api` : `${apiURL}/api`;
}

const api = axios.create({
  baseURL: apiURL, // Backend API URL
});

// Add a request interceptor to add the JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
