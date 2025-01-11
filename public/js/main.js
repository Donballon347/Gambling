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

  // Скрываем кнопку после нажатия
  document.querySelector('.open-button').style.display = 'none';

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

  // Воспроизведение MP3 файла
  const openSound = document.getElementById('open-sound');
  openSound.play().catch(error => {
    console.error('Не удалось воспроизвести звук:', error);
  });
  
  // Уменьшаем громкость background-audio
  const backgroundAudio = document.getElementById('background-audio');
  if (backgroundAudio) {
    backgroundAudio.volume = 0.2; // Устанавливаем громкость на 20%
  }

  // Массив скинов для страницы redPill
  const redPillItems = [
    { name: "Изоляция", img: "images/skins/Сувенирный Негев Изоляция.png", rarity: "rarity-blue", title: "Сувенирный Негев", price: "53$", weight: 1 },
    { name: "Прозрачный полимер", img: "images/skins/Glock Прозрачный полимер.png", rarity: "rarity-blue", title: "Glock-18", price: "24$", weight: 1 },
    { name: "Лазурный хищник", img: "images/skins/MAC-10 Лазурный хищник.png", rarity: "rarity-blue", title: "MAC-10", price: "74$", weight: 2 },
    { name: "Analog Input", img: "images/skins/Sawed-Off Analog Input.png", rarity: "rarity-purple", title: "Sawed-Off", price: "103$", weight: 3 },
    { name: "Взгляд в прошлое", img: "images/skins/USP-S Взгляд в прошлое.png", rarity: "rarity-purple", title: "USP-S", price: "111$", weight: 3 },
    { name: "Плод воображения", img: "images/skins/Dual Berettas Плод воображения.png", rarity: "rarity-pink", title: "Dual Berettas", price: "185$", weight: 1 }
  ];

  // Массив скинов для страницы bluePill
  const bluePillItems = [
    { name: "Кровавая паутина", img: "images/skins/CZ75-Auto Кровавая паутина.png", rarity: "rarity-blue", title: "CZ75-Auto", price: "123$", weight: 6 },
    { name: "Янтарный градиент", img: "images/skins/AUG Янтарный градиент.png", rarity: "rarity-blue", title: "AUG" , price: "136$", weight: 6 },
    { name: "Заражение", img: "images/skins/P250 Заражение.png", rarity: "rarity-blue", title: "P250", price: "202$", weight: 5 },
    { name: "Метрополитен", img: "images/skins/SSG 08 Метрополитен.png", rarity: "rarity-purple", title: "SSG 08", price: "170$", weight: 4 },
    { name: "Vent Rush", img: "images/skins/P90 Vent Rush.png", rarity: "rarity-purple", title: "P90", price: "77$", weight: 3 },
    { name: "Легион Анубиса", img: "images/skins/AK-47 Легион Анубиса.png", rarity: "rarity-red", title: "AK-47 ", price: "606$", weight: 2 },
    { name: "В живом цвете", img: "images/skins/M4A4 В живом цвете.png", rarity: "rarity-red", title: "M4A4" , price: "824$", weight: 2 },
    { name: "История о драконе", img: "images/skins/AWP Dragon lore.png", rarity: "rarity-red", title: "AWP" , price: "1000000$", weight: 0.1 }
  ];

  // Определяем, на какой странице мы находимся
  const isRedPillPage = window.location.pathname.includes('redPill');
  const items = isRedPillPage ? redPillItems : bluePillItems; // Используем соответствующий массив

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

  // Устанавливаем значения для каждой страницы
  const redPillAnimationDistance = 200; // Значение для страницы redPill
  const bluePillAnimationDistance = 350; // Значение для страницы bluePill

  // Выбираем значение в зависимости от страницы
  const animationDistance = isRedPillPage ? redPillAnimationDistance : bluePillAnimationDistance;// Рассчитываем смещение налево, чтобы элемент был по центру (+320px за счет того что есть еще два элемента вначале рулетки)

  // Анимация рулетки
  setTimeout(() => {
    const resultItem = getRandomItemWithWeight(items); // Выбираем скин с учетом весов
    const itemIndex = items.indexOf(resultItem); // Индекс выбранного скина в оригинальном массиве
    const stopIndex = (itemIndex + Math.floor(totalItems / items.length) * items.length) % totalItems;

    const stopPosition = itemIndex * 200 + (totalWidth / 2 - 200); // Рассчитываем позицию на рулетке (200px)

    // Рассчитываем смещение налево, чтобы элемент был по центру
    const finalAnimationDistance = stopPosition + animationDistance;

    // Анимация рулетки налево
    // roulette.style.transition = "transform 5s cubic-bezier(0.25, 1, 0.5, 1)"; // Обычная анимация
    roulette.style.transition = "transform 5s cubic-bezier(0.68, 0.55, 0.27, 1.55)"; // Вперед и назад
    // roulette.style.transition = "transform 5s cubic-bezier(.07,.97, 1,.05)"; // Остоновка по середине и резко вперед
    roulette.style.transform = `translateX(-${finalAnimationDistance}px)`; // Смещение в отрицательную сторону

    console.log(`stopIndex: ${stopIndex}`);
    console.log(`stopPosition: ${stopPosition}`);
    console.log(`Общая длина рулетки: ${totalWidth}`);
    console.log(`Количество элементов: ${totalItems}`);
    
    // Показываем результат
    setTimeout(() => {
      // Воспроизведение MP3 файла перед показом уведомления
      const alertSound = document.getElementById('alert-sound');
      alertSound.play().catch(error => {
        console.error('Не удалось воспроизвести звук:', error);
      });
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
    }, 5000); // Убедитесь, что это совпадает с временем анимации
  }, 100);

  // Используем существующую переменную isRedPillPage
  const fetchUrl = isRedPillPage ? '/openRedPillCase' : '/openBluePillCase';

  // Пример обработки ответа от сервера после открытия кейса
  fetch(fetchUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ /* данные запроса */ })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        // Обновляем отображение баланса на странице
        document.querySelector('#user-balance').textContent = `Ваш баланс: ${data.balance} монет`;
      } else {
        console.error('Ошибка при открытии кейса');
      }
    })
    .catch(error => {
      console.error('Ошибка при отправке запроса на сервер:', error);
    });
});
