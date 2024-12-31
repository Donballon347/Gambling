function getRandomItemWithWeight(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  console.log(`Total weight: ${totalWeight}, Random value: ${random}`);  // Логируем для отладки

  for (const item of items) {
    console.log(`Checking item: ${item.name}, Weight: ${item.weight}, Random left: ${random}`);  // Логируем шаги выбора
    if (random < item.weight) {
      return item;
    }
    random -= item.weight;
  }
}

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

  // Данные скинов
  const items = [
    { name: "Прозрачный полимер", img: "images/skins/Glock Прозрачный полимер.png", rarity: "rarity-blue", title: "Glock-18", price: "124$", weight: 1 },
    { name: "Шарм", img: "images/skins/MAC-10 Шарм.png", rarity: "rarity-purple", title: "MAC-10", price: "45$", weight: 1 },
    { name: "Плод воображения", img: "images/skins/Dual Berettas Плод воображения.png", rarity: "rarity-pink", title: "Dual Berettas", price: "193$", weight: 1 },
    { name: "История о драконе", img: "images/skins/AWP Dragon Lore.png", rarity: "rarity-red", title: "AWP", price: "10 000$", weight: 1111 },
    { name: "Неоновая революция", img: "images/skins/ak47.png", rarity: "rarity-red", title: "AK-47", price: "500$", weight: 1 }
  ];

  const minVisibleItems = 10; // Минимальное количество видимых скинов для длинной рулетки
  const totalItems = Math.max(minVisibleItems, items.length * 10); // Увеличиваем количество элементов
  console.log(`totalItems: ${totalItems}`);

  // Добавляем элементы рулетки
  for (let i = 0; i < totalItems; i++) {
    const item = items[i % items.length]; // Повторяем элементы
    const rouletteItem = document.createElement('div');
    rouletteItem.classList.add('roulette-item', 'skin-card');

    // Вставляем HTML-код карточки
    rouletteItem.innerHTML = `
      <div class="card-background">
        <img src="images/snakes.webp" alt="card-background" />
      </div>
      <div class="card-image">
        <img src="${item.img}" alt="${item.title}" />
      </div>
      <div class="card-info ${item.rarity}">
        <div class="card-info__name">
          <p class="card-title">${item.title}</p>
          <p class="card-skin">${item.name}</p>
        </div>
      </div>
    `;
    roulette.appendChild(rouletteItem);
  }

  // Устанавливаем ширину рулетки
  const totalWidth = totalItems * 200; // Ширина рулетки с учетом всех элементов (ширина карточки 200px)
  roulette.style.width = `${totalWidth}px`;

  // Устанавливаем начальное смещение рулетки
  roulette.style.transform = `translateX(0px)`; // Начинаем с позиции 0

  // Анимация рулетки
  setTimeout(() => {
    const resultItem = getRandomItemWithWeight(items); // Выбираем скин с учетом весов
    const itemIndex = items.indexOf(resultItem); // Индекс выбранного скина в оригинальном массиве
    // const stopIndex = itemIndex + Math.floor(totalItems / items.length) * items.length;
    const stopIndex = (itemIndex + Math.floor(totalItems / items.length) * items.length) % totalItems;

    //const stopPosition = stopIndex * 200; // Рассчитываем позицию на рулетке (200px)
    const stopPosition = itemIndex * 200 + (totalWidth / 2 - 200); // Рассчитываем позицию на рулетке (200px)

    // Анимация рулетки налево
    const animationDistance = stopPosition + 200; // Рассчитываем смещение налево, чтобы элемент был по центру (+320px за счет того что есть еще два элемента вначале рулетки)
    // const animationDistance = stopPosition + (totalWidth / 2 - 200); // Рассчитываем смещение налево, чтобы элемент был по центру
    // roulette.style.transition = "transform 3s ease-out"; // Добавляем плавный переход
    roulette.style.transition = "transform 3s cubic-bezier(.07,.97, 1,.05)"; // Добавляем плавный переход
    // roulette.style.transition = "transform 3s cubic-bezier(.16,2.05,.9,-1.26)"; // Добавляем плавный переход
    roulette.style.transform = `translateX(-${animationDistance}px)`; // Смещение в отрицательную сторону

    console.log(`stopIndex: ${stopIndex}`);
    console.log(`stopPosition: ${stopPosition}`);
    console.log(`Общая длина рулетки: ${totalWidth}`);
    console.log(`Количество элементов: ${totalItems}`);

    // Показываем результат
    setTimeout(() => {
      alert(`Вы выбили: ${resultItem.name}`);
      // Отправка данных на сервер
      fetch('/saveSkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skinName: resultItem.name,
          skinTitle: resultItem.title,
          skinImage: resultItem.img,
          skinPrice: resultItem.price,
          rarity: resultItem.rarity,
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Скин успешно добавлен в базу данных');
        } else {
          console.log('Ошибка при добавлении скина');
        }
      })
      .catch(error => {
        console.error('Ошибка при отправке данных на сервер:', error);
      });
    }, 3000); // Убедитесь, что это совпадает с временем анимации
  }, 100);
});