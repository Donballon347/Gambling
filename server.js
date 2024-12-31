const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Подключение к MongoDB
mongoose.connect('mongodb+srv://admin:1234@cluster0.lltuv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Создание схемы и модели для пользователя
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    selectedSkin: {
        name: String,
        img: String,
        rarity: String,
        title: String,
        price: String,
        weight: Number,
    },
});

const User = mongoose.model('User', userSchema);

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
        res.redirect('/login');
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

    const selectedSkin = {
        name: skinName,
        img: skinImage,
        rarity: rarity,
        title: skinTitle,
        price: skinPrice,
        weight: 1, // Или другое значение, в зависимости от вашего логики
    };

    // Обновляем выбранный скин в базе данных для пользователя
    try {
        await User.updateOne({ username: user.username }, { $set: { selectedSkin } });
        res.json({ success: true, skin: selectedSkin }); // Отправляем обратно информацию о выбранном скине
    } catch (err) {
        console.error('Ошибка при сохранении скина:', err);
        res.status(500).send('Ошибка при сохранении скина');
    }
});

// Главная страница с рендерингом EJS
app.get('/', (req, res) => {
    const user = req.session.user; // Получаем информацию о пользователе из сессии
    res.render('index', { user }); // Передаем данные пользователя в шаблон
});

// Страница аккаунта
app.get('/account', async (req, res) => {
    const user = req.session.user; // Получаем данные о пользователе из сессии

    if (!user) {
        // Если пользователь не авторизован, возвращаем форму для логина
        return res.render('account', { user: null, selectedSkin: null });
    }

    // Получаем информацию о выбитых скинах
    const selectedSkin = user.selectedSkin;

    // Отправляем данные на страницу
    res.render('account', { user, selectedSkin });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
