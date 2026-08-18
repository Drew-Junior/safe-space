(function () {
  const COLOR_CLASSES = ['c-royal', 'c-purple', 'c-lime'];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildPills(list) {
    const doubled = [...list, ...list];
    return doubled.map((q, i) => {
      const cls = COLOR_CLASSES[i % COLOR_CLASSES.length];
      return `<span class="quote-pill ${cls}">${q.text}</span>`;
    }).join('');
  }

  async function loadQuotes() {
    const section = document.getElementById('quote-marquee-section');
    const track1 = document.getElementById('marquee-track-1');
    const track2 = document.getElementById('marquee-track-2');
    if (!section || !track1 || !track2) return;

    try {
      const res = await fetch('content/quotes.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('quotes.json not found');
      const data = await res.json();
      const all = data.items || [];
      if (!all.length) { section.style.display = 'none'; return; }

      const shuffled = shuffle(all);
      const half = Math.ceil(shuffled.length / 2);
      const rowA = shuffled.slice(0, half);
      const rowB = shuffled.slice(half).length ? shuffled.slice(half) : shuffled.slice(0, half);

      track1.innerHTML = buildPills(rowA);
      track2.innerHTML = buildPills(rowB);

      wireScrollTilt();
    } catch (err) {
      section.style.display = 'none';
      console.warn('Could not load quotes.json:', err);
    }
  }

  function wireScrollTilt() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const row1 = document.getElementById('marquee-row-1');
    const row2 = document.getElementById('marquee-row-2');
    let lastY = window.scrollY;
    let ticking = false;
    let resetTimer = null;

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const delta = window.scrollY - lastY;
        lastY = window.scrollY;
        const skew = Math.max(-6, Math.min(6, delta * 0.6));
        const scale = 1 + Math.min(Math.abs(skew), 6) * 0.006;
        row1.style.transform = `rotate(${skew}deg) scale(${scale})`;
        row2.style.transform = `rotate(${-skew}deg) scale(${scale})`;
        ticking = false;

        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          row1.style.transform = 'rotate(0deg) scale(1)';
          row2.style.transform = 'rotate(0deg) scale(1)';
        }, 220);
      });
    }, { passive: true });
  }

  loadQuotes();
})();
