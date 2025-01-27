const express = require('express');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/userRoutes'); // Роуты для авторизации

dotenv.config();

// Подключаем базу данных
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключаем статику для фронтенда
app.use(express.static(path.join(__dirname, '../public')));

// Настройка сессий и Passport.js
require('./config/passport')(passport);
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Роуты API
app.use('/api/tasks', taskRoutes); // Роуты для задач
app.use('/api/users', authRoutes); // Роуты для авторизации

// Маршрут для дашборда
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'dashboard.html'));
});

// Маршрут для страницы регистрации и логина
app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'loginRegistrationPage.html'));
});
// Маршрут для профиля
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'profile.html'));
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущен на http://localhost:${PORT}`));
