const express = require('express');
const { body } = require('express-validator');
const authController = require('@src/controllers/authController');
const profileController = require('@src/controllers/profileController');
const postController = require('@src/controllers/postController');
const auth = require('@src/middleware/auth');

const router = express.Router();

router.post('/auth/register', [
  body('username').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], authController.register);

router.post('/auth/login', authController.login);

router.get('/profile', auth, profileController.getProfile);

router.put('/profile', auth, profileController.updateProfile);

router.post('/posts', auth, postController.createPost);

router.get('/posts', auth, postController.getPosts);

module.exports = router;
