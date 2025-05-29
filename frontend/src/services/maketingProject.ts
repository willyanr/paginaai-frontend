import api from './api';

export async function getProjectsMarketing() {
  const res = await api.get('/marketing/');
  return res.data

}


export async function putProjectsMarketing(payload: any) {
    try {
      const response = await api.post(`/pixels/`, payload, {
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

  export async function deleteProjectsPixel(id: string) {
    try {
      const response = await api.delete(`/pixels/${id}/`, {
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

// export async function putProjectsMarketing(payload: any) {
//     try {
//         await api.put(`/marketing/${payload.id}/`, payload);
//     } catch (error) {
//         console.error('Erro real:', error.response?.data || error.message);
//         throw new Error('Error update Project');
//     }
//     }