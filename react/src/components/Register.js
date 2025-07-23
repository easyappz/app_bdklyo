import React, { useState } from 'react';
import { FormItem, Input, Button, Group, FormLayout } from '@vkontakte/vkui';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const { token } = await register({ username, email, password });
      localStorage.setItem('token', token);
      navigate('/profile');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Group>
      <FormLayout>
        <FormItem top="Имя пользователя">
          <Input value={username} onChange={(e) => setUsername(e.target.value)} />
        </FormItem>
        <FormItem top="Email">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormItem>
        <FormItem top="Пароль">
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormItem>
        <FormItem>
          <Button size="l" stretched onClick={handleSubmit}>Зарегистрироваться</Button>
        </FormItem>
      </FormLayout>
    </Group>
  );
}

export default Register;
