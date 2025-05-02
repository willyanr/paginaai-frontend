import api from './api';

export async function getUser() {
  const res = await api.get('/projects/');
  return res.data
}


