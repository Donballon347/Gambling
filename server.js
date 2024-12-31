// Импортируем библиотеки
const express = require('express');
const mongoose = require('mongoose');

// Создаем приложение
const app = express();

// Устанавливаем порт
const port = 3000;

// Подключение к базе данных MongoDB
mongoose.connect('mongodb://localhost/myDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Обработка ошибок подключения
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

// Простая маршрутная обработка
app.get('/', (req, res) => {
  res.send('Hello, world! This is my backend!');
});

// Сервер слушает указанный порт
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
