document.addEventListener('DOMContentLoaded', () => {
    // === БЛОК 1: МОДАЛКА АНКЕТЫ (ВЕРБОВКА RN) ===
    const modal = document.getElementById('orderModal');
    const openBtn = document.getElementById('openModalBtn');
    const openBtnFooter = document.getElementById('openModalBtnFooter'); // ИСПРАВЛЕНО: Теперь переменная объявлена!
    const closeBtn = document.getElementById('closeModal');
    const form = document.getElementById('applyForm');

    // Вынесли открытие в одну функцию, чтобы не дублировать код для двух кнопок
    const openModalHandler = (e) => {
        e.preventDefault();
        if (modal) {
            modal.style.display = 'flex';
        }
    };

    // Проверка и вешание клика на основную кнопку
    if (openBtn) {
        if (!modal) {
            openBtn.addEventListener('click', (e) => e.preventDefault());
        } else {
            openBtn.addEventListener('click', openModalHandler);
        }
    }

    // ВЕШАЕМ КЛИК НА КНОПКУ ИЗ ФУТЕРА
    if (openBtnFooter) {
        if (!modal) {
            openBtnFooter.addEventListener('click', (e) => e.preventDefault());
        } else {
            openBtnFooter.addEventListener('click', openModalHandler);
        }
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (modal && e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Отправка анкеты (сработает, только если форма есть на текущей странице)
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerText : 'Подать заявку';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Отправка...';
            }

            const applicationData = {
                userNick: document.getElementById('userNick').value.trim(),
                userAge: document.getElementById('userAge').value.trim(),
                userKills: document.getElementById('userKills').value.trim(),
                userIntent: document.getElementById('userIntent').value.trim(),
                userPastClans: document.getElementById('userPastClans').value.trim() || 'Промолчал',
                userChar: document.getElementById('userChar').value.trim(),
                userJob: document.getElementById('userJob').value.trim() || 'Не осмелился просить'
            };

            try {
                const response = await fetch('https://rn-telegram-bot1.onrender.com/api/apply', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(applicationData),
                });

                const data = await response.json();

                if (data.ok) {
                    alert('Твоя жалкая заявка отправлена на рассмотрение');
                    form.reset();
                    if (modal) modal.style.display = 'none';
                } else {
                    alert('Ошибка сервера при отправке. Скорее всего сайт обновляется.');
                }
            } catch (error) {
                console.error('Ошибка сети:', error);
                alert('Не удалось связаться с сервером. Проверь интернет или попробуй ещё раз.');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                }
            }
        });
    }

    // === БЛОК 2: ДЕТАЛЬНАЯ ИНФОРМАЦИЯ АЛЬЯНСОВ (ДЛЯ ALLIANS.HTML) ===
    const detailsModal = document.getElementById('detailsModal');
    const closeDetailsBtn = document.getElementById('closeDetails');
    const dataContainer = document.getElementById('modalClanData');

    const clanData = {
        tg: {
            title: "TG Clan [TG]",
            status: "Статус: Реорганизация // Синдикат",
            desc: "Ожидание пакетных данных от Ririk. Протоколы синхронизации запущены. Инфраструктура готовится к слиянию.",
            leader: "Ririk (Ира)",
            statusIntegration: "В обработке"
        }
    };

    const detailButtons = document.querySelectorAll('.open-details-btn');
    
    if (detailButtons.length > 0 && detailsModal && dataContainer) {
        detailButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const clanKey = btn.getAttribute('data-clan');
                const data = clanData[clanKey];

                if (data) {
                    dataContainer.innerHTML = `
                        <h3 class="modal-clan-title" style="color:rgb(190, 33, 222); text-transform:uppercase; margin-top:0; border-bottom:1px solid #1a1a24; padding-bottom:10px;">${data.title}</h3>
                        <span class="status-badge status-warning" style="color:#db9010; font-weight:bold; font-size:13px; display:inline-block; margin-bottom:15px;">${data.status}</span>
                        <p style="color:rgb(25, 143, 11); line-height:24px; font-size:16px; margin:0 0 20px 0;">${data.desc}</p>
                        
                        <div class="data-slot" style="background:rgba(190, 33, 222, 0.05); padding:10px; border-radius:8px; border:1px solid rgba(190, 33, 222, 0.2); font-size:14px; margin-top:10px; text-align:left;">
                            <span style="color:#555; font-size:11px; text-transform:uppercase; margin-right:5px;">Глава:</span> ${data.leader}
                        </div>
                        <div class="data-slot" style="background:rgba(190, 33, 222, 0.05); padding:10px; border-radius:8px; border:1px solid rgba(190, 33, 222, 0.2); font-size:14px; margin-top:10px; text-align:left;">
                            <span style="color:#555; font-size:11px; text-transform:uppercase; margin-right:5px;">Статус интеграции:</span> ${data.statusIntegration}
                        </div>
                    `;
                    detailsModal.style.display = 'flex';
                }
            });
        });
    }

    if (closeDetailsBtn && detailsModal) {
        closeDetailsBtn.addEventListener('click', () => {
            detailsModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (detailsModal && e.target === detailsModal) {
            detailsModal.style.display = 'none';
        }
    });

    // === БЛОК 3: СКРОЛЛ И ПОДСВЕТКА ИГРОКА (ДЛЯ WIKI.HTML) ===
    const runScrollAndHighlight = () => {
        const hash = window.location.hash;

        if (hash) {
            const targetId = hash.substring(1);
            const targetPlayer = document.getElementById(targetId);

            if (targetPlayer) {
                // На всякий случай сбрасываем класс, если он уже был активен
                targetPlayer.classList.remove('highlight-target');

                // Даем браузеру 400мс, чтобы полностью отрисовать страницу, затем плавно скроллим
                setTimeout(() => {
                    targetPlayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetPlayer.classList.add('highlight-target');
                }, 400);

                // Очищаем подсветку через 3.4 секунды
                setTimeout(() => {
                    targetPlayer.classList.remove('highlight-target');
                }, 3400);
            }
        }
    };

    // Запуск при первой загрузке страницы
    runScrollAndHighlight();

    // Запуск, если хэш изменился без перезагрузки страницы (когда юзер уже на вики кликает по якорям)
    window.addEventListener('hashchange', runScrollAndHighlight);
});