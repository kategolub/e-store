import { useAppDispatch, useAppSelector } from '../lib/store/hooks';
import { setUser, clearUser } from '../lib/store/slices/authSlice';
import { login, register, logout } from '../services/public/auth.service';
import { LoginDto, RegisterDto } from '@/types/auth';
import { useQueryClient } from '@tanstack/react-query';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const user = useAppSelector(state => state.auth.user);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const isInitialized = useAppSelector(state => state.auth.isInitialized);

  const handleLogin = async (dto: LoginDto) => {
    const { user } = await login(dto);
    dispatch(setUser(user));
    queryClient.invalidateQueries({ queryKey: ['me'] });
    return user;
  };

  const handleRegister = async (dto: RegisterDto) => {
    const { user } = await register(dto);
    dispatch(setUser(user));
    queryClient.invalidateQueries({ queryKey: ['me'] });
    return user;
  };

  const handleLogout = async () => {
    await logout();
    dispatch(clearUser());
    queryClient.invalidateQueries({ queryKey: ['me'] });
  };

  return {
    user,
    isAuthenticated,
    isInitialized,
    isLoading: !isInitialized,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
};
