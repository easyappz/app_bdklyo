const User = require('@src/models/User');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { username, email, photo } = req.body;
    if (username) user.username = username;
    if (email) user.email = email;
    if (photo) {
      if (!photo.startsWith('data:image/')) {
        return res.status(400).json({ message: 'Invalid image format' });
      }
      user.profilePhoto = photo;
    }
    await user.save();
    const updatedUser = await User.findById(req.userId).select('-password');
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProfile, updateProfile };
