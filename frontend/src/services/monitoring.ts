import { DataCreateMonitoring } from '@/interfaces/monitoring.interface';
import api from './api';

export async function getMonitoring() {
  const res = await api.get('/monitoring/');
  return res.data
};


export async function postMonitoring(payload: DataCreateMonitoring) {
  try {
    const response = await api.post(`/monitoring/`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Erro desconhecido ao criar integração com Clarity.';
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


export async function deleleMonitoring(id: number) {
  try {
    const response = await api.delete(`/monitoring/${id}/`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Erro desconhecido ao deletar integração.';
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