/**
 * main.js — shared, page-agnostic behaviors.
 */
(function () {
  // Netlify Identity: if someone completes an invite or password-recovery
  // link on a public page (that's where Netlify's emails point, not
  // /admin/ directly), send them into the CMS once they're logged in.
  // No-op if this site isn't using the Netlify Identity/Git Gateway backend.
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on('login', () => {
      if (!location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/';
      }
    });
  }

  // Scroll-reveal for elements marked .reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Close mobile nav when a link inside it is clicked
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.nav-links a');
    const nav = document.getElementById('primary-nav');
    if (link && nav && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      const toggle = document.querySelector('.nav-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
