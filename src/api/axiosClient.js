import axios from 'axios';
import { getCsrfToken } from './csrf';


// Set this to your Django backend base URL (see API_CONTRACT.md "Base URL").
// Prefer an env var so it's easy to change between dev/staging/prod.
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';


export const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // required for session cookies (credentials: include)
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach CSRF token automatically for state-changing requests.
axiosClient.interceptors.request.use((config) => {
  const method = (config.method || 'get').toLowerCase();
  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
  }
  // Let the browser set the correct multipart boundary for file uploads.
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Normalize error responses so callers get a consistent shape.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = {
      status: error.response?.status ?? null,
      data: error.response?.data ?? null,
      message:
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Something went wrong. Please try again.',
      original: error,
    };
    return Promise.reject(normalized);
  }
);

export default axiosClient;
