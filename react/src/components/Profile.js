import React, { useState, useEffect } from 'react';
import { Group, Cell, Avatar, FormItem, Input, Button, File } from '@vkontakte/vkui';
import { getProfile, updateProfile } from '../api/profile';

function Profile() {
  const [profile, setProfile] = useState({ username: '', email: '', profilePhoto: '' });
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState(null);

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

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    if (photo) formData.append('photo', photo);

    try {
      const updated = await updateProfile(formData);
      setProfile(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    } catch (error) {
      console.error(error);
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
        <File onChange={(e) => setPhoto(e.target.files[0])}>Выбрать фото</File>
      </FormItem>
      <FormItem>
        <Button size="l" stretched onClick={handleUpdate}>Обновить профиль</Button>
      </FormItem>
    </Group>
  );
}

export default Profile;
