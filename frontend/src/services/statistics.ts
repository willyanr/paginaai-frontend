import { AxiosInstance } from "axios";



export async function getStatistics(api: AxiosInstance) {
  
  const res = await api.get('/statistics/');
  return res.data
};

