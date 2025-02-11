# Используем Node.js образ
FROM node:18-alpine
# Устанавливаем рабочую директорию
WORKDIR /app
# Копируем package.json и package-lock.json
COPY package*.json ./
# Устанавливаем зависимости
RUN npm install
# Копируем исходный код
COPY . .
# Указываем порт, который будет слушать контейнер
EXPOSE 5000
# Запускаем приложение
CMD ["npm", "start"]