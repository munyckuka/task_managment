let activeColumn = null; 

function showTaskPopup(button) {
    activeColumn = button.closest('.kanban-column');
    const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
    taskModal.show();
}

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
                    <input type="text" value="Column 1" id="columnTitle">
                    <i class="fa-solid fa-pen-to-square" style="position: relative; right: 20px; z-index: -1; color: #9e9e9e;"></i>
                </div>
                <button class="btn btn-sm btn-outline-primary mb-3" onclick="showTaskPopup(this)">+ Add Task</button>
            `;
            kanbanBoard.appendChild(newColumn);
            const input = newColumn.querySelector(".column-title");
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