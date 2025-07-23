import { instance } from './axios';

export const createPost = async (data) => {
  const response = await instance.post('/api/posts', data, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
};

export const getFeed = async () => {
  const response = await instance.get('/api/posts');
  return response.data;
};

export const likePost = async (id) => {
  const response = await instance.post(`/api/posts/${id}/like`);
  return response.data;
};

export const commentPost = async (id, text) => {
  const response = await instance.post(`/api/posts/${id}/comment`, { text });
  return response.data;
};
