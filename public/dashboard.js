// URL для API
const API_URL = '/api/tasks';
let tasks = []; // Глобальный массив для хранения задач


// Элементы колонок
const inPlanColumn = document.getElementById('inPlanColumn').querySelector('.task-container');
const inProgressColumn = document.getElementById('inProgressColumn').querySelector('.task-container');
const doneColumn = document.getElementById('doneColumn').querySelector('.task-container');

// Загрузка задач с сервера
async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        tasks = await response.json();
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
    // уникальный идентификатор задачи в качестве атрибута
    taskDiv.setAttribute('data-task-id', task._id);


    // Добавляем атрибуты для drag-and-drop
    taskDiv.setAttribute('draggable', 'true');
    taskDiv.addEventListener('dragstart', (event) => dragTask(event, task._id));

    // Добавляем событие для редактирования задачи
    taskDiv.addEventListener('click', () => showEditTaskPopup(task._id));

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
    // Устанавливаем значение статуса (по умолчанию)
    const taskForm = document.getElementById('taskForm');
    taskForm.reset(); // Сбрасываем форму

    // Сохраняем статус в атрибуте или скрытом поле
    taskForm.dataset.status = status;

    // Показываем модальное окно
    const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
    taskModal.show();
}


// Добавление новой задачи
async function addTask(event) {
    event.preventDefault(); // Останавливаем стандартное поведение

    const taskForm = document.getElementById('taskForm');
    const status = taskForm.dataset.status; // Получаем статус из скрытого атрибута

    const taskData = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        deadline: document.getElementById('taskDeadline').value,
        priority: document.getElementById('taskPriority').value,
        reminder: document.getElementById('taskReminder').value,
        color: document.getElementById('taskColor').value,
        status: status,
    };

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        });

        if (response.ok) {
            const newTask = await response.json();
            addTaskToUI(newTask); // Добавляем задачу в интерфейс
            const taskModal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
            taskModal.hide(); // Закрываем модальное окно
        } else {
            console.error('Ошибка создания задачи:', await response.text());
        }
    } catch (error) {
        console.error('Ошибка отправки задачи:', error);
    }
}
function addTaskToUI(task) {
    const columnId = task.status === 'In plan' ? 'inPlanColumn'
        : task.status === 'In progress' ? 'inProgressColumn'
            : 'doneColumn';

    const column = document.getElementById(columnId).querySelector('.task-container');

    const taskElement = createTaskElement(task); // Создаем HTML задачи
    column.appendChild(taskElement);
}

// Разрешить сброс (drop) элемента
function allowDrop(event) {
    event.preventDefault();
}

// Начать перетаскивание задачи
function dragTask(event, taskId) {
    event.dataTransfer.setData('taskId', taskId);
}

// Обработать сброс задачи в новую колонку
async function dropTask(event, newStatus) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('taskId');

    try {
        // Обновляем статус задачи в базе данных
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
            // Перезагружаем задачи после обновления
            loadTasks();
        } else {
            console.error('Ошибка обновления статуса задачи:', await response.text());
        }
    } catch (error) {
        console.error('Ошибка при обновлении статуса:', error);
    }
}
function moveTaskInUI(taskId, targetColumn) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    const targetColumnElement = document.getElementById(targetColumn);

    if (taskElement && targetColumnElement) {
        targetColumnElement.appendChild(taskElement);
    }
}

// отображение DOM формы
function showEditTaskPopup(taskId) {
    // Найти задачу по ID (можно использовать данные, сохраненные на клиенте, или запросить сервер)
    const task = tasks.find(t => t._id === taskId); // Предполагается, что есть массив `tasks`
    if (task) {
        // Заполняем форму данными задачи
        document.getElementById('taskTitleEdit').value = task.title;
        document.getElementById('taskDescriptionEdit').value = task.description;
        document.getElementById('taskDeadlineEdit').value = task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '';
        document.getElementById('taskPriorityEdit').value = task.priority;
        document.getElementById('taskFormEdit').dataset.taskId = taskId;


        // Показываем модальное окно
        const taskEditModal = new bootstrap.Modal(document.getElementById('taskEditModal'));
        taskEditModal.show();
    }
}
//  изменить задачу
async function updateTask(event) {

    event.preventDefault();

    const taskForm = document.getElementById('taskFormEdit');
    const taskId = taskForm.dataset.taskId; // Получаем ID задачи

    const updatedTask = {
        title: document.getElementById('taskTitleEdit').value,
        description: document.getElementById('taskDescriptionEdit').value,
        deadline: document.getElementById('taskDeadlineEdit').value,
        priority: document.getElementById('taskPriorityEdit').value,

    };

    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask),
        });

        if (response.ok) {
            const updatedTaskData = await response.json();
            console.log('Id test: ', updatedTaskData)
            updateTaskInUI(updatedTaskData); // Обновляем задачу в UI
            const taskEditModal = bootstrap.Modal.getInstance(document.getElementById('taskEditModal'));
            taskEditModal.hide(); // Закрываем модальное окно

        } else {
            console.error('Ошибка обновления задачи:', await response.text());
        }
    } catch (error) {
        console.error('Ошибка при отправке изменений:', error);
    }
}
// удалить задачу
async function deleteTask(event) {
    event.preventDefault();

    const taskForm = document.getElementById('taskFormEdit');
    const taskId = taskForm.dataset.taskId; // Получаем ID задачи
    console.log('Task ID:', taskId);

    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            removeTaskFromUI(taskId); // Удаляем задачу из UI
            const taskEditModal = bootstrap.Modal.getInstance(document.getElementById('taskEditModal'));
            taskEditModal.hide(); // Закрываем модальное окно
        } else {
            console.error('Ошибка удаления задачи:', await response.text());
        }
    } catch (error) {
        console.error('Ошибка при удалении задачи:', error);
    }
}
function updateTaskInUI(updatedTask) {
    const taskElement = document.querySelector(`[data-task-id="${updatedTask._id}"]`);
    if (taskElement) {
        taskElement.remove()
        addTaskToUI(updatedTask)
    }
}

function removeTaskFromUI(taskId) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskElement) {
        taskElement.remove();
    }
}

// убрать в архив
document.getElementById('archiveDoneButton').addEventListener('click', archiveDoneTasks);

async function archiveDoneTasks() {
    try {
        // Отправляем запрос на сервер для архивации задач из колонки Done
        const response = await fetch('/api/tasks/archive-done', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            const archivedTasks = await response.json();
            console.log('Archived Tasks:', archivedTasks);

            // Удаляем задачи из UI
            archivedTasks.forEach(task => removeTaskFromUI(task._id));

            alert('Done tasks successfully archived!');
        } else {
            console.error('Ошибка архивации:', await response.text());
        }
    } catch (error) {
        console.error('Ошибка при архивации задач:', error);
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
