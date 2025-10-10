'use client';

import { useMemo } from 'react';
import axios, { AxiosInstance } from 'axios';
import { useSession } from 'next-auth/react';

export function useApi(): AxiosInstance {
  const { data: session } = useSession();

  return useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        'Content-Type': 'application/json',
        ...(session?.accessToken
          ? { Authorization: `Bearer ${session.accessToken}` }
          : {}),
      },
      withCredentials: true,
    });

    instance.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response?.status === 401) {
          console.warn('⚠️ 401 Unauthorized — token inválido ou expirado');
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [session]);
}
