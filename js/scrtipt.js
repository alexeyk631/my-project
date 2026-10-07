/* ==========================================
   1. БУРГЕР-МЕНЮ
   ========================================== */
   (function initBurger() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav__list');
  
    if (!burger || !nav) return;
  
    burger.addEventListener('click', () => {
      const isExpanded = burger.getAttribute('aria-expanded') === 'true';
      const next = !isExpanded;
  
      nav.classList.toggle('active', next);
      burger.setAttribute('aria-expanded', String(next));
      burger.setAttribute('aria-label', next ? 'Закрыть меню' : 'Открыть меню');
    });
  
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Открыть меню');
        burger.focus();
      }
    });
  
    // Закрытие при клике вне меню
    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('active')) return;
      if (nav.contains(e.target) || burger.contains(e.target)) return;
  
      nav.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Открыть меню');
    });
  })();
  
  
  /* ==========================================
     2. ПРОВЕРКА СОВПАДЕНИЯ ПАРОЛЕЙ
     ========================================== */
  (function initPasswordCheck() {
    const form = document.querySelector('.form_registration');
    if (!form) return;
  
    const password = form.querySelector('input[name="password"]');
    const confirm = form.querySelector('input[name="password_confirm"]');
  
    if (!password || !confirm) return;
  
    function checkMatch() {
      if (!confirm.value) {
        confirm.setCustomValidity('');
        return true;
      }
  
      if (password.value !== confirm.value) {
        confirm.setCustomValidity('Пароли не совпадают');
        return false;
      }
  
      confirm.setCustomValidity('');
      return true;
    }
  
    password.addEventListener('input', checkMatch);
    confirm.addEventListener('input', checkMatch);
  
    form.addEventListener('submit', (e) => {
      if (!checkMatch()) {
        e.preventDefault();
        confirm.reportValidity();
      }
    });
  })();
  
  
  /* ==========================================
     3. КНОПКА "В КОРЗИНУ" — небольшая обратная связь
     ========================================== */
  (function initCartButtons() {
    const buttons = document.querySelectorAll('.product-card__button');
  
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const originalText = btn.textContent;
        btn.textContent = '✓ Добавлено';
        btn.disabled = true;
  
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 1500);
      });
    });
  })();
