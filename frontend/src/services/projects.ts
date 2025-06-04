import { CreateProjectUserPayload, UpdateProjectUserPayload } from '@/interfaces/projects.interface';
import api from './api';

export async function getProjects() {
  const res = await api.get('/projects/');
  return res.data
};

export async function updateProject(body: UpdateProjectUserPayload, id: number) {
  try {
    const response = await api.put(`/projects/${id}/`, body);
    return response.data
  } catch (error: unknown) {
    let errorMessage = 'Erro desconhecido ao atulizar projeto';;
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

export async function createProject(payload: CreateProjectUserPayload) {
  try {
    await api.post(`/projects/`, payload);
  } catch (error: unknown) {
    let errorMessage = 'Erro desconhecido ao criar Projeto.';
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

export async function deleteProject(id: number): Promise<boolean> {
  try {
    await api.delete(`/projects/${id}/`);
    return true;
  } catch (error: unknown) {
    let errorMessage = 'Erro desconhecido ao deletar projeto.';
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

export async function getAssets() {
  const res = await api.get('/images/');
  return res.data
};