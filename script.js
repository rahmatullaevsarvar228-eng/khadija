// script.js — общий скрипт для всего проекта (максимально пиздатая версия)

const CORRECT_LOGIN = "Xadija";
const CORRECT_PASS = "123";

let music = null; // будет инициализирован на каждой странице

// Сохранение/восстановление прогресса
function getProgress() {
  return parseInt(localStorage.getItem("journeyProgress") || "0");
}

function setProgress(chapterNum) {
  localStorage.setItem("journeyProgress", chapterNum.toString());
  console.log(`Прогресс сохранён: глава ${chapterNum}`);
}

// Инициализация и seamless-музыка
function initMusic() {
  music = document.getElementById('bg-music');
  if (!music) {
    console.warn("Аудио-элемент #bg-music не найден на странице");
    return;
  }

  // Восстанавливаем позицию и состояние
  const savedTime = localStorage.getItem('musicTime');
  const wasPaused = localStorage.getItem('musicPaused');

  if (savedTime !== null) {
    music.currentTime = parseFloat(savedTime);
    console.log(`Восстановлено время музыки: ${savedTime} сек`);
  }

  if (wasPaused !== '1') {
    tryPlayMusic();
  }

  // Сохраняем каждые 5 секунд + при событиях
  music.addEventListener('timeupdate', () => {
    if (Math.floor(music.currentTime) % 5 === 0) {
      localStorage.setItem('musicTime', music.currentTime);
    }
  });

  music.addEventListener('play', () => {
    localStorage.setItem('musicPaused', '0');
    localStorage.setItem('musicTime', music.currentTime);
    console.log("Музыка запущена");
  });

  music.addEventListener('pause', () => {
    localStorage.setItem('musicPaused', '1');
    localStorage.setItem('musicTime', music.currentTime);
    console.log("Музыка на паузе");
  });

  // Сохраняем при сворачивании вкладки
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && music) {
      localStorage.setItem('musicTime', music.currentTime);
      localStorage.setItem('musicPaused', music.paused ? '1' : '0');
      console.log("Вкладка скрыта — состояние музыки сохранено");
    }
  });
}

// Безопасный автоплей (браузеры блокируют без взаимодействия)
function tryPlayMusic() {
  if (!music) return;

  music.play()
    .then(() => {
      console.log("Музыка успешно запущена");
      const control = document.getElementById('music-control');
      if (control) control.innerHTML = '⏸️ Музыка';
    })
    .catch(err => {
      console.warn("Автоплей заблокирован:", err);
      // Ждём первого клика по странице
      document.body.addEventListener('click', () => {
        music.play();
        const control = document.getElementById('music-control');
        if (control) control.innerHTML = '⏸️ Музыка';
      }, { once: true });
    });
}

// Логин (только на index.html)
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    const user = document.getElementById("username")?.value.trim();
    const pass = document.getElementById("password")?.value.trim();
    const error = document.getElementById("error");

    if (user === CORRECT_LOGIN && pass === CORRECT_PASS) {
      localStorage.setItem("journeyProgress", "1");
      tryPlayMusic(); // стартуем музыку после логина
      console.log("Логин успешен → переход на chapter1.html");
      window.location.href = "chapter1.html";
    } else {
      if (error) error.classList.remove("hidden");
      console.warn("Неверный логин/пароль");
    }
  });
}

// Управление кнопкой музыки (на всех страницах)
const musicControl = document.getElementById("music-control");
if (musicControl) {
  musicControl.addEventListener("click", () => {
    if (!music) return;

    if (music.paused) {
      music.play();
      musicControl.innerHTML = "⏸️ Музыка";
    } else {
      music.pause();
      musicControl.innerHTML = "▶️ Музыка";
    }
  });
}

// Инициализация при загрузке любой страницы
window.addEventListener('load', () => {
  initMusic();

  // Обновляем иконку кнопки музыки при загрузке
  if (musicControl && music) {
    musicControl.innerHTML = music.paused ? "▶️ Музыка" : "⏸️ Музыка";
  }

  console.log("Страница загружена. Музыка инициализирована.");
});