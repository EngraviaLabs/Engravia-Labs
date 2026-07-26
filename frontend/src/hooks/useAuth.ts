import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectUser, selectIsAuthenticated, clearCredentials, setCredentials } from '../store/slices/authSlice';
import api from '../lib/api';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  };

  const logout = () => {
    dispatch(clearCredentials());
    router.push('/');
    toast.success('Signed out successfully');
  };

  const register = async (payload: { name: string; email: string; password: string; phone?: string }) => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  };

  return { user, isAuthenticated, login, logout, register };
};
