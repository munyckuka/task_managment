const express = require('express');
const { getTasks, createTask, updateTask, deleteTask, getTaskById } = require('../controllers/taskController');

const router = express.Router();

// Маршруты для задач
router.get('/', getTasks);       // Получить список задач
router.post('/', createTask);    // Создать новую задачу
router.get('/:id', getTaskById);
router.put('/:id', updateTask);  // Обновить задачу
router.delete('/:id', deleteTask); // Удалить задачу

module.exports = router;
