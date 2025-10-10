import axios, { AxiosInstance } from 'axios';
import { UserFormData } from '@/interfaces/user.interface'; 
// --- NOVAS FUNÇÕES DE SERVIÇO ---
/**
 * Busca os dados do perfil do usuário.
 * @param api A instância do Axios configurada com o token Bearer (do useApi).
 */
export async function getUser(api: AxiosInstance) {
  try {
    
    const res = await api.get('/accounts/profile/');
    return res.data;
  } catch (error: unknown) {
    let msg = 'Ocorreu um erro ao buscar o perfil.';
    if (axios.isAxiosError(error)) {
      msg = error.response?.data?.detail || error.message;
    }
    throw new Error(msg);
  }
}

/**
 * Atualiza os dados do usuário.
 * @param api A instância do Axios configurada com o token Bearer (do useApi).
 * @param payload Os dados do formulário a serem enviados.
 */
export async function putUser(api: AxiosInstance, payload: UserFormData) {
  try {
    // O Axios enviará 'payload' como JSON. O token já está no header via interceptor.
    // Removido 'JSON.stringify(payload)' e headers repetidos.
    const res = await api.put('/accounts/profile/', payload, {
      timeout: 10000,
    });
    
    return res.data;
  } catch (error: unknown) {
    let msg = 'Ocorreu um erro desconhecido ao salvar o perfil.';

    if (axios.isAxiosError(error)) {
        // Aqui você pode tratar erros específicos do DRF, como 400 Bad Request
        msg = error.response?.data?.detail || error.message;
    }
    
    throw new Error(msg);
  }
}
