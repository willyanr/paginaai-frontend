import api from './api';

export async function getProjectsDomains() {
  const res = await api.get('/domains/');
  return res.data
};

interface DomainPayload {
  name: string;
  project: string;
}

export async function createProjectsDomains(payload: DomainPayload) {
  try {
    const response = await api.post(`/domains/`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Erro desconhecido ao criar domínio.';
    throw new Error(errorMessage);
  }
}



export async function deleteProjectDomains(id: null) {
  try {
    await api.delete(`/domains/${id}/`); 
  } catch (error) {
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Erro desconhecido ao criar domínio.';
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
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Erro desconhecido ao criar domínio.';
    throw new Error(errorMessage);
  }
}

export async function updateProjectsDomains(payload: any) {
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
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Erro desconhecido ao aualizar domínio.';
    throw new Error(errorMessage);
  }
}
