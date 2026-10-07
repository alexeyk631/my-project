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
/* ==========================================
   4. ОТПРАВКА ФОРМ НА СЕРВЕР (API)
   ========================================== */

// -------- Регистрация --------
(function initRegisterForm() {
  const form = document.querySelector(".form_registration");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.querySelector('input[name="username"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const password = form.querySelector('input[name="password"]').value;
    const password_confirm = form.querySelector('input[name="password_confirm"]').value;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password, password_confirm }),
      });
      const data = await res.json();

      if (data.success) {
        alert("✅ Регистрация успешна! Добро пожаловать, " + data.user.name);
        form.reset();
      } else {
        alert("❌ Ошибка: " + data.error);
      }
    } catch (err) {
      alert("❌ Ошибка соединения с сервером");
      console.error(err);
    }
  });
})();

// -------- Вход --------
(function initLoginForm() {
  const form = document.querySelector(".form_login");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.querySelector('input[name="email"]').value;
    const password = form.querySelector('input[name="password"]').value;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        alert("✅ Вход выполнен! Привет, " + data.user.name);
        form.reset();
      } else {
        alert("❌ Ошибка: " + data.error);
      }
    } catch (err) {
      alert("❌ Ошибка соединения с сервером");
      console.error(err);
    }
  });
})();

// -------- Обратная связь --------
(function initFeedbackForm() {
  const form = document.querySelector(".form_feedback");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const subject = form.querySelector('select[name="subject"]').value;
    const message = form.querySelector('textarea[name="message"]').value;

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ subject, message }),
      });
      const data = await res.json();

      if (data.success) {
        alert("✅ Отзыв отправлен!");
        form.reset();
      } else {
        alert("❌ Ошибка: " + data.error);
      }
    } catch (err) {
      alert("❌ Ошибка соединения с сервером");
      console.error(err);
    }
  });
})();

// -------- Поиск --------
(function initSearch() {
  const input = document.querySelector("#search-input");
  const results = document.querySelector("#search-results");
  if (!input || !results) return;

  let timer;

  input.addEventListener("input", () => {
    clearTimeout(timer);
    const q = input.value.trim();

    if (q.length < 2) {
      results.innerHTML = "";
      return;
    }

    timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/search?q=" + encodeURIComponent(q));
        const data = await res.json();

        if (data.success && data.products.length > 0) {
          results.innerHTML = data.products
            .map(
              (p) =>
                `<div class="search-result"><strong>${p.name}</strong> — ${p.price} ₽</div>`
            )
            .join("");
        } else {
          results.innerHTML = "<div class='search-result'>Ничего не найдено</div>";
        }
      } catch (err) {
        console.error(err);
      }
    }, 300);
  });
})();