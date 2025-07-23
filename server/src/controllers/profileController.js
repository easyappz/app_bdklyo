const User = require('@src/models/User');
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
}).single('photo');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProfile = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    try {
      const user = await User.findById(req.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      if (req.file) {
        const base64 = req.file.buffer.toString('base64');
        user.profilePhoto = `data:${req.file.mimetype};base64,${base64}`;
      }
      await user.save();
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
};

module.exports = { getProfile, updateProfile };
