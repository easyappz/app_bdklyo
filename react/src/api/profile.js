import { instance } from './axios';

export const getProfile = async () => {
  try {
    const response = await instance.get('/api/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProfile = async (data) => {
  const formData = new FormData();
  if (data.username) formData.append('username', data.username);
  if (data.email) formData.append('email', data.email);
  if (data.photo) formData.append('photo', data.photo);

  try {
    const response = await instance.put('/api/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
