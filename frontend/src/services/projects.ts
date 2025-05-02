import api from './api';

export async function getProjects() {
  const res = await api.get('/projects/');
  return res.data
};

export async function updateProject(body: FormData, id: null) {
  try {
    await api.put(`/projects/${id}/`, body); 
  } catch (error) {
    console.error('Erro real:', error.response?.data || error.message);
    throw new Error('Error update Project');
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
  
  export async function deleteProject(id: null) {
    try {
      await api.delete(`/projects/${id}/`); 
    } catch (error) {
      console.error('Erro real:', error.response?.data || error.message);
      throw new Error('Error delete Project');
    }
    }

