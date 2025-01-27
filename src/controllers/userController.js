const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {compare} = require("bcrypt");


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
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Проверяем пароль
        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Создаем JWT
        const token = jwt.sign({ id: user._id }, process.env.SESSION_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging in user' });
    }
};

// Получение профиля пользователя
exports.getUserProfile = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json(req.user);
};

// Обработка Google OAuth
exports.googleCallback = (req, res) => {
    // После успешной аутентификации возвращаем JWT
    const token = jwt.sign({ id: req.user._id }, process.env.SESSION_SECRET, { expiresIn: '1h' });
    res.redirect(`/dashboard?token=${token}`); // Редирект с токеном
};
