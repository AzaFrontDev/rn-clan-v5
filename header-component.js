class ClanHeader extends HTMLElement {
    connectedCallback() {
        const path = (location && location.pathname) ? location.pathname : '';
        // Проверяем, находимся ли мы внутри папки html (с учётом регистра)
        const inHtmlFolder = path.toLowerCase().includes('/html/') || path.toLowerCase().includes('\\html\\');
        
        // Корректные префиксы для навигации
        const prefix = inHtmlFolder ? '' : 'html/';
        const mainPagePath = inHtmlFolder ? '../index.html' : 'index.html';

        // Если мы НЕ в папке html, значит мы на главной. Кнопка видна.
        // Если МЫ в папке html (на других страницах), скрываем кнопку намертво.
        const btnDisplay = inHtmlFolder ? 'display: none;' : '';

        this.innerHTML = `
        <header class="header">
            <div class="container">
                <div class="header__content">
                    <a href="${mainPagePath}" class="header__logo-link">
                        <img src="https://i.ibb.co/67MLknBP/photo-2026-06-08-15-03-32.jpg" height="40" width="40" alt="Логотип клана RN">
                    </a>
                    <nav class="header__nav">
                        <ul class="header__list">
                            <li class="header__item"><a class="header__link" href="${mainPagePath}" data-page="main">Главная</a></li>
                            <li class="header__item"><a class="header__link" href="${prefix}roster.html" data-page="roster">Состав</a></li>
                            <li class="header__item"><a class="header__link" href="${prefix}rules.html" data-page="rules">Правила</a></li>
                            <li class="header__item"><a class="header__link" href="${prefix}wiki.html" data-page="wiki">База знаний</a></li>
                            <li class="header__item"><a class="header__link" href="${prefix}alliances.html" data-page="alliances">Альянсы</a></li>
                        </ul>
                    </nav>
                    <a href="#" id="openModalBtn" class="header__action-btn" style="${btnDisplay}">Подать заявку</a>
                    <button class="header__menu">
                        <span class="header__menu-line"></span>
                    </button>
                </div>
            </div>
        </header>
        `;

        // Логика автоматической подсветки активной страницы
        const activePage = this.getAttribute('active');
        if (activePage) {
            const link = this.querySelector(`[data-page="${activePage}"]`);
            if (link) {
                link.classList.add('header__link--active');
            }
        }
    }
}

customElements.define('clan-header', ClanHeader);