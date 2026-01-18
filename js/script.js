document.addEventListener("DOMContentLoaded", () => {
    const headerPlaceholder = document.getElementById("header-placeholder");

    if (headerPlaceholder) {
        fetch("header.html")
            .then(response => {
                if (!response.ok) throw new Error("Ошибка загрузки шапки");
                return response.text();
            })
            .then(data => {
                // 1. Вставляем шапку
                headerPlaceholder.innerHTML = data;

                // --- 2. ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ЯЗЫКОВ ---
                const langLinks = headerPlaceholder.querySelectorAll('.js-lang-link');
                
                function applyLanguage(lang) {
                    // Перевод всех элементов с data-i18n
                    document.querySelectorAll('[data-i18n]').forEach(el => {
                        const key = el.getAttribute('data-i18n');
                        if (translations[lang] && translations[lang][key]) {
                            el.textContent = translations[lang][key];
                        }
                    });

                    // Сохраняем выбор и меняем атрибут lang у html
                    localStorage.setItem('selectedLang', lang);
                    document.documentElement.lang = lang;

                    // Подсветка активного языка в меню
                    langLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('data-lang') === lang);
                    });
                }

                // Вешаем клик на переключатели языков
                langLinks.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const lang = link.getAttribute('data-lang');
                        applyLanguage(lang);
                    });
                });

                // Применяем язык (сохраненный или русский по умолчанию)
                const savedLang = localStorage.getItem('selectedLang') || 'ru';
                applyLanguage(savedLang);

                // --- 3. ЛОГИКА КНОПКИ ---
                const callBtn = headerPlaceholder.querySelector('.btn-primary');
                if (callBtn) {
                    callBtn.onclick = () => {
                        window.location.href = 'contacts.html';
                    };
                }

                // --- 4. ПОДСВЕТКА ССЫЛОК МЕНЮ ---
                const currentPath = window.location.pathname.split("/").pop() || "index.html";
                const navLinks = headerPlaceholder.querySelectorAll(".nav-link");

                navLinks.forEach(link => {
                    const linkPath = link.getAttribute("href");
                    if (linkPath === currentPath) {
                        link.classList.add("active");
                    }
                });
            })
            .catch(error => {
                console.error("Ошибка:", error);
                headerPlaceholder.innerHTML = "<p style='color:red; text-align:center;'>Ошибка загрузки навигации</p>";
            });
    }
});