import api from './api';

export async function getProjectsDomains() {
  const res = await api.get('/domains/');
  return res.data
};