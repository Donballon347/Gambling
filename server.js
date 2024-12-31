const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Простая база данных в памяти
const users = [
    { username: 'admin', password: '1234' }, // Пример пользователя
];

// Middleware для обработки данных формы
app.use(bodyParser.urlencoded({ extended: true }));

// Статическая папка для HTML
app.use(express.static('public'));

// Маршрут для обработки логина
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Проверяем пользователя
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.send('<h1>Welcome, ' + username + '!</h1>');
    } else {
        res.status(401).send('<h1>Invalid credentials</h1>');
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
