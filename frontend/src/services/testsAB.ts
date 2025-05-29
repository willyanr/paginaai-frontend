import api from './api';

export async function getTestsAB() {
  const res = await api.get('/tests/');
  return res.data
};