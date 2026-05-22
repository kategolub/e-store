import { RootState } from '@/lib/store';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../lib/store/hooks';
import { setUser, clearUser } from '../lib/store/slices/authSlice';
import { getMe } from '../services/public/auth.service';
import { useEffect } from 'react';
import { login, register, logout } from '../services/public/auth.service';
import { LoginDto, RegisterDto } from '@/types/auth';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state: RootState) => state.auth.user);
    const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);

    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ['me'],
        queryFn: getMe,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (isSuccess && data) dispatch(setUser(data.user));
        if (isError) dispatch(clearUser());
    }, [isSuccess, isError, data, dispatch]);

    const handleLogin = async (dto: LoginDto) => {
        const { user } = await login(dto);
        dispatch(setUser(user));
        return user;
    };

    const handleRegister = async (dto: RegisterDto) => {
        const { user } = await register(dto);
        dispatch(setUser(user));
        return user;
    };

    const handleLogout = async () => {
        await logout();
        dispatch(clearUser());
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
    };
};
