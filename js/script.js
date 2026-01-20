document.addEventListener("DOMContentLoaded", () => {
    // === 1. ИНИЦИАЛИЗАЦИЯ EMAILJS (Данные из image_ae9c8a.png) ===
    const EMAILJS_PUBLIC_KEY = "h9yzR5HGqJCCvVWuD";
    const EMAILJS_SERVICE_ID = "service_ki0h6gf";
    const EMAILJS_TEMPLATE_ID = "template_jwn9knd";

    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    // === 2. ОПРЕДЕЛЕНИЕ ЯЗЫКА ===
    let savedLang = localStorage.getItem('selectedLang');
    if (savedLang === 'null' || savedLang === 'undefined') savedLang = null;

    if (!savedLang) {
        const browserLang = navigator.language || navigator.userLanguage;
        const shortLang = browserLang.substring(0, 2).toLowerCase();
        savedLang = (typeof translations !== 'undefined' && translations[shortLang]) ? shortLang : 'ru';
        localStorage.setItem('selectedLang', savedLang);
    }

    // === 3. ФУНКЦИЯ ДЛЯ ЗАГРУЗКИ КОМПОНЕНТОВ (Header/Footer) ===
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

    // === 4. ФУНКЦИЯ ПРИМЕНЕНИЯ ПЕРЕВОДА ===
    function applyLanguage(lang) {
        if (typeof translations === 'undefined') return;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        document.documentElement.lang = lang;
        localStorage.setItem('selectedLang', lang);

        document.querySelectorAll('.js-lang-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-lang') === lang);
        });
    }

    // === ОБРАБОТКА ФОРМЫ (EmailJS) ===
    const contactForm = document.getElementById('repair-form');
    const statusMsg = document.getElementById('form-status'); // Нашли поле статуса

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const btn = document.getElementById('send-btn');
            const originalText = btn.innerHTML;

            // Очищаем предыдущие сообщения
            statusMsg.innerHTML = '';
            btn.disabled = true;
            btn.innerHTML = (savedLang === 'ru') ? 'Отправка...' : (savedLang === 'de' ? 'Senden...' : 'Sending...');

            emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
                .then(() => {
                    // Берем перевод из объекта translations по ключу
                    const successText = translations[savedLang]?.['cont_form_success'] || 'Success!';

                    statusMsg.style.color = '#555'; // Cерый цвет
                    statusMsg.innerHTML = successText;

                    contactForm.reset(); // Очистить форму
                }, (error) => {
                    const errorText = translations[savedLang]?.['cont_form_error'] || 'Error!';
                    statusMsg.style.color = '#f44336'; // Красный цвет
                    statusMsg.innerHTML = errorText;
                    console.error('EmailJS Error:', error);
                })
                .finally(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalText;

                    // (Опционально) Скрыть сообщение через 5 секунд
                    setTimeout(() => {
                        statusMsg.innerHTML = '';
                    }, 5000);
                });
        });
    }

    // === 6. ЗАПУСК ===
    Promise.all([
        loadComponent("header-placeholder", "header.html"),
        loadComponent("footer-placeholder", "footer.html")
    ]).then(([headerPlaceholder]) => {
        applyLanguage(savedLang);

        if (headerPlaceholder) {
            const langLinks = headerPlaceholder.querySelectorAll('.js-lang-link');
            langLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const newLang = link.getAttribute('data-lang');
                    applyLanguage(newLang);
                });
            });

            const currentPath = window.location.pathname.split("/").pop() || "index.html";
            headerPlaceholder.querySelectorAll(".nav-link").forEach(link => {
                if (link.getAttribute("href") === currentPath) {
                    link.classList.add("active");
                }
            });
        }
    });
});