const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {compare} = require("bcryptjs");


// Регистрация
exports.registerUser = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // Проверяем существование email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Создаем нового пользователя
        const newUser = new User({ email, password, name });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error registering user' });
    }
};

// Логин
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        // Проверка пароля (если пароли хранятся в хэшированном виде)
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        // Создание сессии через req.login
        req.login(user, (err) => {
            if (err) {
                console.error('Ошибка при создании сессии:', err);
                return res.status(500).json({ message: 'Ошибка авторизации' });
            }
            res.status(200).json({ message: 'Вы успешно вошли в систему', user });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};


// Получение профиля пользователя
exports.getUserProfile = (req, res) => {
    try {
        // Информация о пользователе доступна в req.user благодаря Passport.js
        const user = req.user;

        // Отправляем данные профиля пользователя
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            googleId: user.googleId,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при загрузке профиля' });
    }
};

// Обработка Google OAuth
exports.googleCallback = (req, res) => {
    req.login(req.user, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Ошибка авторизации через Google' });
        }
        res.redirect('/dashboard');
    });
};
