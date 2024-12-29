document.querySelector('.open-button').addEventListener('click', () => {
  console.log("Кнопка нажата!");

  const caseContainer = document.querySelector('.case'); // Контейнер кейса
  const caseImage = document.querySelector('.crate__image'); // Изображение кейса
  const rouletteWrapper = document.querySelector('.roulette-wrapper'); // Рулетка
  const roulette = document.querySelector('.roulette');

  // Скрываем изображение кейса и показываем рулетку
  caseImage.style.display = 'none';
  rouletteWrapper.style.display = 'block';

  // Добавляем рамку к контейнеру
  caseContainer.classList.add('active');

  // Очищаем рулетку
  roulette.innerHTML = '';

  const items = [
    { name: "Black Steel", img: "images/skins/glock.png" },
    { name: "Zebra", img: "images/skins/glock.png" },
    { name: "Swirlie Belle", img: "images/skins/glock.png" },
    { name: "Rainbow Bash", img: "images/skins/glock.png" },
    { name: "Fluttershy", img: "images/skins/glock.png" }
  ];

  const minVisibleItems = 10; // Минимальное количество видимых скинов для длинной рулетки
  const totalItems = Math.max(minVisibleItems, items.length * 3); // Увеличиваем количество элементов

  // Добавляем элементы рулетки
  for (let i = 0; i < totalItems; i++) {
    const item = items[i % items.length]; // Повторяем элементы
    const rouletteItem = document.createElement('div');
    rouletteItem.classList.add('roulette-item');
    rouletteItem.innerHTML = `<img src="${item.img}" alt="${item.name}">`;
    roulette.appendChild(rouletteItem);
  }

  // Устанавливаем ширину рулетки
  const totalWidth = totalItems * 100; // Ширина рулетки с учетом всех элементов
  roulette.style.width = `${totalWidth}px`;

  // Устанавливаем начальное смещение рулетки
  roulette.style.transform = `translateX(0)`; // Начинаем с позиции 0

  // Добавляем задержку перед запуском анимации
  setTimeout(() => {
    const stopIndex = Math.floor(Math.random() * items.length); // Индекс конечного элемента
    const stopPosition = stopIndex * 100; // Позиция остановки (слева)

    // Анимация рулетки налево
    const animationDistance = stopPosition + totalWidth / 2; // Рассчитываем смещение налево
    roulette.style.transform = `translateX(-${animationDistance}px)`; // Смещение в отрицательную сторону

    // Определяем результат
    setTimeout(() => {
      const resultIndex = stopIndex % items.length;
      alert(`Вы выбили: ${items[resultIndex].name}`);
    }, 3000); // Убедитесь, что это совпадает с временем анимации
  }, 100); // Минимальная задержка для применения transition
});
