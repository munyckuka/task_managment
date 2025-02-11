const Dashboard = require('../models/dashboardModel');

exports.getAllDashboards = async (req, res) => {
    try {
        const dashboards = await Dashboard.find({ user: req.user.id });
        res.json(dashboards);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

exports.getDashboardById = async (req, res) => {
    try {
        const dashboard = await Dashboard.findById(req.params.id);
        if (!dashboard) return res.status(404).json({ message: 'Дашборд не найден' });
        res.json(dashboard);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

exports.createDashboard = async (req, res) => {
    try {
        const { title } = req.body;
        const newDashboard = new Dashboard({ name: title, user: req.user.id });
        await newDashboard.save();
        res.json(newDashboard);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

exports.updateDashboard = async (req, res) => {
    try {
        const { title } = req.body;
        const updatedDashboard = await Dashboard.findByIdAndUpdate(req.params.id, { name: title }, { new: true });
        res.json(updatedDashboard);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

exports.deleteDashboard = async (req, res) => {
    try {
        await Dashboard.findByIdAndDelete(req.params.id);
        res.json({ message: 'Дашборд удалён' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
