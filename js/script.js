document.addEventListener("DOMContentLoaded", () => {
    // 1. ОПРЕДЕЛЕНИЕ ЯЗЫКА
    let savedLang = localStorage.getItem('selectedLang');

    if (savedLang === 'null' || savedLang === 'undefined') {
        savedLang = null;
    }

    if (!savedLang) {
        const browserLang = navigator.language || navigator.userLanguage;
        const shortLang = browserLang.substring(0, 2).toLowerCase();

        if (typeof translations !== 'undefined' && translations[shortLang]) {
            savedLang = shortLang;
        } else {
            savedLang = 'ru'; 
        }
        localStorage.setItem('selectedLang', savedLang);
    }

    // 2. ФУНКЦИЯ ДЛЯ ЗАГРУЗКИ КОМПОНЕНТОВ
    async function loadComponent(id, url) {
        const placeholder = document.getElementById(id);
        if (!placeholder) return null;
        
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Не найден файл: ${url}`);
            const data = await response.text();
            placeholder.innerHTML = data;
            return placeholder;
        } catch (error) {
            console.error("Ошибка при загрузке компонента:", error);
            return null;
        }
    }

    // 3. ФУНКЦИЯ ПРИМЕНЕНИЯ ПЕРЕВОДА
    function applyLanguage(lang) {
        if (typeof translations === 'undefined') return;

        // Перевод обычного текста
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                // Используем innerHTML на случай, если в тексте будут теги (напр. <br>)
                el.innerHTML = translations[lang][key];
            }
        });

        // Перевод плейсхолдеров (специально для форм в контактах)
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        document.documentElement.lang = lang;
        localStorage.setItem('selectedLang', lang);

        // Обновляем активный класс в переключателе языков
        document.querySelectorAll('.js-lang-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-lang') === lang);
        });
    }

    // 4. ЗАПУСК
    Promise.all([
        loadComponent("header-placeholder", "header.html"),
        loadComponent("footer-placeholder", "footer.html")
    ]).then(([headerPlaceholder]) => {
        
        applyLanguage(savedLang);

        if (headerPlaceholder) {
            // Вешаем события на переключатели языков (делегирование не нужно, так как links уже в DOM)
            const langLinks = headerPlaceholder.querySelectorAll('.js-lang-link');
            langLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const newLang = link.getAttribute('data-lang');
                    applyLanguage(newLang);
                });
            });

            // Подсветка активной страницы
            const currentPath = window.location.pathname.split("/").pop() || "index.html";
            headerPlaceholder.querySelectorAll(".nav-link").forEach(link => {
                // Используем endsWith для корректной работы на хостингах
                if (link.getAttribute("href") === currentPath) {
                    link.classList.add("active");
                }
            });
        }
    });
});