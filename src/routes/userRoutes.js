const express = require('express');
const passport = require('passport');
const { registerUser, loginUser, googleCallback, getUserProfile} = require('../controllers/userController');
const router = express.Router();

// Регистрация пользователя
router.post('/register', registerUser);

// Авторизация пользователя
router.post('/login', loginUser);

const { isAuthenticated } = require('../middlewares/authMiddleware');

// Профиль пользователя
router.get('/profile', isAuthenticated, getUserProfile);

// Google OAuth маршруты
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    googleCallback
);

module.exports = router;
