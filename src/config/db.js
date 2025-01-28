const mongoose = require('mongoose');

require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/tasker-app");
        console.log('MongoDB подключена успешно!');
    } catch (error) {
        console.error('Ошибка подключения к MongoDB:', error.message);
        process.exit(1); // Завершить процесс при ошибке
    }
};

module.exports = connectDB;
