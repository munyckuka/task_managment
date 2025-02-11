# Используем Node.js LTS версию
FROM node:18

# Создаём рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install --omit=dev

# Копируем код проекта
COPY . .

# Используем переменные окружения
ENV NODE_ENV=production

# Открываем порт
EXPOSE 5000

# Команда для запуска
CMD ["node", "src/app.js"]
