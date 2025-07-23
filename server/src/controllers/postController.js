const Post = require('@src/models/Post');
const multer = require('multer');
const { validationResult } = require('express-validator');

const upload = multer({
  limits: { fileSize: 1024 * 1024 }, // 1MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image'), false);
    }
  },
});

exports.createPost = [
  upload.single('image'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const post = new Post({
        author: req.user.id,
        content: req.body.content,
      });
      if (req.file) {
        post.image = req.file.buffer.toString('base64');
      }
      await post.save();
      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
];

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate('author', 'username profilePhoto');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
