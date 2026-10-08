import axios from 'axios';

// Base backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─────────────────────────────────────────────
// Request Interceptor
// Attach token automatically
// ─────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────
// Response Interceptor
// Handle Unauthorized Errors
// ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Prevent infinite redirect loop
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────
// AUTH API
// ─────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),

  login: (data) => api.post('/auth/login', data),

  getMe: () => api.get('/auth/me'),
};

// ─────────────────────────────────────────────
// PROPERTY API
// ─────────────────────────────────────────────
export const propertyAPI = {
  getAll: (params) => api.get('/properties', { params }),

  getById: (id) => api.get(`/properties/${id}`),

  create: (data) => api.post('/properties', data),

  update: (id, data) => api.put(`/properties/${id}`, data),

  delete: (id) => api.delete(`/properties/${id}`),

  getMyListings: (params) =>
    api.get('/properties/my-listings', { params }),
};

// ─────────────────────────────────────────────
// FAVORITES API
// ─────────────────────────────────────────────
export const favoriteAPI = {
  getAll: () => api.get('/favorites'),

  toggle: (propertyId) =>
    api.post('/favorites', { propertyId }),

  check: (propertyId) =>
    api.get(`/favorites/check/${propertyId}`),
};

// ─────────────────────────────────────────────
// INQUIRIES API
// ─────────────────────────────────────────────
export const inquiryAPI = {
  create: (data) => api.post('/inquiries', data),

  getAll: (params) =>
    api.get('/inquiries', { params }),

  reply: (id, reply) =>
    api.put(`/inquiries/${id}/reply`, { reply }),

  delete: (id) => api.delete(`/inquiries/${id}`),
};

// ─────────────────────────────────────────────
// ADMIN API
// ─────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),

  getUsers: (params) =>
    api.get('/admin/users', { params }),

  updateUser: (id, data) =>
    api.put(`/admin/users/${id}`, data),

  deleteUser: (id) =>
    api.delete(`/admin/users/${id}`),

  getProperties: (params) =>
    api.get('/admin/properties', { params }),

  updatePropertyStatus: (id, status) =>
    api.put(`/admin/properties/${id}/status`, {
      status,
    }),
};

// ─────────────────────────────────────────────
// USER API
// ─────────────────────────────────────────────
export const userAPI = {
  updateProfile: (data) =>
    api.put('/users/profile', data),
};

export default api;