import api from './api';

export async function getProjects() {
  const res = await api.get('/projects/');
  return res.data
};

export async function updateProject(body: FormData, id: string) {
  try {
    const response = await api.put(`/projects/${id}/`, body);
    return response.data
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Erro desconhecido';
    throw new Error(errorMessage);
  }
}

export async function createProject(payload: any) {
  try {
    await api.post(`/projects/`, payload);
  } catch (error) {
    console.error('Erro real:', error.response?.data || error.message);
    throw new Error('Error update Project');
  }
}

export async function deleteProject(id: string) {
  try {
    const response = await api.delete(`/projects/${id}/`);
    return true;
  } catch (error) {
    console.error('Erro real:', error.message);
  }
}

export async function getAssets() {
  const res = await api.get('/images/');
  return res.data
};