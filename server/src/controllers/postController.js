const Post = require('@src/models/Post');
const multer = require('multer');

const upload = multer({
  limits: { fileSize: 1000000 }, // 1MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('File is not an image'), false);
    }
  }
}).single('image');

const createPost = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    try {
      const { text } = req.body;
      const post = new Post({ userId: req.userId, text });
      if (req.file) {
        const base64 = req.file.buffer.toString('base64');
        post.image = `data:${req.file.mimetype};base64,${base64}`;
      }
      await post.save();
      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
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
