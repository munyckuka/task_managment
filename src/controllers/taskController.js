const Task = require('../models/taskModel');
const {Types} = require("mongoose");
const mongoose = require('mongoose');

// Получить список задач
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка получения задач', error });
    }
};

// Создать новую задачу
const createTask = async (req, res) => {
    try {
        const task = new Task(req.body);
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ message: 'Ошибка создания задачи', error });
    }
};

// Обновить задачу
const updateTask = async (req, res) => {
    const { id } = req.params;

    // Проверка валидности ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid task ID' });
    }

    try {
        // Найти и обновить задачу
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { ...req.body }, // Обновляемые данные
            { new: true, runValidators: true } // Опции: вернуть обновлённый объект, валидировать данные
        );

        // Если задача не найдена
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(updatedTask); // Вернуть обновлённую задачу
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
};

// Удалить задачу
const deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Задача удалена' });
    } catch (error) {
        res.status(400).json({ message: 'Ошибка удаления задачи', error });
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

module.exports = { getTasks, createTask, updateTask, deleteTask, getTaskById };
