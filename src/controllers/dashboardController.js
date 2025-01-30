const Dashboard = require('../models/Dashboard');
const Task = require('../models/Task');

// Создание новой доски
const createDashboard = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Название доски обязательно' });

        const newDashboard = new Dashboard({ name, user: req.user._id });
        await newDashboard.save();

        res.status(201).json(newDashboard);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании доски', error });
    }
};

// Получение всех досок пользователя
const getDashboards = async (req, res) => {
    try {
        const dashboards = await Dashboard.find({ user: req.user._id });
        res.json(dashboards);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении досок', error });
    }
};

// Удаление доски (и её задач)
const deleteDashboard = async (req, res) => {
    try {
        const { id } = req.params;
        const dashboard = await Dashboard.findOne({ _id: id, user: req.user._id });

        if (!dashboard) return res.status(404).json({ message: 'Доска не найдена' });

        // Удаляем все задачи, привязанные к этой доске
        await Task.deleteMany({ dashboard: id });
        await Dashboard.deleteOne({ _id: id });

        res.json({ message: 'Доска удалена' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении доски', error });
    }
};

module.exports = { createDashboard, getDashboards, deleteDashboard };
