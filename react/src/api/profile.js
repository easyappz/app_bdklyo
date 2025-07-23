import { instance } from './axios';

export const getProfile = async () => {
  const response = await instance.get('/api/profile');
  return response.data;
};

export const updateProfile = async (formData) => {
  const response = await instance.put('/api/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
