(() => {
  const mobileNav = document.querySelector('.mobile-nav');
  const compactHeader = window.matchMedia('(max-width: 1150px)');
  if (mobileNav) {
    const syncMenu = () => { mobileNav.open = !compactHeader.matches; };
    syncMenu();
    compactHeader.addEventListener('change', syncMenu);
  }
  const readButton = document.querySelector('[data-read-page]');
  const contrastButton = document.querySelector('[data-contrast]');
  const speech = window.speechSynthesis;
  const storageKey = 'eco-foco-alto-contraste';

  try {
    if (localStorage.getItem(storageKey) === 'true') {
      document.documentElement.classList.add('high-contrast');
    }
  } catch (_) { /* Storage may be unavailable. */ }

  function updateContrast() {
    const active = document.documentElement.classList.contains('high-contrast');
    contrastButton.setAttribute('aria-pressed', String(active));
    contrastButton.title = active ? 'Desativar alto contraste' : 'Ativar alto contraste';
  }

  contrastButton.addEventListener('click', () => {
    document.documentElement.classList.toggle('high-contrast');
    updateContrast();
    try { localStorage.setItem(storageKey, String(document.documentElement.classList.contains('high-contrast'))); } catch (_) {}
  });
  updateContrast();

  if (!speech || !window.SpeechSynthesisUtterance) {
    readButton.disabled = true;
    readButton.title = 'Leitura em voz alta indisponível neste navegador';
    return;
  }

  function updateReading(active) {
    readButton.setAttribute('aria-pressed', String(active));
    readButton.querySelector('.read-label').textContent = active ? 'Parar leitura' : 'Ler página';
  }

  readButton.addEventListener('click', () => {
    if (readButton.getAttribute('aria-pressed') === 'true') {
      speech.cancel();
      updateReading(false);
      return;
    }
    const main = document.querySelector('main');
    if (!main) return;
    const copy = main.cloneNode(true);
    copy.querySelectorAll('script, style, nav, button, input, textarea, select, iframe, video, audio, [aria-hidden="true"]').forEach(el => el.remove());
    const content = copy.innerText || copy.textContent;
    if (!content.trim()) return;
    speech.cancel();
    const utterance = new SpeechSynthesisUtterance(content.replace(/\s+/g, ' ').trim());
    utterance.lang = document.documentElement.lang || 'pt-BR';
    utterance.onend = utterance.onerror = () => updateReading(false);
    updateReading(true);
    speech.speak(utterance);
  });
  window.addEventListener('pagehide', () => speech.cancel());
})();
