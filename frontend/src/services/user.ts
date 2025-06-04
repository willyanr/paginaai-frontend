import { DataUser } from '@/interfaces/user.interface';
import api from './api';

export async function getUser() {
  const res = await api.get('/accounts/profile/');
  return res.data
}

export async function putUser(payload: DataUser) {
  try {
    const res = await api.put('/accounts/profile/', JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000
    });
    
    return res.data;
  } catch (error: unknown) {
    let msg = 'An unknown error occurred';
    if (error instanceof Error) {
      msg = error.message;
    }
    throw new Error(msg);
  }
}

