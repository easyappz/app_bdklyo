const Post = require('@src/models/Post');

const createPost = async (req, res) => {
  try {
    const { text, image } = req.body;
    if (image && !image.startsWith('data:image/')) {
      return res.status(400).json({ message: 'Invalid image format' });
    }
    const post = new Post({ userId: req.userId, text, image });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFeed = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 })
      .populate('userId', 'username profilePhoto')
      .populate('comments.userId', 'username profilePhoto');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const userIndex = post.likes.indexOf(req.userId);
    if (userIndex === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes.splice(userIndex, 1);
    }
    await post.save();
    const updatedPost = await Post.findById(req.params.id)
      .populate('userId', 'username profilePhoto')
      .populate('comments.userId', 'username profilePhoto');
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.comments.push({ userId: req.userId, text });
    await post.save();
    const updatedPost = await Post.findById(req.params.id)
      .populate('userId', 'username profilePhoto')
      .populate('comments.userId', 'username profilePhoto');
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createPost, getFeed, likePost, commentPost };
