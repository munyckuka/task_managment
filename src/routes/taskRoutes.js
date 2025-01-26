const express = require('express');
const { getTasks, createTask, updateTask, deleteTask, getTaskById, archiveDone, updateStatus } = require('../controllers/taskController');
const ArchivedTask = require('../models/ArchivedTaskModel'); // Модель для архивированных задач

const router = express.Router();

// Маршруты для задач
router.get('/', getTasks);       // Получить список задач
router.post('/', createTask);    // Создать новую задачу
router.get('/:id', getTaskById); // найти задачу
router.put('/:id', updateTask);  // Обновить задачу
router.delete('/:id', deleteTask); // Удалить задачу
router.post('/archive-done', archiveDone); // Архивировать задачи
router.put(":/id", updateStatus); // PUT /api/tasks/:id - Обновить статус задачи

module.exports = router;
