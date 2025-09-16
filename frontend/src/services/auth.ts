// auth.ts
import { LoginUser, RegisterUser, ResetUserPasswordPayload, VerifyCodePayload } from '@/interfaces/user.interface';

interface TokenPayload {
  exp: number;
  user_id: string;
}

interface VerifyOtpPayload {
  otp: string
  email: string
}


export const AuthService = {
  
  async checkAuth(): Promise<void> {
    const { default: api } = await import('./api');
    const res = await api.get('/accounts/me/')

    if (!res || !res.data) {
      
      throw new Error("Usuário não autenticado.");
      
    }

    return res.data;
  },
}

export async function login(payload: LoginUser) {
  const { default: api } = await import('./api');
  try {
    const res = await api.post('/accounts/login/', payload, {
      timeout: 5000
    });
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

export async function logout() {
  const { default: api } = await import('./api');
  try {
    await api.post('/accounts/logout/', {}); 
  } catch {
    console.error('Erro ao fazer logout');
  } finally {
    if (typeof window !== 'undefined') {
      window.location.href = '/signin';
    }
  }
}





import type { AxiosInstance } from 'axios';
export async function refreshAccessToken(apiInstance: AxiosInstance) {
  try {
    const res = await apiInstance.post('/token/refresh/', {}, { withCredentials: true });
    return res.data.access; 
  } catch  {
    console.error('Erro atualizar token');
    throw new Error('Não foi possível atualizar o token');
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