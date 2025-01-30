const Task = require('../models/taskModel');
const {Types} = require("mongoose");
const mongoose = require('mongoose');
const ArchivedTask = require("../models/ArchivedTaskModel");

// Получить список задач
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({user: req.user._id});
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка получения задач', error });
    }
};

// Создать новую задачу
const createTask = async (req, res) => {
    try {
        const taskData = {
            ...req.body,
            user: req.user._id, // Привязываем задачу к текущему пользователю
        };

        const task = new Task(taskData);
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Ошибка создания задачи', error });
    }
};


// Обновить задачу
const updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ error: 'Задача не найдена' });
        }
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при обновлении задачи' });
    }
};

// Удалить задачу
const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ error: 'Задача не найдена' });
        }
        res.json({ message: 'Задача успешно удалена' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при удалении задачи' });
    }
};
// Получение задачи по ID
const getTaskById = async (req, res) => {
    const { id } = req.params;

    // Проверка, является ли ID валидным ObjectId
    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid task ID' });
    }

    try {
        const task = await Task.findById(id); // Поиск задачи в базе данных
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task); // Возврат найденной задачи
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving task', error: error.message });
    }
};
// архивация задач в другую коллецию
const archiveDone = async (req, res) => {
    try {
        // Находим задачи в статусе "Done"
        const doneTasks = await Task.find({ status: 'Done' });
        console.log("Найдено задач в статусе 'Done':", doneTasks);

        if (doneTasks.length === 0) {
            return res.status(200).json({ message: 'No tasks to archive.' });
        }

        // Переносим задачи в другую коллекцию (архив)
        const archivedTasks = await ArchivedTask.insertMany(doneTasks);
        console.log("Задачи успешно перенесены в архив:", archivedTasks);

        // Удаляем задачи из основной коллекции
        await Task.deleteMany({ status: 'Done' });
        console.log("Задачи удалены из основной коллекции.");

        res.status(200).json(archivedTasks);
    } catch (error) {
        console.error('Ошибка архивации задач:', error);
        res.status(500).json({ message: 'Error archiving tasks.' });
    }
}
// обновить параметр статус
const updateStatus = async (req, res) => {
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
}

module.exports = { getTasks, createTask, updateTask, deleteTask, getTaskById, archiveDone, updateStatus };
