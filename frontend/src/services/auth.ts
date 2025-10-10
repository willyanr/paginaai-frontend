// auth.ts
import { DataSubscription, LoginUser, RegisterUser, ResetUserPasswordPayload, VerifyCodePayload } from '@/interfaces/user.interface';



interface VerifyOtpPayload {
  otp: string
  email: string
}


function getCsrfToken(name = 'csrftoken') {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}





export async function login(api: AxiosInstance, payload: LoginUser) {
  try {
    const res = await api.post('/accounts/login/', payload, {});
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








export async function createSubscription(api: AxiosInstance) {
   const csrfToken = getCsrfToken();

  try {
    const res = await api.post(
      '/checkout/subscribe/',
      {}, // corpo do POST
      {
        withCredentials: true, // envia cookie de sessão
        headers: {
          'X-CSRFToken': csrfToken, 
        },
        timeout: 5000,
      }
    );

    return res.data as DataSubscription;
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


export async function registerUser(api: AxiosInstance, payload: RegisterUser) {
  try {

   await api.post(`/accounts/register/`, payload, {
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // importante para evitar enviar cookies
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

export async function verifyCodeOtp(api: AxiosInstance, payload: VerifyOtpPayload) {
  try {
    const res = await api.post('/accounts/validate-otp/', payload, {
 
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

export async function resetPassword(api: AxiosInstance, payload: string | VerifyCodePayload) {
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

export async function resetPasswordFinal(api: AxiosInstance, payload: ResetUserPasswordPayload) {
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