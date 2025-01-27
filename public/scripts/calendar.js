const calendarBody = document.getElementById("calendarBody");
const monthYear = document.getElementById("monthYear");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function generateCalendar(month, year) {
    // чистим календарь
    calendarBody.innerHTML = "";

    // меняем месяц и год
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYear.textContent = `${monthNames[month]} ${year}`;

    // определение первого дня месяца
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // заполняем календарь нуллами до первого дня месяца
    let date = 1;
    for (let i = 0; i < 6; i++) {
        const row = document.createElement("tr");
        let isEmptyRow = true;

        for (let j = 0; j < 7; j++) {
            const cell = document.createElement("td");
            const dayNumber = document.createElement("span");
            dayNumber.classList.add("td-dayNumber");
            

            if (i === 0 && j < firstDay) {
                dayNumber.textContent = "";
            } else if (date > daysInMonth) {
                dayNumber.textContent = "";
            } else {
                dayNumber.textContent = date;
                date++;
            }

            cell.appendChild(dayNumber);
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
        // если 6-ая строка пустая то просто не создаем её
        // некоторые месяцы могут растянуться до 6-и недель, но не все
        if (isEmptyRow && date > daysInMonth) {
            break;
        }

    }
}

// смена месяца с помощью кнопок
prevMonth.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentMonth, currentYear);
});

nextMonth.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentMonth, currentYear);
});

// загрузка календаря при загрузке страницы
generateCalendar(currentMonth, currentYear);