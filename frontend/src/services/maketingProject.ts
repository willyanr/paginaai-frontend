import { UpdatePixelPayload } from '@/interfaces/marketing.interface';
import api from './api';

export async function getProjectsMarketing() {
  const res = await api.get('/marketing/');
  return res.data

}


export async function putProjectsMarketing(payload: UpdatePixelPayload) {
    try {
      const response = await api.post(`/pixels/`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: unknown) {
    let errorMessage = 'Erro desconhecido ao atualizar marketing.';
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

  export async function deleteProjectsPixel(id: number) {
    try {
      const response = await api.delete(`/pixels/${id}/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: unknown) {
    let errorMessage = 'Erro desconhecido ao deletar pixel.';
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

// export async function putProjectsMarketing(payload: any) {
//     try {
//         await api.put(`/marketing/${payload.id}/`, payload);
//     } catch (error) {
//         console.error('Erro real:', error.response?.data || error.message);
//         throw new Error('Error update Project');
//     }
//     }