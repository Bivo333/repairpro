document.addEventListener("DOMContentLoaded", function() {
  // --- Логика для основного меню (ваша текущая) ---
  let currentPage = window.location.pathname.split('/').pop() || "index.html";
  const navLinks = document.querySelectorAll('.nav .nav-link');

  navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPage) {
          link.classList.add('active');
      }
  });

  // --- НОВАЯ Логика для переключателя языков ---
  const urlParams = new URLSearchParams(window.location.search);
  const currentLang = urlParams.get('lang') || 'ru'; // По умолчанию RU
  const langLinks = document.querySelectorAll('.js-lang-link');

  langLinks.forEach(link => {
      if (link.dataset.lang === currentLang) {
          link.classList.add('active');
      }
  });
});