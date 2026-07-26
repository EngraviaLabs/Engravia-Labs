import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface AuthState { user: User | null; accessToken: string | null; isLoading: boolean; }

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, accessToken: null, isLoading: true } as AuthState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isLoading = false;
      if (typeof window !== 'undefined') localStorage.setItem('accessToken', action.payload.accessToken);
    },
    clearCredentials: (state) => {
      state.user = null; state.accessToken = null; state.isLoading = false;
      if (typeof window !== 'undefined') { localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken'); }
    },
    setLoading: (state, action: PayloadAction<boolean>) => { state.isLoading = action.payload; },
    updateUser: (state, action: PayloadAction<Partial<User>>) => { if (state.user) Object.assign(state.user, action.payload); },
  },
});

export const { setCredentials, clearCredentials, setLoading, updateUser } = authSlice.actions;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => !!state.auth.user;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export default authSlice.reducer;
