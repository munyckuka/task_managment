// JavaScript для функциональности Dashboard

document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = '/api/tasks'; // URL API для задач

    // DOM элементы
    const columns = {
        'in-plan': document.querySelector('#inPlan .tasks'),
        'in-progress': document.querySelector('#inProcess .tasks'),
        'done': document.querySelector('#done .tasks')
    };
    const addTaskButton = document.getElementById('addTaskButton');
    const taskModal = document.querySelector('#taskModal');
    const modalForm = document.querySelector('#taskForm');
    const sortSelect = document.querySelector('#sort');
    const filterSelect = document.querySelector('#filter');

    // Загрузка задач из БД
    async function loadTasks() {
        try {
            const response = await fetch(apiUrl);
            const tasks = await response.json();
            applyFiltersAndSorting(tasks);
        } catch (error) {
            console.error('Ошибка при загрузке задач:', error);
        }
    }

    // Отображение задач в соответствующих колонках
    function renderTasks(tasks) {
        // Очистить текущие колонки
        Object.values(columns).forEach(column => column.innerHTML = '');

        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            columns[task.status]?.appendChild(taskElement);
        });
    }

    // Создание DOM элемента задачи
    function createTaskElement(task) {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');
        taskDiv.style.borderLeftColor = task.color;
        taskDiv.innerHTML = `
            <h4>${task.title}</h4>
            <p>Deadline: ${new Date(task.deadline).toLocaleDateString()}</p>
        `;

        taskDiv.addEventListener('click', () => openTaskModal(task));

        return taskDiv;
    }

    // Открытие модального окна для редактирования задачи
    function openTaskModal(task) {
        taskModal.querySelector('#title').value = task.title;
        taskModal.querySelector('#description').value = task.description;
        taskModal.querySelector('#deadline').value = new Date(task.deadline).toISOString().slice(0, 10);
        taskModal.querySelector('#priority').value = task.priority;
        taskModal.querySelector('#remind').value = task.remindMe;
        taskModal.querySelector('#color').value = task.color;

        taskModal.classList.add('open');

        modalForm.onsubmit = (event) => {
            event.preventDefault();
            saveTask(task._id);
        };
    }

    // Сохранение изменений задачи
    async function saveTask(taskId) {
        const updatedTask = {
            title: taskModal.querySelector('#title').value,
            description: taskModal.querySelector('#description').value,
            deadline: taskModal.querySelector('#deadline').value,
            priority: taskModal.querySelector('#priority').value,
            remindMe: taskModal.querySelector('#remind').value,
            color: taskModal.querySelector('#color').value
        };

        try {
            await fetch(`${apiUrl}/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTask)
            });
            taskModal.classList.remove('open');
            loadTasks();
        } catch (error) {
            console.error('Ошибка при сохранении задачи:', error);
        }
    }

    // Добавление новой задачи
    addTaskButton.addEventListener('click', () => {
        taskModal.querySelector('#title').value = '';
        taskModal.querySelector('#description').value = '';
        taskModal.querySelector('#deadline').value = '';
        taskModal.querySelector('#priority').value = 'low';
        taskModal.querySelector('#remind').value = '1hour';
        taskModal.querySelector('#color').value = 'white';

        taskModal.classList.remove('hidden'); // Убираем класс, который скрывает модальное окно
        taskModal.classList.add('open');

        modalForm.onsubmit = async (event) => {
            event.preventDefault();

            const newTask = {
                title: taskModal.querySelector('#title').value,
                description: taskModal.querySelector('#description').value,
                deadline: taskModal.querySelector('#deadline').value,
                priority: taskModal.querySelector('#priority').value,
                remindMe: taskModal.querySelector('#remind').value,
                color: taskModal.querySelector('#color').value,
                status: 'in-plan' // Новые задачи добавляются в колонку 'In plan'
            };

            try {
                await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newTask)
                });
                taskModal.classList.remove('open');
                loadTasks();
            } catch (error) {
                console.error('Ошибка при добавлении задачи:', error);
            }
        };
    });

    // Закрытие модального окна
    document.querySelector('.close-button').addEventListener('click', () => {
        taskModal.classList.remove('open');
        taskModal.classList.add('hidden'); // Возвращаем класс, скрывающий окно

    });

    document.getElementById('cancelButton').addEventListener('click', () => {
        taskModal.classList.remove('open');
        taskModal.classList.add('hidden'); // Возвращаем класс, скрывающий окно

    });

    // Сортировка и фильтрация
    function applyFiltersAndSorting(tasks) {
        let filteredTasks = [...tasks];

        const filterValue = filterSelect.value;
        if (filterValue === 'lastDay') {
            const oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);
            filteredTasks = filteredTasks.filter(task => new Date(task.deadline) >= oneDayAgo);
        } else if (filterValue === 'lastWeek') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            filteredTasks = filteredTasks.filter(task => new Date(task.deadline) >= oneWeekAgo);
        } else if (filterValue === 'lastMonth') {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            filteredTasks = filteredTasks.filter(task => new Date(task.deadline) >= oneMonthAgo);
        }

        const sortValue = sortSelect.value;
        if (sortValue === 'oldest') {
            filteredTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        } else if (sortValue === 'newest') {
            filteredTasks.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
        } else if (sortValue === 'nearest') {
            filteredTasks.sort((a, b) => Math.abs(new Date() - new Date(a.deadline)) - Math.abs(new Date() - new Date(b.deadline)));
        }

        renderTasks(filteredTasks);
    }

    sortSelect.addEventListener('change', () => {
        loadTasks();
    });
    filterSelect.addEventListener('change', () => {
        loadTasks();
    });

    // Начальная загрузка задач
    loadTasks();
});
const addTaskButton = document.getElementById('addTaskButton');
console.log(addTaskButton); // Должен быть <button id="addTaskButton">...</button>

