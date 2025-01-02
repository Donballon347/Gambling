const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('./models/User'); // Подключаем единую схему

const app = express();
const PORT = 3000;

// Подключение к MongoDB
mongoose
    .connect('mongodb+srv://admin:1234@cluster0.lltuv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware для обработки данных формы
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Для обработки JSON

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

// Маршрут для обработки регистрации пользователя
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Проверяем, существует ли уже пользователь с таким логином
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).send('<h1>User already exists</h1>');
    }

    // Создаем нового пользователя с паролем в открытом виде
    const newUser = new User({ username, password });
    try {
        await newUser.save();
        res.redirect('/account');
    } catch (err) {
        res.status(500).send('Error during registration');
    }
});

// Маршрут для обработки логина
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Проверяем пользователя в базе данных
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).send('<h1>Invalid credentials</h1>');
    }

    // Проверяем правильность пароля (сравниваем открытые пароли)
    if (user.password !== password) {
        return res.status(401).send('<h1>Invalid credentials</h1>');
    }

    req.session.user = user; // Сохраняем пользователя в сессии
    res.redirect('/'); // Перенаправляем на главную страницу
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

// Страница, на которой рулетка и сохранение скина
app.post('/saveSkin', async (req, res) => {
    const user = req.session.user; // Получаем информацию о пользователе из сессии

    if (!user) {
        return res.status(401).send('Пользователь не авторизован');
    }

    const { skinName, skinTitle, skinImage, skinPrice, rarity } = req.body; // Получаем информацию о скине

    const newSkin = {
        name: skinName,
        img: skinImage,
        rarity: rarity,
        title: skinTitle,
        price: skinPrice,
        weight: 1, // Или другое значение, в зависимости от вашего логики
    };

    // Добавляем новый скин в массив selectedSkins
    try {
        await User.updateOne({ username: user.username }, { $push: { selectedSkins: newSkin } });
        res.json({ success: true, skin: newSkin }); // Отправляем обратно информацию о добавленном скине
    } catch (err) {
        console.error('Ошибка при сохранении скина:', err);
        res.status(500).send('Ошибка при сохранении скина');
    }
});

// Главная страница с рендерингом EJS
app.get('/', async (req, res) => {
    const sessionUser = req.session.user; // Получаем данные о пользователе из сессии

    if (!sessionUser) {
        // Если пользователь не авторизован, возвращаем страницу без данных пользователя
        return res.render('index', { user: null });
    }

    try {
        // Извлекаем обновленные данные пользователя из базы данных
        const user = await User.findOne({ username: sessionUser.username });

        // Отправляем данные на страницу
        res.render('index', { user });
    } catch (err) {
        console.error('Ошибка при получении данных пользователя:', err);
        res.status(500).send('Ошибка при загрузке главной страницы');
    }
});

app.get('/redPill', async (req, res) => {
    const sessionUser = req.session.user; // Получаем данные о пользователе из сессии

    if (!sessionUser) {
        // Если пользователь не авторизован, возвращаем страницу без данных пользователя
        return res.render('redPill', { user: null });
    }

    try {
        // Извлекаем обновленные данные пользователя из базы данных
        const user = await User.findOne({ username: sessionUser.username });

        // Отправляем данные на страницу
        res.render('redPill', { user });
    } catch (err) {
        console.error('Ошибка при получении данных пользователя:', err);
        res.status(500).send('Ошибка при загрузке страницы');
    }
});

app.get('/bluePill', async (req, res) => {
    const sessionUser = req.session.user; // Получаем данные о пользователе из сессии

    if (!sessionUser) {
        // Если пользователь не авторизован, возвращаем страницу без данных пользователя
        return res.render('bluePill', { user: null });
    }

    try {
        // Извлекаем обновленные данные пользователя из базы данных
        const user = await User.findOne({ username: sessionUser.username });

        // Отправляем данные на страницу
        res.render('bluePill', { user });
    } catch (err) {
        console.error('Ошибка при получении данных пользователя:', err);
        res.status(500).send('Ошибка при загрузке страницы');
    }
});

// Страница аккаунта
app.get('/account', async (req, res) => {
    const sessionUser = req.session.user; // Получаем данные о пользователе из сессии

    if (!sessionUser) {
        // Если пользователь не авторизован, возвращаем форму для логина
        return res.render('account', { user: null, selectedSkins: [] });
    }

    try {
        // Извлекаем обновленные данные пользователя из базы данных
        const user = await User.findOne({ username: sessionUser.username });

        // Получаем информацию о выбитых скинах
        const selectedSkins = user.selectedSkins || [];

        // Отправляем данные на страницу
        res.render('account', { user, selectedSkins });
    } catch (err) {
        console.error('Ошибка при получении данных пользователя:', err);
        res.status(500).send('Ошибка при загрузке аккаунта');
    }
});

// Маршрут для открытия кейса на странице redPill
app.post('/openRedPillCase', async (req, res) => {
    const user = req.session.user; // Получаем информацию о пользователе из сессии

    if (!user) {
        return res.status(401).send('Пользователь не авторизован');
    }

    try {
        const currentUser = await User.findOne({ username: user.username });

        if (currentUser.balance < 1) {
            return res.status(400).json({ success: false, message: 'Недостаточно средств для открытия кейса' });
        }

        currentUser.balance -= 1;
        await currentUser.save();

        req.session.user = currentUser;
        res.json({ success: true, balance: currentUser.balance });
    } catch (err) {
        console.error('Ошибка при открытии кейса:', err);
        res.status(500).send('Ошибка при открытии кейса');
    }
});

// Маршрут для открытия кейса на странице bluePill
app.post('/openBluePillCase', async (req, res) => {
    const user = req.session.user;

    if (!user) {
        return res.status(401).send('Пользователь не авторизован');
    }

    try {
        const currentUser = await User.findOne({ username: user.username });

        if (currentUser.balance < 3) {
            return res.status(400).json({ success: false, message: 'Недостаточно средств для открытия кейса' });
        }

        currentUser.balance -= 3;
        await currentUser.save();

        req.session.user = currentUser;
        res.json({ success: true, balance: currentUser.balance });
    } catch (err) {
        console.error('Ошибка при открытии кейса:', err);
        res.status(500).send('Ошибка при открытии кейса');
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
