const API_URL = '/api/dashboards';
let dashboards = []; // Глобальный массив для хранения дашбордов

// Контейнеры
const dashboardList = document.getElementById('dashboardList');
const dashboardContainer = document.querySelector('.dashboard-container');

// Загрузка и отображение всех дашбордов
async function loadDashboards() {
    try {
        const response = await fetch(API_URL);
        dashboards = await response.json();
        renderDashboards();
    } catch (error) {
        console.error('Ошибка загрузки дашбордов:', error);
    }
}

// Отображение дашбордов
function renderDashboards() {
    dashboardList.innerHTML = '';
    dashboardContainer.innerHTML = '';

    dashboards.forEach(dashboard => {
        const dashboardElement = createDashboardElement(dashboard);
        dashboardContainer.appendChild(dashboardElement);

        const sidebarElement = document.createElement('a');
        sidebarElement.href = `/dashboard/${dashboard._id}`;
        sidebarElement.className = 'btn btn-outline-secondary w-100 mb-2';
        sidebarElement.textContent = dashboard.name;
        dashboardList.appendChild(sidebarElement);
    });
}

// Создание DOM-элемента дашборда
function createDashboardElement(dashboard) {
    const div = document.createElement('div');
    div.className = 'card mb-2';
    div.setAttribute('data-dashboard-id', dashboard._id);
    div.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${dashboard.name}</h5>
            <button class="btn btn-sm btn-outline-secondary" onclick="showEditDashboardPopup('${dashboard._id}')">Edit</button>
        </div>
    `;
    return div;
}

// Добавление нового дашборда
async function addDashboard(event) {
    event.preventDefault();
    const title = document.getElementById('dashboardTitle').value;
    if (!title) return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });

        if (response.ok) {
            const newDashboard = await response.json();
            dashboards.push(newDashboard);
            renderDashboards();
            closeModal('dashboardModal');
        } else {
            console.error('Ошибка создания дашборда:', await response.text());
        }
    } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
    }
}
function showDashboardPopup(){
    showModal('dashboardModal');
}
// Открытие модального окна редактирования дашборда
function showEditDashboardPopup(dashboardId) {
    const dashboard = dashboards.find(d => d._id === dashboardId);
    if (!dashboard) return;

    document.getElementById('dashboardTitleEdit').value = dashboard.name;
    document.getElementById('dashboardEditModal').dataset.dashboardId = dashboardId;
    showModal('dashboardEditModal');
}

// Обновление дашборда
async function updateDashboard(event) {
    event.preventDefault();
    const dashboardId = document.getElementById('dashboardEditModal').dataset.dashboardId;
    const title = document.getElementById('dashboardTitleEdit').value;
    if (!title) return;

    try {
        const response = await fetch(`${API_URL}/${dashboardId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });

        if (response.ok) {
            dashboards = dashboards.map(d => d._id === dashboardId ? { ...d, title } : d);
            renderDashboards()
            closeModal('dashboardEditModal');
        } else {
            console.error('Ошибка обновления дашборда:', await response.text());
        }
    } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
    }
}

// Удаление дашборда
async function deleteDashboard(event) {
    event.preventDefault();
    const dashboardId = document.getElementById('dashboardEditModal').dataset.dashboardId;

    try {
        const response = await fetch(`${API_URL}/${dashboardId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            dashboards = dashboards.filter(d => d._id !== dashboardId);
            renderDashboards();
            closeModal('dashboardEditModal');
        } else {
            console.error('Ошибка удаления дашборда:', await response.text());
        }
    } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
    }
}

// Показать модальное окно
function showModal(modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
}

// Закрыть модальное окно
function closeModal(modalId) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    modal.hide();
}
// Функция выхода из профиля
async function logout() {
    try {
        const response = await fetch('http://localhost:5000/api/users/logout', {
            method: 'GET',
            credentials: 'include', // Чтобы отправить cookie с сессией
        });

        if (response.ok) {
            window.location.href = '/auth'; // Перенаправляем на страницу авторизации
        } else {
            console.error('Ошибка при выходе из аккаунта');
        }
    } catch (error) {
        console.error('Ошибка при запросе на выход:', error);
    }
}
// Инициализация загрузки дашбордов при загрузке страницы
document.addEventListener('DOMContentLoaded', loadDashboards);
