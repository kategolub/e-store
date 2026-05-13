import { apiFetch } from '../../lib/api';
import { AuthResponse } from '../../types/auth';
import { LoginDto, RegisterDto } from '../../types/auth';

export const login = async (dto: LoginDto): Promise<AuthResponse> => {
    return apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(dto),
    });

};

export const register = async (dto: RegisterDto): Promise<AuthResponse> => {
    return apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(dto),
    });
};

export const logout = async (): Promise<void> => {
  return apiFetch<void>('/auth/logout', {
    method: 'POST',
  });
};

export const getMe = async (): Promise<AuthResponse> => {
  return apiFetch<AuthResponse>('/auth/me');
};
