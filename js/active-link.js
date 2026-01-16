document.addEventListener("DOMContentLoaded", function() {
  // Получаем имя текущего файла
  let currentPage = window.location.pathname.split('/').pop();
  
  // Если мы на главной (путь пустой), считаем это index.html
  if (currentPage === "") {
      currentPage = "index.html";
  }

  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
      // Проверяем, совпадает ли href ссылки с текущей страницей
      if (link.getAttribute('href') === currentPage) {
          link.classList.add('active');
      }
  });
});