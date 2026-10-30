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
    readButton.title = active ? 'Parar leitura' : 'Ler página';
  }

  let readingId = 0;
  let reading = false;

  function stopReading() {
    reading = false;
    readingId++;
    speech.cancel();
    updateReading(false);
  }

  function splitText(text) {
    const words = text.replace(/\s+/g, ' ').trim().split(' ');
    const parts = [];
    let part = '';
    for (const word of words) {
      if (part && (part.length + word.length + 1 > 160 || /[.!?]$/.test(part))) {
        parts.push(part);
        part = '';
      }
      part += (part ? ' ' : '') + word;
    }
    if (part) parts.push(part);
    return parts;
  }

  readButton.addEventListener('click', () => {
    if (reading) {
      stopReading();
      return;
    }
    const main = document.querySelector('main');
    if (!main) return;
    const copy = main.cloneNode(true);
    copy.querySelectorAll('script, style, nav, button, input, textarea, select, iframe, video, audio, [aria-hidden="true"]').forEach(el => el.remove());
    const content = copy.innerText || copy.textContent;
    if (!content.trim()) return;
    stopReading();
    const parts = splitText(content);
    const currentId = readingId;
    let index = 0;
    reading = true;
    updateReading(true);
    const speakNext = () => {
      if (!reading || currentId !== readingId) return;
      if (index >= parts.length) { stopReading(); return; }
      const utterance = new SpeechSynthesisUtterance(parts[index++]);
      utterance.lang = document.documentElement.lang || 'pt-BR';
      utterance.onend = speakNext;
      utterance.onerror = () => { if (currentId === readingId) stopReading(); };
      speech.speak(utterance);
    };
    speakNext();
  });
  window.addEventListener('pagehide', stopReading);
})();
