import React, { useState, useEffect } from 'react';
import { Group, Card, Text, Div, Button, FormItem, Textarea, File, Header, SimpleCell, Avatar, IconButton } from '@vkontakte/vkui';
import { Icon28LikeOutline, Icon28CommentOutline } from '@vkontakte/icons';
import { getFeed, createPost, likePost, commentPost } from '../api/posts';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
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

  const handleCreatePost = async () => {
    const formData = new FormData();
    formData.append('text', text);
    if (image) formData.append('image', image);

    try {
      const newPost = await createPost(formData);
      setPosts([newPost, ...posts]);
      setText('');
      setImage(null);
    } catch (error) {
      console.error(error);
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
          <File onChange={(e) => setImage(e.target.files[0])}>Добавить изображение</File>
        </FormItem>
        <FormItem>
          <Button size="l" stretched onClick={handleCreatePost}>Опубликовать</Button>
        </FormItem>
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
