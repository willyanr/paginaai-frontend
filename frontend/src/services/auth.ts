// auth.ts
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { LoginUser, RegisterUser, ResetUserPasswordPayload, VerifyCodePayload } from '@/interfaces/user.interface';

interface TokenPayload {
  exp: number;
  user_id: string;
}

interface VerifyOtpPayload {
  cpf: string,
  otp: string
  email: string
}



export async function login(payload: LoginUser) {
  const { default: api } = await import('./api');
  try {
    const res = await api.post('/accounts/login/', payload, {
      timeout: 5000
    });
    const { access, refresh } = res.data;

    Cookies.set('access', access, { secure: true, sameSite: 'strict' });
    Cookies.set('refresh', refresh, { secure: true, sameSite: 'strict' });
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);

    return res.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export function logout() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  Cookies.remove('access');
  Cookies.remove('refresh');
}

export function getAccessToken() {
  return localStorage.getItem('access');
}

export function getRefreshToken() {
  return localStorage.getItem('refresh');
}

export function isTokenExpired(token: string) {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
}

import type { AxiosInstance } from 'axios';

export async function refreshAccessToken(apiInstance: AxiosInstance) {
  
  const refresh = getRefreshToken();

  if (!refresh) {
    throw new Error('No refresh token available');
  }

  try {
    const res = await apiInstance.post('http://localhost:8000/api/token/refresh/', { refresh });
    const { access } = res.data;
    console.log('Refresh token:', refresh);


    localStorage.setItem('access', access);
    console.log('salvei aqui', localStorage.getItem('access'));
    Cookies.set('access', access, { secure: true, sameSite: 'strict' });

    return access;
  } catch (error: unknown) {
      const errorMessage = typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message: string }).message
        : 'Erro ';
        alert(errorMessage)

    // logout();
    throw error;
  }
}

export async function registerUser(payload: RegisterUser) {
  const { default: api } = await import('./api');
  try {
    
    await api.post(`/accounts/register/`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: unknown) {
    let errorMessage = 'Erro desconhecido ao criar um usuário';
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: { detail?: string; message?: string } } };
      errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        errorMessage;
    }
    throw new Error(errorMessage);
  }

}

export async function verifyCodeOtp(payload: VerifyOtpPayload) {
  const { default: api } = await import('./api');
  try {
    const res = await api.post('/accounts/validate-otp/', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 1000
    });

    return res.data;
  } catch (error: unknown) {
    let errorMessage = 'Erro desconhecido ao verificar código.';
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: { detail?: string; message?: string } } };
      errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        errorMessage;
    }
    throw new Error(errorMessage);
  }
}

export async function resetPassword(payload: string | VerifyCodePayload)  {
  const { default: api } = await import('./api');
  try {
    const res = await api.post('/accounts/reset-password/', JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000
    });

    return res.data;
  } catch (error: unknown) {
    let errorMessage = 'Erro desconhecido ao redefinir senha.';
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: { detail?: string; message?: string } } };
      errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        errorMessage;
    }
    throw new Error(errorMessage);
  }
}

export async function resetPasswordFinal(payload: ResetUserPasswordPayload) {
  const { default: api } = await import('./api');
  try {
    const res = await api.put('/accounts/reset-password/', JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000
    });

    return res.data;
  } catch (error: unknown) {
    let errorMessage = 'Erro desconhecido ao atualizar senha.';
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: { detail?: string; message?: string } } };
      errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        errorMessage;
    }
    throw new Error(errorMessage);
  }
}