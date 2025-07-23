const express = require('express');
const { body } = require('express-validator');
const authController = require('@src/controllers/authController');
const userController = require('@src/controllers/userController');
const postController = require('@src/controllers/postController');
const auth = require('@src/middlewares/auth');

const router = express.Router();

// Auth routes
router.post('/register', [
  body('username').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
], authController.register);

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], authController.login);

// User routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, [
  body('username').optional().notEmpty(),
], userController.updateProfile);

// Post routes
router.post('/posts', auth, [
  body('content').notEmpty(),
], postController.createPost);
router.get('/posts', auth, postController.getPosts);

module.exports = router;
