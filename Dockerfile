# Використовуємо образ Node.js відповідної версії
FROM node:20-alpine

# Встановлюємо робочу директорію контейнера
WORKDIR /nestApp

# Копіюємо package.json та package-lock.json у робочу директорію контейнера
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо всі файли додатку у робочу директорію контейнера
COPY . .

# Виконуємо команду для запуску додатку
CMD [ "npm", "run", "start:dev" ]
