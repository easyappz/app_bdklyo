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

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('userId', 'username profilePhoto');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createPost, getPosts };
