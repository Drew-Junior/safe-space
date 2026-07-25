/**
 * board.js — populates director photos (and could extend to name/role/etc.)
 * from /content/board.json so photos can be updated via the /admin CMS
 * without touching HTML. Any <img data-director="KEY"> on the page is
 * filled in from the matching entry's "photo" field.
 */
(function () {
  async function loadBoard() {
    const photoTargets = document.querySelectorAll('[data-director]');
    const socialTargets = document.querySelectorAll('[data-director-socials]');
    if (!photoTargets.length && !socialTargets.length) return;

    try {
      const res = await fetch('content/board.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('board.json not found');
      const data = await res.json();
      const directors = data.directors || [];

      photoTargets.forEach((img) => {
        const key = img.getAttribute('data-director');
        const match = directors.find((d) => d.key === key);
        if (match && match.photo) {
          img.src = match.photo;
          img.alt = `Portrait of ${match.name}`;
        }
      });

      socialTargets.forEach((container) => {
        const key = container.getAttribute('data-director-socials');
        const match = directors.find((d) => d.key === key);
        const socials = (match && match.socials) || [];
        if (socials.length && window.SafeSpaceSocialIcons) {
          container.innerHTML = socials.map((s) =>
            window.SafeSpaceSocialIcons.renderLink(s.platform, s.url, match.name)
          ).join('');
        }
      });
    } catch (err) {
      console.warn('Could not load board.json, keeping placeholder images:', err);
    }
  }

  loadBoard();
})();
