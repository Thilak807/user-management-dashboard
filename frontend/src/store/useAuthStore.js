import { create } from 'zustand';

const getInitialToken = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('token');
};

export const useAuthStore = create((set) => ({
  token: getInitialToken(),
  user: null,
  setCredentials: ({ token, user }) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('token', token);
    }
    set({ token, user });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('token');
    }
    set({ token: null, user: null });
  },
}));

