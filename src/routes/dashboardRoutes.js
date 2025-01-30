const express = require('express');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { createDashboard, getDashboards, deleteDashboard } = require('../controllers/dashboardController');

const router = express.Router();

router.post('/', isAuthenticated, createDashboard); // Создать доску
router.get('/', isAuthenticated, getDashboards); // Получить все доски пользователя
router.delete('/:id', isAuthenticated, deleteDashboard); // Удалить доску

module.exports = router;
