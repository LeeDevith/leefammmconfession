/* Theme handling */
(function theme() {
  const root = document.documentElement;
  const toggle = () => root.classList.toggle('light');
  const btn = document.getElementById('theme-toggle');
  const key = 'site-theme';
  function applySaved() {
    const saved = localStorage.getItem(key);
    if (saved === 'light') root.classList.add('light');
  }
  function persist() {
    const mode = root.classList.contains('light') ? 'light' : 'dark';
    localStorage.setItem(key, mode);
    if (btn) btn.textContent = mode === 'light' ? '🌞' : '🌙';
  }
  document.addEventListener('DOMContentLoaded', () => {
    applySaved();
    persist();
    if (btn) {
      btn.addEventListener('click', () => { toggle(); persist(); });
    }
  });
})();

/* Mobile navigation */
(function mobileNav() {
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;
    function open() { menu.classList.add('open'); toggle.setAttribute('aria-expanded', 'true'); }
    function close() { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      expanded ? close() : open();
    });
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  });
})();

/* Smooth scrolling */
(function smoothScroll() {
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const anchor = target.closest('a[href^="#"]');
    if (!anchor) return;
    const id = anchor.getAttribute('href');
    if (!id) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

/* Contact form validation */
(function contactForm() {
  function setError(field, message) {
    const small = field.parentElement?.querySelector('small.error');
    if (small) small.textContent = message || '';
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
  }
  function validate(form) {
    let ok = true;
    const name = form.elements.namedItem('name');
    const email = form.elements.namedItem('email');
    const message = form.elements.namedItem('message');
    if (name instanceof HTMLInputElement) {
      const valid = name.value.trim().length >= 2;
      setError(name, valid ? '' : 'Please enter your name.');
      ok &&= valid;
    }
    if (email instanceof HTMLInputElement) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const valid = re.test(email.value);
      setError(email, valid ? '' : 'Please enter a valid email.');
      ok &&= valid;
    }
    if (message instanceof HTMLTextAreaElement) {
      const valid = message.value.trim().length >= 10;
      setError(message, valid ? '' : 'Message should be at least 10 characters.');
      ok &&= valid;
    }
    return ok;
  }
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const status = document.querySelector('.form-status');
    const year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
    if (!(form instanceof HTMLFormElement)) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate(form)) return;
      if (status) status.textContent = 'Sending…';
      // Simulate async submit
      await new Promise((r) => setTimeout(r, 900));
      if (status) status.textContent = 'Thanks! Your message has been sent.';
      form.reset();
    });
  });
})();
