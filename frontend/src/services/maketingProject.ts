import api from './api';

export async function getProjectsMarketing() {
  const res = await api.get('/marketing/');
  return res.data

}


export async function putProjectsMarketing(payload: any) {
    try {
        await api.put(`/marketing/${payload.id}/`, payload);
    } catch (error) {
        console.error('Erro real:', error.response?.data || error.message);
        throw new Error('Error update Project');
    }
    }
    