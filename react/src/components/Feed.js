import React, { useState, useEffect } from 'react';
import { Group, Card, Text, Div, Button, FormItem, Textarea, File, Header, SimpleCell, Avatar, IconButton, Snackbar } from '@vkontakte/vkui';
import { Icon28LikeOutline, Icon28CommentOutline } from '@vkontakte/icons';
import { getFeed, createPost, likePost, commentPost } from '../api/posts';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState('');
  const [error, setError] = useState('');
  const [commentTexts, setCommentTexts] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getFeed();
        setPosts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
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
        setBase64Image(reader.result);
        setImage(file);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    if (error) return;
    const data = {
      text,
      image: base64Image
    };

    try {
      const newPost = await createPost(data);
      setPosts([newPost, ...posts]);
      setText('');
      setImage(null);
      setBase64Image('');
    } catch (error) {
      console.error(error);
      setError('Ошибка при создании поста');
    }
  };

  const handleLike = async (id) => {
    try {
      const updatedPost = await likePost(id);
      setPosts(posts.map(p => p._id === id ? updatedPost : p));
    } catch (error) {
      console.error(error);
    }
  };

  const handleComment = async (id) => {
    const commentText = commentTexts[id] || '';
    if (!commentText) return;
    try {
      const updatedPost = await commentPost(id, commentText);
      setPosts(posts.map(p => p._id === id ? updatedPost : p));
      setCommentTexts({ ...commentTexts, [id]: '' });
    } catch (error) {
      console.error(error);
    }
  };

  const updateCommentText = (id, value) => {
    setCommentTexts({ ...commentTexts, [id]: value });
  };

  return (
    <Group header={<Header mode="secondary">Лента</Header>}>
      <Card>
        <FormItem top="Новый пост">
          <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Что у вас нового?" />
        </FormItem>
        <FormItem>
          <File onChange={handleFileChange}>Добавить изображение</File>
        </FormItem>
        <FormItem>
          <Button size="l" stretched onClick={handleCreatePost}>Опубликовать</Button>
        </FormItem>
        {error && <Snackbar onClose={() => setError('')}>{error}</Snackbar>}
      </Card>
      {posts.map(post => (
        <Card key={post._id} style={{ marginTop: 20 }}>
          <SimpleCell
            before={<Avatar src={post.userId.profilePhoto} size={48} />}
            subtitle={new Date(post.createdAt).toLocaleString('ru')}
          >
            {post.userId.username}
          </SimpleCell>
          <Div>
            <Text>{post.text}</Text>
            {post.image && <img src={post.image} alt="post" style={{ width: '100%', marginTop: 10 }} />}
          </Div>
          <Div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <IconButton onClick={() => handleLike(post._id)}>
              <Icon28LikeOutline /> {post.likes.length}
            </IconButton>
            <IconButton>
              <Icon28CommentOutline /> {post.comments.length}
            </IconButton>
          </Div>
          <FormItem>
            <Textarea
              value={commentTexts[post._id] || ''}
              onChange={(e) => updateCommentText(post._id, e.target.value)}
              placeholder="Комментарий"
            />
            <Button onClick={() => handleComment(post._id)}>Отправить</Button>
          </FormItem>
          {post.comments.map((comment, idx) => (
            <SimpleCell key={idx} before={<Avatar src={comment.userId.profilePhoto} size={32} />}>
              <Text>{comment.userId.username}: {comment.text}</Text>
            </SimpleCell>
          ))}
        </Card>
      ))}
    </Group>
  );
}

export default Feed;
