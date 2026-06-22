'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppDispatch } from '../../lib/store/hooks';
import { setUser, clearUser } from '../../lib/store/slices/authSlice';
import { getMe } from '../../services/public/auth.service';

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  const { data, isSuccess, isError } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const data = await getMe();
        if (data?.user) {
          dispatch(setUser(data.user));
        }
        return data;
      } catch (error) {
        dispatch(clearUser());
        throw error;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isSuccess && data) dispatch(setUser(data.user));
    if (isError) dispatch(clearUser());
  }, [isSuccess, isError, data, dispatch]);

  return null;
}
