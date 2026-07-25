/**
 * board.js — populates director photos (and could extend to name/role/etc.)
 * from /content/board.json so photos can be updated via the /admin CMS
 * without touching HTML. Any <img data-director="KEY"> on the page is
 * filled in from the matching entry's "photo" field.
 */
(function () {
  async function loadBoard() {
    const targets = document.querySelectorAll('[data-director]');
    if (!targets.length) return;
    try {
      const res = await fetch('content/board.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('board.json not found');
      const data = await res.json();
      const directors = data.directors || [];
      targets.forEach((img) => {
        const key = img.getAttribute('data-director');
        const match = directors.find((d) => d.key === key);
        if (match && match.photo) {
          img.src = match.photo;
          img.alt = `Portrait of ${match.name}`;
        }
      });
    } catch (err) {
      console.warn('Could not load board.json, keeping placeholder images:', err);
    }
  }

  loadBoard();
})();
