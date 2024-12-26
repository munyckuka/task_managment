const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const path = require('path');


dotenv.config();
connectDB();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public"))) // добавляем front
// Маршруты
app.use('/api/tasks', taskRoutes);
// Маршрут для Dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'dashboard.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту localhost:${PORT}`));
