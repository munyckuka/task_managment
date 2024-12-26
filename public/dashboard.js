let activeColumn = null;

async function loadTasks() {
    try {
        const response = await fetch('/api/tasks'); // Отправка запроса на сервер
        if (!response.ok) {
            throw new Error('Ошибка при загрузке задач');
        }
        const tasks = await response.json(); // Получение данных

        renderTasks(tasks); // Передача данных для отображения
    } catch (error) {
        console.error('Ошибка загрузки задач:', error);
    }
}

function renderTasks(tasks) {
    const kanbanBoard = document.getElementById('kanbanBoard');
    kanbanBoard.innerHTML = ''; // Очистить текущую Kanban-доску

    tasks.forEach(task => {
        const column = document.createElement('div');
        column.className = 'kanban-column col-md-3';
        column.dataset.columnId = task._id;

        column.innerHTML = `
            <div class="kanban-header">
                <h6>${task.groupName}</h6>
            </div>
            <div class="kanban-task task-priority-${task.priority.toLowerCase()}">
                <h6>${task.title}</h6>
                <p>${task.description}</p>
            </div>
        `;
        kanbanBoard.appendChild(column);
    });
}

// Загрузка задач при загрузке страницы
document.addEventListener('DOMContentLoaded', loadTasks);

function showTaskPopup(button) {
    activeColumn = button.closest('.kanban-column');
    const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
    taskModal.show();
}

const taskTitle = document.getElementById('taskTitle');
taskTitle.addEventListener("input", ()=>{
    if(taskTitle.value){
        document.getElementById('addTaskButton').disabled = false;
    }else{
        document.getElementById('addTaskButton').disabled = true;
    }
})
function addTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const priority = document.getElementById('taskPriority').value;

    const taskHTML = `
        <div class="kanban-task task-priority-${priority}">
            <h6>${title}</h6>
            <p>${description}</p>
        </div>
    `;

    if (activeColumn) {
        const addTaskButton = activeColumn.querySelector('.btn-outline-primary'); 

        addTaskButton.insertAdjacentHTML('beforebegin', taskHTML);
    }

    const taskModal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
    taskModal.hide();
    document.getElementById('taskForm').reset();

    activeColumn = null;
}


    document.addEventListener("DOMContentLoaded", function () {
        const kanbanBoard = document.getElementById("kanbanBoard");
        const addColumnButton = document.getElementById("addColumn");

        addColumnButton.addEventListener("click", function () {
            const newColumn = document.createElement("div");
            newColumn.className = "kanban-column";
            newColumn.classList.add("col-md-3")
            newColumn.innerHTML = `
                <div class="kanban-header">
                    <input type="text" value="" id="columnTitle">
                    <i class="fa-solid fa-pen-to-square" style="position: relative; right: 20px; z-index: -1; color: #9e9e9e;"></i>
                </div>
                <button class="btn btn-sm btn-outline-primary mb-3" onclick="showTaskPopup(this)" id="addTask">+ Add Task</button>
            `;
            kanbanBoard.appendChild(newColumn);
            const input = newColumn.querySelector("#columnTitle");
            input.focus();
        });

        kanbanBoard.addEventListener("click", function (e) {
            if (e.target.classList.contains("change-color")) {
                const color = prompt("Enter a color for the column (e.g., #ff0000 or lightblue):", "#f4f4f4");
                if (color) {
                    e.target.closest(".kanban-column").style.backgroundColor = color;
                }
            }
        });
    });
