document.addEventListener('DOMContentLoaded', function () {
   const audio = document.getElementById('background-audio');
   const playIcon = document.getElementById('play-icon');
   const pauseIcon = document.getElementById('pause-icon');
   const volumeSlider = document.getElementById('volume-slider'); // Добавлено объявление переменной volumeSlider

   if (!volumeSlider) {
      console.error('Volume slider element not found');
      return;
   }

   // Загрузка уровня громкости из localStorage
   const savedVolume = localStorage.getItem('audioVolume');
   if (savedVolume !== null) {
      audio.volume = parseFloat(savedVolume);
      volumeSlider.value = savedVolume;
   } else {
      audio.volume = 1; // Устанавливаем громкость по умолчанию
      volumeSlider.value = 1;
   }

   // Автоматически начинаем воспроизведение
   audio.play().catch(error => {
      console.error('Автоматическое воспроизведение не удалось:', error);
   });

   // Обработчик для переключения воспроизведения
   document.querySelector('.burger').addEventListener('click', function (event) {
      if (event.target === playIcon) {
         audio.play();
         playIcon.style.display = 'none';
         pauseIcon.style.display = 'inline';
      } else if (event.target === pauseIcon) {
         audio.pause();
         playIcon.style.display = 'inline';
         pauseIcon.style.display = 'none';
      }
   });

   // Обработчик для изменения громкости
   volumeSlider.addEventListener('input', function () {
      const newVolume = parseFloat(volumeSlider.value);
      audio.volume = newVolume;
      console.log(`Volume: ${newVolume}`);
      localStorage.setItem('audioVolume', newVolume); // Сохраняем уровень громкости
   });
});