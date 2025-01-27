const express = require('express');
const passport = require('passport');
const { registerUser, loginUser, googleCallback, getUserProfile} = require('../controllers/userController');
const router = express.Router();

// Регистрация пользователя
router.post('/register', registerUser);

// Авторизация пользователя
router.post('/login', loginUser);

const { isAuthenticated } = require('../middleware/authMiddleware');
// Профиль пользователя
router.get('/profile', isAuthenticated, getUserProfile);

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Ошибка при выходе из аккаунта:', err);
            return res.status(500).json({ message: 'Ошибка при выходе из аккаунта' });
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Ошибка при уничтожении сессии:', err);
                return res.status(500).json({ message: 'Ошибка при уничтожении сессии' });
            }
            res.clearCookie('connect.sid'); // Удаляем cookie с сессией
            res.status(200).json({ message: 'Вы успешно вышли из аккаунта' });
        });
    });
});

// Google OAuth маршруты
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    googleCallback
);

module.exports = router;
