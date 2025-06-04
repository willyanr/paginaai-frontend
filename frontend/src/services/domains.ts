import { CreateDomainPayload, UpdateDomainPayload } from '@/interfaces/domains.interface';
import api from './api';

export async function getProjectsDomains() {
  const res = await api.get('/domains/');
  return res.data
};



export async function createProjectsDomains(payload: CreateDomainPayload) {
  try {
    const response = await api.post(`/domains/`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Erro desconhecido ao criar domínio.';
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



export async function deleteProjectDomains(id: string) {
  try {
    await api.delete(`/domains/${id}/`); 
  } catch (error: unknown) {
    let errorMessage = 'Erro desconhecido ao deletar Dominio.';
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

export async function verifyProjectsDomains(domain: string) {
  if(!domain) return;
  try {
    const payload = {
      domain: domain
    };
    const response = await api.post(`/domains/verify/`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Erro desconhecido ao verificar dominio.';
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

export async function updateProjectsDomains(payload: UpdateDomainPayload) {
  try {
    const domainID = payload.id
    const projectID = {
      project: payload.project
    }
    const response = await api.put(`/domains/${domainID}/`, projectID, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Erro desconhecido ao atualizar dominio.';
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
