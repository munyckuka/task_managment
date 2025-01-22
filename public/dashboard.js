// URL для API
const API_URL = '/api/tasks';

// Элементы колонок
const inPlanColumn = document.getElementById('inPlanColumn').querySelector('.task-container');
const inProgressColumn = document.getElementById('inProgressColumn').querySelector('.task-container');
const doneColumn = document.getElementById('doneColumn').querySelector('.task-container');

// Загрузка задач с сервера
async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error('Ошибка загрузки задач:', error);
    }
}

// Отображение задач в соответствующих колонках
function renderTasks(tasks) {
    // Очистка колонок перед обновлением
    inPlanColumn.innerHTML = '';
    inProgressColumn.innerHTML = '';
    doneColumn.innerHTML = '';

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        if (task.status === 'In plan') {
            inPlanColumn.appendChild(taskElement);
        } else if (task.status === 'In progress') {
            inProgressColumn.appendChild(taskElement);
        } else if (task.status === 'Done') {
            doneColumn.appendChild(taskElement);
        }
    });
}

// Создание DOM-элемента задачи
function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task card mb-2';
    taskDiv.style.backgroundColor = task.color || '#fff';
    taskDiv.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${task.title}</h5>
            <p class="card-text">${task.description || ''}</p>
            <p class="card-text"><small class="text-muted">Deadline: ${new Date(task.deadline).toLocaleDateString()}</small></p>
        </div>
    `;
    return taskDiv;
}

// Отображение модального окна для добавления задачи
function showTaskPopup(status) {
    const modal = new bootstrap.Modal(document.getElementById('taskModal'));
    document.getElementById('taskStatus').value = status; // Устанавливаем статус задачи
    modal.show();
}

// Добавление новой задачи
async function addTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const deadline = document.getElementById('taskDeadline').value;
    const priority = document.getElementById('taskPriority').value;
    const status = document.getElementById('taskStatus').value;
    const reminder = document.getElementById('taskReminder').value;
    const color = document.getElementById('taskColor').value;

    const newTask = { title, description, deadline, priority, status, reminder, color };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask),
        });

        if (response.ok) {
            const savedTask = await response.json();
            const taskElement = createTaskElement(savedTask);

            // Добавляем задачу в соответствующую колонку
            if (savedTask.status === 'In plan') {
                inPlanColumn.appendChild(taskElement);
            } else if (savedTask.status === 'In progress') {
                inProgressColumn.appendChild(taskElement);
            } else if (savedTask.status === 'Done') {
                doneColumn.appendChild(taskElement);
            }

            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
            modal.hide();
        } else {
            console.error('Ошибка создания задачи:', await response.text());
        }
    } catch (error) {
        console.error('Ошибка при добавлении задачи:', error);
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    document.getElementById('taskForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addTask();
    });
});
