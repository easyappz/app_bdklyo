import React from 'react';
import { Link } from 'react-router-dom';
import { Group, Cell, Avatar } from '@vkontakte/vkui';

function SideMenu() {
  const user = JSON.parse(localStorage.getItem('user')) || { username: 'Гость', profilePhoto: '' };

  return (
    <div className="sidebar">
      <Group>
        <Cell
          before={<Avatar src={user.profilePhoto} size={48} />}
          subtitle="Профиль"
        >
          {user.username}
        </Cell>
        <Cell><Link to="/feed">Лента</Link></Cell>
        <Cell><Link to="/profile">Мой профиль</Link></Cell>
        <Cell><Link to="/login">Вход</Link></Cell>
        <Cell><Link to="/register">Регистрация</Link></Cell>
      </Group>
    </div>
  );
}

export default SideMenu;
