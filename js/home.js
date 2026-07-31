/**
 * home.js — homepage-only. Applies the hero and about-section background
 * images once settings.json has loaded (partials.js dispatches
 * "settings:ready" after rendering the header/footer). Falls back to the
 * default CSS brand-gradient panels defined in style.css if no image has
 * been set via Site Settings in the CMS.
 */
document.addEventListener('settings:ready', (e) => {
  const settings = e.detail;

  const hero = document.getElementById('hero-visual');
  if (hero && settings.hero_image) {
    hero.style.backgroundImage =
      `linear-gradient(180deg, rgba(0,0,45,0.45), rgba(0,0,45,0.72)), url('${settings.hero_image}')`;
    hero.classList.add('has-image');
  }

  const about = document.getElementById('about-visual');
  if (about && settings.about_image) {
    about.style.backgroundImage = `url('${settings.about_image}')`;
    about.classList.add('has-image');
  }
});
