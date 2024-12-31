const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Простая база данных в памяти
const users = [
    { username: 'admin', password: '1234' }, // Пример пользователя
];

// Middleware для обработки данных формы
app.use(bodyParser.urlencoded({ extended: true }));

// Настройка EJS как шаблонизатора
app.set('view engine', 'ejs');

// Настройка сессий
app.use(session({
    secret: 'your-secret-key', // ключ для подписи сессий
    resave: false,
    saveUninitialized: true,
}));

// Статическая папка для HTML
app.use(express.static('public'));

// Маршрут для обработки логина
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Проверяем пользователя
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.user = user; // Сохраняем пользователя в сессии
        res.redirect('/'); // Перенаправляем на страницу index.html
        // res.send('<h1>Welcome, ' + username + '!</h1>');
    } else {
        res.status(401).send('<h1>Invalid credentials</h1>');
    }
});

// Маршрут для выхода из аккаунта
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/'); // Перенаправляем на главную страницу после выхода
    });
});

// Главная страница с рендерингом EJS
app.get('/', (req, res) => {
    const user = req.session.user; // Получаем информацию о пользователе из сессии
    res.render('index', { user }); // Передаем данные пользователя в шаблон
});

// Страница аккаунта
app.get('/account', (req, res) => {
    const user = req.session.user; // Получаем данные пользователя из сессии
    res.render('account', { user }); // Передаем в шаблон данные о пользователе
});

app.get('/redPill', (req, res) => {
    const user = req.session.user; // Получаем информацию о пользователе из сессии
    res.render('redPill', { user }); // Передаем данные пользователя в шаблон
});


app.get('/bluePill', (req, res) => {
    const user = req.session.user; // Получаем информацию о пользователе из сессии
    res.render('bluePill'); // рендерим страницу с синей таблеткой
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
