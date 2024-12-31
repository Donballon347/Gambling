const mongoose = require('mongoose');

// Создание схемы для пользователя
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  selectedSkin: {
    name: String,
    img: String,
    rarity: String,
    title: String,
    price: String,
    weight: { type: Number, default: 1 }, // Если вес важен, оставляем его
  },
});

// Создание модели
const User = mongoose.model('User', userSchema);

module.exports = User;
