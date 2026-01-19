document.addEventListener("DOMContentLoaded", () => {
    // 1. ОПРЕДЕЛЕНИЕ ЯЗЫКА (Логика: localStorage -> Браузер -> По умолчанию 'ru')
    let savedLang = localStorage.getItem('selectedLang');

    // Очистка от мусорных значений, если они случайно попали в память
    if (savedLang === 'null' || savedLang === 'undefined') {
        savedLang = null;
    }

    if (!savedLang) {
        // Определяем язык браузера (например, "de-DE", "en-US", "ru-RU")
        const browserLang = navigator.language || navigator.userLanguage;
        const shortLang = browserLang.substring(0, 2).toLowerCase();

        console.log("Первый визит. Язык браузера обнаружен:", shortLang);

        // Проверяем, есть ли такой язык в нашем файле languages.js
        if (typeof translations !== 'undefined' && translations[shortLang]) {
            savedLang = shortLang;
        } else {
            savedLang = 'ru'; // Если язык браузера не поддерживается
        }
        
        // Сразу сохраняем выбор, чтобы автоопределение не срабатывало при каждом обновлении
        localStorage.setItem('selectedLang', savedLang);
    }

    console.log("Итоговый выбранный язык:", savedLang);

    // 2. ФУНКЦИЯ ДЛЯ ЗАГРУЗКИ КОМПОНЕНТОВ (Header/Footer)
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
            placeholder.innerHTML = `<p style='color:red; text-align:center; padding:10px;'>Ошибка: ${url} не найден</p>`;
            return null;
        }
    }

    // 3. ФУНКЦИЯ ПРИМЕНЕНИЯ ПЕРЕВОДА
    function applyLanguage(lang) {
        if (typeof translations === 'undefined') {
            console.error("Критическая ошибка: Объект 'translations' не найден. Проверьте подключение languages.js");
            return;
        }

        // Переводим все элементы с атрибутом data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                // Если это поле ввода (input/textarea), меняем placeholder
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });

        // Устанавливаем атрибут lang для HTML (полезно для SEO и озвучки)
        document.documentElement.lang = lang;
        localStorage.setItem('selectedLang', lang);

        // Подсветка активной кнопки языка в меню
        document.querySelectorAll('.js-lang-link').forEach(link => {
            if (link.getAttribute('data-lang') === lang) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // 4. ЗАПУСК ЗАГРУЗКИ И ИНИЦИАЛИЗАЦИЯ
    Promise.all([
        loadComponent("header-placeholder", "header.html"),
        loadComponent("footer-placeholder", "footer.html")
    ]).then(([headerPlaceholder]) => {
        
        // Как только файлы загружены, переводим всю страницу
        applyLanguage(savedLang);

        // Если шапка загрузилась, настраиваем в ней события
        if (headerPlaceholder) {
            
            // Клик по ссылкам переключения языков
            const langLinks = headerPlaceholder.querySelectorAll('.js-lang-link');
            langLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const newLang = link.getAttribute('data-lang');
                    applyLanguage(newLang);
                });
            });

            // Кнопка обратной связи в шапке
            const callBtn = headerPlaceholder.querySelector('.btn-primary');
            if (callBtn) {
                callBtn.onclick = () => { window.location.href = 'contacts.html'; };
            }

            // Подсветка текущей страницы в меню навигации
            const currentPath = window.location.pathname.split("/").pop() || "index.html";
            headerPlaceholder.querySelectorAll(".nav-link").forEach(link => {
                if (link.getAttribute("href") === currentPath) {
                    link.classList.add("active");
                }
            });
        }
    });
});