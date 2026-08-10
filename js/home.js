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
  const slidesLayer = document.getElementById('hero-slides');

  let heroImages = [];
  if (Array.isArray(settings.hero_images) && settings.hero_images.filter(Boolean).length) {
    heroImages = settings.hero_images.filter(Boolean);
  } else if (settings.hero_image) {
    heroImages = [settings.hero_image];
  }

  if (hero && slidesLayer && heroImages.length) {
    hero.classList.add('has-image');
    heroImages.forEach((src, i) => {
      const slide = document.createElement('div');
      slide.className = 'hero-slide' + (i === 0 ? ' is-active' : '');
      slide.style.backgroundImage = `url('${src}')`;
      slidesLayer.appendChild(slide);
    });

    if (heroImages.length > 1) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduceMotion) {
        let current = 0;
        setInterval(() => {
          const slides = slidesLayer.querySelectorAll('.hero-slide');
          slides[current].classList.remove('is-active');
          current = (current + 1) % slides.length;
          slides[current].classList.add('is-active');
        }, 6000);
      }
    }
  }

  const about = document.getElementById('about-visual');
  if (about && settings.about_image) {
    about.style.backgroundImage = `url('${settings.about_image}')`;
    about.classList.add('has-image');
  }
});
