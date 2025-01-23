const express = require('express');
const { getTasks, createTask, updateTask, deleteTask, getTaskById } = require('../controllers/taskController');

const router = express.Router();

// Маршруты для задач
router.get('/', getTasks);       // Получить список задач
router.post('/', createTask);    // Создать новую задачу
router.get('/:id', getTaskById);
router.put('/:id', updateTask);  // Обновить задачу
router.delete('/:id', deleteTask); // Удалить задачу
// PUT /api/tasks/:id - Обновить статус задачи
router.put('/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const { status } = req.body;

        // Обновляем задачу в базе данных
        const updatedTask = await Task.findByIdAndUpdate(taskId, { status }, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ error: 'Задача не найдена' });
        }

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка обновления задачи' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ error: 'Задача не найдена' });
        }
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при обновлении задачи' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ error: 'Задача не найдена' });
        }
        res.json({ message: 'Задача успешно удалена' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при удалении задачи' });
    }
});


module.exports = router;
