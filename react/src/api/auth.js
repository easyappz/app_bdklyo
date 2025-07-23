import { instance } from './axios';

export const register = async (data) => {
  const response = await instance.post('/api/auth/register', data);
  return response.data;
};

export const login = async (data) => {
  const response = await instance.post('/api/auth/login', data);
  return response.data;
};
