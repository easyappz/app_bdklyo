const User = require('@src/models/User');
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

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = [
  upload.single('profilePhoto'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      if (req.file) {
        user.profilePhoto = req.file.buffer.toString('base64');
      }
      if (req.body.username) user.username = req.body.username;
      await user.save();
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
];
