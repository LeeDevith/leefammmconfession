(function(){
  const root = document.body;
  const toggle = document.getElementById('themeToggle');
  const toast = document.getElementById('toast');
  const yearEl = document.getElementById('year');
  if(yearEl){yearEl.textContent = new Date().getFullYear().toString();}

  // Theme
  const THEME_KEY = 'preferred-theme';
  function setTheme(theme){
    if(theme === 'light'){ root.classList.add('light'); }
    else { root.classList.remove('light'); }
    localStorage.setItem(THEME_KEY, theme);
    if(toast){ showToast(`${theme.charAt(0).toUpperCase()+theme.slice(1)} mode`); }
  }
  function getPreferredTheme(){
    const stored = localStorage.getItem(THEME_KEY);
    if(stored){ return stored; }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  function toggleTheme(){ setTheme(root.classList.contains('light') ? 'dark' : 'light'); }
  if(toggle){ toggle.addEventListener('click', toggleTheme); }
  setTheme(getPreferredTheme());

  // Form validation
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      let valid = true;
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      const nameError = document.getElementById('nameError');
      const emailError = document.getElementById('emailError');
      const messageError = document.getElementById('messageError');

      // Reset
      [nameError, emailError, messageError].forEach(el => el.textContent = '');

      if(!name.value.trim()) { nameError.textContent = 'Please enter your name.'; valid = false; }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if(!email.value.trim()) { emailError.textContent = 'Please enter your email.'; valid = false; }
      else if(!emailRegex.test(email.value)) { emailError.textContent = 'Please enter a valid email.'; valid = false; }
      if(!message.value.trim()) { messageError.textContent = 'Please enter a message.'; valid = false; }

      if(valid){
        showToast('Thanks! Your message was sent.');
        form.reset();
      }
    });
  }

  function showToast(text){
    toast.textContent = text;
    toast.hidden = false;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.transition = 'opacity .6s'; toast.style.opacity = '0'; }, 1200);
    setTimeout(() => { toast.hidden = true; toast.style.transition = ''; }, 2000);
  }
})();
