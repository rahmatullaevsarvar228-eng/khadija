// script.js — работает на телефоне и ПК, музыка seamless

const CORRECT_LOGIN = "Xadija";
const CORRECT_PASS = "123";

let music = null;

function setProgress(num) {
  localStorage.setItem("journeyProgress", num.toString());
}

function tryPlayMusic() {
  music = document.getElementById('bg-music');
  if (!music) return;

  music.play().catch(() => {
    document.body.addEventListener('click', () => music.play(), { once: true });
  });

  const control = document.getElementById('music-control');
  if (control) control.innerHTML = '⏸️';
}

// Восстановление музыки при загрузке страницы
window.addEventListener('load', () => {
  music = document.getElementById('bg-music');
  if (music) {
    const savedTime = localStorage.getItem('musicTime');
    const wasPaused = localStorage.getItem('musicPaused');
    if (savedTime) music.currentTime = parseFloat(savedTime);
    if (wasPaused !== '1') tryPlayMusic();
  }

  // Кнопка музыки
  const control = document.getElementById('music-control');
  if (control) {
    control.addEventListener('click', () => {
      if (music.paused) {
        music.play();
        control.innerHTML = '⏸️';
      } else {
        music.pause();
        control.innerHTML = '▶️';
      }
    });
  }

  // Логин (только на index)
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const user = document.getElementById("username")?.value.trim();
      const pass = document.getElementById("password")?.value.trim();
      const error = document.getElementById("error");

      if (user === CORRECT_LOGIN && pass === CORRECT_PASS) {
        localStorage.setItem("journeyProgress", "1");
        tryPlayMusic();
        window.location.href = "chapter1.html";
      } else {
        if (error) error.style.display = 'block';
      }
    });
  }
});
