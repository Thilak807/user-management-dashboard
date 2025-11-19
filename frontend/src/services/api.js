import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

const unwrap = (promise) => promise.then((response) => response.data);

export const authApi = {
  register: (payload) => unwrap(api.post('/auth/register', payload)),
  login: (payload) => unwrap(api.post('/auth/login', payload)),
  currentUser: () => unwrap(api.get('/auth/me')),
};

export const profileApi = {
  me: () => unwrap(api.get('/profile/me')),
};

export const taskApi = {
  list: (params) => unwrap(api.get('/tasks', { params })),
  create: (payload) => unwrap(api.post('/tasks', payload)),
  update: (id, payload) => unwrap(api.put(`/tasks/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/tasks/${id}`)),
  bulkUpdate: (payload) => unwrap(api.post('/tasks/bulk-update', payload)),
  bulkDelete: (payload) => unwrap(api.post('/tasks/bulk-delete', payload)),
  statistics: () => unwrap(api.get('/tasks/statistics')),
};

export const templateApi = {
  list: () => unwrap(api.get('/templates')),
  get: (id) => unwrap(api.get(`/templates/${id}`)),
  create: (payload) => unwrap(api.post('/templates', payload)),
  update: (id, payload) => unwrap(api.put(`/templates/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/templates/${id}`)),
  createTask: (id) => unwrap(api.post(`/templates/${id}/create-task`)),
};

export const activityApi = {
  list: (params) => unwrap(api.get('/activity', { params })),
};

export const userApi = {
  updateProfile: (payload) => unwrap(api.put('/user/profile', payload)),
  changePassword: (payload) => unwrap(api.put('/user/password', payload)),
};

