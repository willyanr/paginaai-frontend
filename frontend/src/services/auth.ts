// auth.ts
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

interface TokenPayload {
  exp: number;
  user_id: string;
}
const extractErrorMessage = (error) => {
  const data = error?.response?.data;

  if (!data) return 'Erro desconhecido';

  // Se for string simples no campo "detail"
  if (typeof data.detail === 'string') return data.detail;

  // Se for lista de erros por campo
  const flatErrors = [];

  const parseErrors = (obj) => {
    for (const key in obj) {
      const val = obj[key];

      if (Array.isArray(val)) {
        // Para cada mensagem de erro no array
        val.forEach(errorMsg => {
          if (typeof errorMsg === 'string') {
            // Remove "profile:" e "profile" e adiciona asterisco
            const cleanedError = errorMsg.replace(/profile:|profile /g, '').trim();
            flatErrors.push(`*${cleanedError}`);
          }
        });
      } else if (typeof val === 'object' && val !== null) {
        parseErrors(val);
      } else if (typeof val === 'string') {
        // Para mensagens que são strings diretas
        const cleanedError = val.replace(/profile:|profile /g, '').trim();
        flatErrors.push(`*${cleanedError}`);
      }
    }
  };

  parseErrors(data);

  // Se não encontrou erros, verifica se há uma string não processada
  if (flatErrors.length === 0 && typeof data === 'string') {
    return data.replace(/profile:|profile /g, '').trim();
  }

  // Junta todos os erros com quebra de linha
  return flatErrors.length > 0 
    ? flatErrors.join('\n') 
    : 'Erro desconhecido';
};

export async function login(payload: any) {
  // Import directly to avoid circular dependency
  const { default: api } = await import('./api');
  
  try {
    const res = await api.post('/accounts/login/', payload, {
      timeout: 5000
    });
    const { access, refresh } = res.data;
    
    // Store tokens
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

export async function refreshAccessToken(apiInstance) {
  const refresh = getRefreshToken();
  
  if (!refresh) {
    throw new Error('No refresh token available');
  }
  
  try {
    // Use the passed api instance to make the request
    const res = await apiInstance.post('/token/refresh/', { refresh });
    const { access } = res.data;
    
    localStorage.setItem('access', access);
    Cookies.set('access', access, { secure: true, sameSite: 'strict' });
    
    return access;
  } catch (error) {
    logout();
    throw error;
  }
}

export async function registerUser(payload: any) {
  const { default: api } = await import('./api');
  try {
    const response = await api.post(`/accounts/register/`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
      const msg = extractErrorMessage(error);
      throw new Error(msg);
  }
  
}

export async function verifyCodeOtp(payload: any) {
  const { default: api } = await import('./api');
  try {
    const res = await api.post('/accounts/validate-otp/', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 1000
    });
    
    return res.data;
  } catch (error: any) {
    const msg = extractErrorMessage(error);
    throw new Error(msg);
  }
}

export async function resetPassword(payload: any) {
  const { default: api } = await import('./api');
  try {
    const res = await api.post('/accounts/reset-password/', JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000
    });
    
    return res.data;
  } catch (error: any) {
    const msg = extractErrorMessage(error);
    throw new Error(msg);
  }
}

export async function resetPasswordFinal(payload: any) {
  const { default: api } = await import('./api');
  try {
    const res = await api.put('/accounts/reset-password/', JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000
    });
    
    return res.data;
  } catch (error: any) {
    const msg = extractErrorMessage(error);
    throw new Error(msg);
  }
}