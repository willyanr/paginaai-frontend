import api from './api';

export async function login(username: string, password: string) {
    
  const res = await api.post('/token/', { username, password });
  localStorage.setItem('access', res.data.access);
  localStorage.setItem('refresh', res.data.refresh);
}

export function logout() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
}
