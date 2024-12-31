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

// Add Task when AddTaskButton is clicked
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



// Add new Column
document.addEventListener("DOMContentLoaded", function () {
    const kanbanBoard = document.getElementById("kanbanBoard");
    const addColumnButton = document.getElementById("addColumn");

    addColumnButton.addEventListener("click", function () {
        const newColumn = document.createElement("div");
        newColumn.className = "kanban-column pending-column";
        newColumn.classList.add("col-md-3");

        // Create the column structure with confirmation and cancel buttons
        newColumn.innerHTML = `
            <div class="kanban-header">
                <input type="text" placeholder="Enter column name" class="column-title-input" id="columnTitle">
                <button class="btn btn-sm btn-success confirm-column">Confirm</button>
                <button class="btn btn-sm btn-danger cancel-column">Cancel</button>
            </div>
        `;
        kanbanBoard.appendChild(newColumn);

        const input = newColumn.querySelector(".column-title-input");
        input.focus();

        // Add event listeners for Confirm and Cancel buttons
        const confirmButton = newColumn.querySelector(".confirm-column");
        const cancelButton = newColumn.querySelector(".cancel-column");
        confirmButton.disabled = true;


        // Enable confirmation button when input field is not empty
        input.addEventListener("input", () => {
            if (input.value.trim() !== "") { 
                confirmButton.disabled = false;
            } else {
                confirmButton.disabled = true; 
            }
        });
        
        // Add Column after confirmation
        confirmButton.addEventListener("click", function () {
            const columnName = input.value.trim();
            if (columnName) {
                // Set the column name and finalize its structure
                newColumn.classList.remove("pending-column");
                newColumn.querySelector(".kanban-header").innerHTML = `
                    <input type="text" value="${input.value}" id="columnTitle">
                    <i class="fa-solid fa-pen-to-square" id="columnEditButton""></i>
                `;
                const addTaskButton = document.createElement("button");
                addTaskButton.className = "btn btn-sm btn-outline-primary mb-3";
                addTaskButton.id = "addTask";
                addTaskButton.textContent = "+ Add Task";
                addTaskButton.onclick = function () {
                    showTaskPopup(this);
                };
                newColumn.appendChild(addTaskButton);
            }
        });
        
        // Remove column if cancel button is clicked
        cancelButton.addEventListener("click", function () {
            kanbanBoard.removeChild(newColumn);
        });
    });
});

