import { DataCreateTestAB } from '@/interfaces/testsab.interface';
import { AxiosInstance } from 'axios';





export async function getTestsAB(api: AxiosInstance) {
  const res = await api.get('/tests/');
  return res.data
  };

export async function postProjectTest(api: AxiosInstance, payload: DataCreateTestAB) {
  try {
    await api.post(`/tests/`, payload);
  } catch (error: unknown) {
    let errorMessage = 'Erro desconhecido ao criar Teste.';
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

export async function deleteProjectTest(api: AxiosInstance, id: number): Promise<boolean> {
  try {
    await api.delete(`/tests/${id}/`);
    return true;
  } catch (error: unknown) {
    let errorMessage = 'Erro desconhecido ao deletar teste.';
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
