import { create } from 'zustand';

interface AdminUser {
  id: string; name: string; email: string; role: string; avatar?: string;
}

interface AuthState {
  user: AdminUser | null;
  isLoading: boolean;
  setUser: (user: AdminUser | null) => void;
  hydrate: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => {
    set({ user, isLoading: false });
    if (typeof window !== 'undefined') {
      if (user) localStorage.setItem('admin_user', JSON.stringify(user));
      else localStorage.removeItem('admin_user');
    }
  },
  hydrate: () => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('admin_user');
      const token = localStorage.getItem('admin_accessToken');
      if (raw && token) {
        try { set({ user: JSON.parse(raw), isLoading: false }); return; } catch {}
      }
    }
    set({ isLoading: false });
  },
  logout: () => {
    localStorage.removeItem('admin_accessToken');
    localStorage.removeItem('admin_refreshToken');
    localStorage.removeItem('admin_user');
    set({ user: null });
  },
}));
