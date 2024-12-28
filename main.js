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
 
   // Добавляем элементы рулетки
   items.forEach((item) => {
     const rouletteItem = document.createElement('div');
     rouletteItem.classList.add('roulette-item');
     rouletteItem.innerHTML = `<img src="${item.img}" alt="${item.name}">`; // Только изображения
     roulette.appendChild(rouletteItem);
   });
 
   // Устанавливаем ширину рулетки
   const totalWidth = items.length * 100;
   roulette.style.width = `${totalWidth}px`;
 
   // Добавляем задержку перед запуском анимации
   setTimeout(() => {
      // Анимация рулетки
      const stopPosition = Math.floor(Math.random() * items.length) * 100; // Позиция остановки
      roulette.style.transform = `translateX(calc(50% - ${stopPosition + 50}px))`; // Центрируем скин под полоской

      // Определяем результат
      setTimeout(() => {
         const resultIndex = Math.floor(stopPosition / 100);
         alert(`Вы выбили: ${items[resultIndex].name}`);
      }, 3000); // Убедитесь, что это совпадает с временем анимации
   }, 100); // Минимальная задержка для применения transition
 });
 