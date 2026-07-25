/**
 * partials.js
 * Renders the site header and footer from /content/settings.json so that
 * non-technical staff can edit navigation, contact details, and the
 * registration/legal footer text from the CMS admin dashboard in one
 * place, instead of editing HTML on every page.
 */
(function () {
  const CURRENT_PAGE = document.body.getAttribute('data-page') || '';

  async function loadSettings() {
    try {
      const res = await fetch('content/settings.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('settings.json not found');
      return await res.json();
    } catch (err) {
      console.warn('Falling back to default settings:', err);
      // Minimal fallback so the site still renders if the CMS file is
      // temporarily unavailable (e.g. first deploy before content is added).
      return {
        org_name: 'Safe Space - Notts CIC',
        org_short: 'Safe Space',
        reg_number: '17232039',
        entity_type: 'Community Interest Company (Asset-Locked)',
        address: '63-65 Croydon Road, Nottingham, NG7 3DS',
        email: 'safespacenottscic@gmail.com',
        logo_image: '',
        socials: [{ platform: 'LinkedIn', url: '#' }],
        nav: [
          { label: 'Home', href: 'index.html' },
          { label: 'About', href: 'index.html#about' },
          { label: 'Services', href: 'services.html' },
          { label: 'Programs', href: 'programs.html' },
          { label: 'Gallery', href: 'gallery.html' },
          { label: 'Board', href: 'board.html' }
        ],
        cta_label: 'Partner With Us',
        cta_href: 'programs.html#inquiry'
      };
    }
  }

  function renderHeader(settings) {
    const mount = document.getElementById('site-header');
    if (!mount) return;

    const navItems = settings.nav.map((item) => {
      const isCurrent = item.href.split('#')[0] === CURRENT_PAGE;
      return `<li><a href="${item.href}" ${isCurrent ? 'aria-current="page"' : ''}>${item.label}</a></li>`;
    }).join('');

    const logoMark = settings.logo_image
      ? `<img src="${settings.logo_image}" alt="${settings.org_name} logo" class="brand-logo-img">`
      : `<span class="brand-mark" aria-hidden="true"></span>`;

    mount.innerHTML = `
      <div class="container nav-row">
        <a class="brand" href="index.html">
          ${logoMark}
          <span>${settings.org_short}
            <small>Notts CIC</small>
          </span>
        </a>
        <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="primary-nav">
          <span></span>
        </button>
        <ul class="nav-links" id="primary-nav">
          ${navItems}
          <li><a class="btn btn-primary" href="${settings.cta_href}">${settings.cta_label}</a></li>
        </ul>
      </div>
    `;

    const toggle = mount.querySelector('.nav-toggle');
    const links = mount.querySelector('.nav-links');
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  function renderFooter(settings) {
    const mount = document.getElementById('site-footer');
    if (!mount) return;

    const navItems = settings.nav.map((item) => `<li><a href="${item.href}">${item.label}</a></li>`).join('');
    const year = new Date().getFullYear();
    const footerLogo = settings.logo_image
      ? `<img src="${settings.logo_image}" alt="${settings.org_name} logo" class="brand-logo-img">`
      : `<span class="brand-mark" aria-hidden="true"></span>`;
    const socialLinks = (settings.socials || []).map((s) => {
      const initials = s.platform.slice(0, 2).toUpperCase();
      return `<a href="${s.url}" aria-label="${settings.org_short} on ${s.platform}" target="_blank" rel="noopener">${initials}</a>`;
    }).join('');

    mount.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="brand" href="index.html">
              ${footerLogo}
              <span>${settings.org_name}</span>
            </a>
            <p>A structured, measurable transformation platform bridging youth potential, psychological safety, and real marketplace opportunity across Nottinghamshire.</p>
            <span class="footer-legal-badge">Asset-Locked Community Interest Company</span>
          </div>
          <div>
            <h4>Explore</h4>
            <ul class="footer-links">${navItems}</ul>
          </div>
          <div>
            <h4>Contact &amp; Registration</h4>
            <ul class="footer-links">
              <li>${settings.address}</li>
              <li><a href="mailto:${settings.email}">${settings.email}</a></li>
              <li>Company Reg. No. ${settings.reg_number}</li>
              <li>${settings.entity_type}</li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${year} ${settings.org_name}. All rights reserved.</span>
          <div class="social-row">
            ${socialLinks}
          </div>
        </div>
      </div>
    `;
  }

  loadSettings().then((settings) => {
    renderHeader(settings);
    renderFooter(settings);
    document.dispatchEvent(new CustomEvent('settings:ready', { detail: settings }));
  });
})();
