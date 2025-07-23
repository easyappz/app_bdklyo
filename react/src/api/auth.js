import { instance } from './axios';

export const register = async (data) => {
  try {
    const response = await instance.post('/api/auth/register', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const login = async (data) => {
  try {
    const response = await instance.post('/api/auth/login', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
