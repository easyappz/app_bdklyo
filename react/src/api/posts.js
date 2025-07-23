import { instance } from './axios';

export const createPost = async (data) => {
  const formData = new FormData();
  if (data.text) formData.append('text', data.text);
  if (data.image) formData.append('image', data.image);

  try {
    const response = await instance.post('/api/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getPosts = async () => {
  try {
    const response = await instance.get('/api/posts');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const likePost = async (id) => {
  try {
    const response = await instance.post(`/api/posts/${id}/like`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const commentPost = async (id, text) => {
  try {
    const response = await instance.post(`/api/posts/${id}/comment`, { text });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
