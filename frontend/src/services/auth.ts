// auth.ts
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import { LoginUser, RegisterUser, ResetUserPasswordPayload, VerifyCodePayload } from '@/interfaces/user.interface';

interface TokenPayload {
  exp: number;
  user_id: string;
}

interface VerifyOtpPayload {
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
  } catch (error: unknown) {
    let errorMessage = 'Erro desconhecido ao realizar login.';

    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as {

        response?: { data?: Record<string, string> };
      };

      const data = err.response?.data;

      if (data) {
        errorMessage =
          data.detail ||
          data.message ||
          data.error ||
          (Object.values(data)[0]?.[0] as string) ||
          errorMessage;
      }
    }

    throw new Error(errorMessage);
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
    const res = await apiInstance.post(`${process.env.NEXT_PUBLIC_API_URL}token/refresh/`, { refresh });
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
  let errorMessage = 'Erro interno, verifique com suporte.';

  // Define um tipo mais preciso para os dados de erro da API
  type ApiResponseData = {
    detail?: string;
    message?: string;
    error?: string;
    profile?: Record<string, string[]>;
    // Esta linha permite que outras chaves existam
    // onde o valor pode ser uma string ou um array de strings
    [key: string]: string | string[] | undefined | Record<string, string[]>;
  };

  if (typeof error === 'object' && error !== null && 'response' in error) {
    const err = error as {
      response?: { data?: ApiResponseData };
    };

    const data = err.response?.data;
    console.log('data', data);

    if (data) {
      // Prioridade 1: Chaves conhecidas com mensagens de erro simples
      if (typeof data.detail === 'string') {
        errorMessage = data.detail;
      } else if (typeof data.message === 'string') {
        errorMessage = data.message;
      } else if (typeof data.error === 'string') {
        errorMessage = data.error;
      }
      
      // Prioridade 2: Lidar com a estrutura de array de strings
      else {
        const firstValue = Object.values(data)[0];
        if (Array.isArray(firstValue) && typeof firstValue[0] === 'string') {
          errorMessage = firstValue[0];
        } else if (data.profile) {
          const profileValue = Object.values(data.profile)[0];
          if (Array.isArray(profileValue) && typeof profileValue[0] === 'string') {
            errorMessage = profileValue[0];
          }
        }
      }
    }
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

export async function resetPassword(payload: string | VerifyCodePayload) {
  const { default: api } = await import('./api');
  try {
    const res = await api.post('/accounts/reset-password/', JSON.stringify({ email: payload }), {
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