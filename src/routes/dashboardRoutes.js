const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Получить все дашборды пользователя
router.get('/', isAuthenticated, dashboardController.getAllDashboards);

// Получить один дашборд по ID
router.get('/:id', isAuthenticated, dashboardController.getDashboardById);

// Создать новый дашборд
router.post('/', isAuthenticated, dashboardController.createDashboard);

// Обновить дашборд
router.put('/:id', isAuthenticated, dashboardController.updateDashboard);

// Удалить дашборд
router.delete('/:id', isAuthenticated, dashboardController.deleteDashboard);

module.exports = router;