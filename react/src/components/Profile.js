import React, { useState, useEffect } from 'react';
import { Group, Cell, Avatar, FormItem, Input, Button, File, Snackbar } from '@vkontakte/vkui';
import { getProfile, updateProfile } from '../api/profile';

function Profile() {
  const [profile, setProfile] = useState({ username: '', email: '', profilePhoto: '' });
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState(null);
  const [base64Photo, setBase64Photo] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setUsername(data.username);
        setEmail(data.email);
        localStorage.setItem('user', JSON.stringify(data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setError('Файл слишком большой. Максимальный размер: 1MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Photo(reader.result);
        setPhoto(file);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (error) return;
    const data = {
      username,
      email,
      photo: base64Photo
    };

    try {
      const updated = await updateProfile(data);
      setProfile(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setBase64Photo('');
      setPhoto(null);
    } catch (error) {
      console.error(error);
      setError('Ошибка при обновлении профиля');
    }
  };

  return (
    <Group>
      <Cell
        before={<Avatar src={profile.profilePhoto} size={72} />}
        subtitle={profile.email}
      >
        {profile.username}
      </Cell>
      <FormItem top="Имя пользователя">
        <Input value={username} onChange={(e) => setUsername(e.target.value)} />
      </FormItem>
      <FormItem top="Email">
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormItem>
      <FormItem top="Фото профиля">
        <File onChange={handleFileChange}>Выбрать фото</File>
      </FormItem>
      <FormItem>
        <Button size="l" stretched onClick={handleUpdate}>Обновить профиль</Button>
      </FormItem>
      {error && <Snackbar onClose={() => setError('')}>{error}</Snackbar>}
    </Group>
  );
}

export default Profile;
