тут оставил заметки. похже сделать нормальный readME
меню sidebar:
js:
```
    const DASHBOARD_URL = '/api/dashboards';
    let dashboards = []; // Глобальный массив для хранения дашбордов

    // Контейнеры
    const dashboardList = document.getElementById('dashboardList');

    // Загрузка и отображение всех дашбордов
    async function loadDashboards() {
        try {
            const response = await fetch(DASHBOARD_URL);
            dashboards = await response.json();
            renderDashboards();
        } catch (error) {
            console.error('Ошибка загрузки дашбордов:', error);
        }
    }

    // Отображение дашбордов
    function renderDashboards() {
        dashboardList.innerHTML = '';

        dashboards.forEach(dashboard => {
            const sidebarElement = document.createElement('a');
            sidebarElement.href = `/dashboard/${dashboard._id}`;
            sidebarElement.className = 'btn btn-outline-secondary w-100 mb-2';
            sidebarElement.textContent = dashboard.name;
            dashboardList.appendChild(sidebarElement);
        });
    }

    loadDashboards()
```
html:
```
<div id="sidebar">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h5>Profile</h5>
        <i class="fas fa-user-circle"></i>
    </div>
    <a href="/profile"> <button class="btn btn-outline-primary w-100 mb-2">Manage Profile</button></a>
    <button class="btn btn-outline-danger w-100 mb-4" onclick="logout()">Leave</button>
    <nav>
        <a href="#" class="btn btn-outline-secondary w-100 mb-2">Home</a>
        <a href="#" class="btn btn-outline-secondary w-100 mb-2">Statistics</a>
        <a href="#" class="btn btn-outline-secondary w-100 mb-4">Calendar</a>
        <a href="/dashboard" class="btn btn-outline-primary w-100 mb-2">Dashboards:</a>
        <div id="dashboardList"></div> <!-- Контейнер для списка досок -->

    </nav>
</div>
```
css: +bootstrap
```
#sidebar {
            height: 100vh;
            width: 250px;
            background: #f8f9fa;
            position: fixed;
            padding: 20px;
            box-shadow: #9e9e9e 0px 0px 5px;
            left: 0;
        }
```
