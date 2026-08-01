/**
 * programs.js — dynamic CMS event stream + booking/inquiry form for
 * programs.html. Content editors manage /content/events.json via the
 * /admin CMS dashboard; no code changes are required to add an event.
 */
(function () {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  async function loadEvents() {
    const grid = document.getElementById('event-grid');
    if (!grid) return;
    try {
      const res = await fetch('content/events.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('events.json not found');
      const data = await res.json();
      renderEvents(grid, data.items || []);
    } catch (err) {
      grid.innerHTML = '<p class="state-msg">Upcoming sessions will appear here shortly. Please check back soon.</p>';
      console.warn(err);
    }
  }

  const CATEGORY_ICONS = {
    'Heritage Hub': 'fa-palette',
    'SOS Framework': 'fa-shield-heart',
    'Early Years': 'fa-seedling',
  };

  function renderEvents(grid, events) {
    if (!events.length) {
      grid.innerHTML = '<p class="state-msg">No sessions are scheduled right now — new dates are added regularly.</p>';
      return;
    }
    const sorted = [...events].sort((a, b) => {
      const da = new Date(a.date);
      const db = new Date(b.date);
      const aValid = !isNaN(da);
      const bValid = !isNaN(db);
      if (aValid && bValid) return da - db;
      if (aValid) return -1;
      if (bValid) return 1;
      return 0;
    });
    grid.innerHTML = sorted.map((ev, index) => {
      const d = new Date(ev.date);
      const hasDate = !isNaN(d);
      const dateBadge = hasDate
        ? `<div class="event-date-badge"><span class="day">${d.getDate()}</span><span class="month">${MONTHS[d.getMonth()]}</span></div>`
        : `<div class="event-date-badge"><span class="day">&mdash;</span><span class="month">${ev.date || 'Soon'}</span></div>`;

      const icon = CATEGORY_ICONS[ev.category] || 'fa-calendar-star';
      const visual = ev.image
        ? `<img class="event-image" src="${ev.image}" alt="${ev.title}" loading="lazy">`
        : `<div class="event-image-fallback"><i class="fa-solid ${icon}" aria-hidden="true"></i></div>`;

      const featuredClass = index === 0 ? ' is-featured' : '';

      return `
        <article class="event-card reveal${featuredClass}">
          <div class="event-visual">
            ${visual}
            ${dateBadge}
            <span class="event-tag-badge">${ev.category}</span>
          </div>
          <div class="event-body">
            <h4>${ev.title}</h4>
            <p>${ev.summary}</p>
            <div class="event-meta"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${ev.location}</div>
          </div>
        </article>
      `;
    }).join('');

    document.querySelectorAll('#event-grid .reveal').forEach((el) => el.classList.add('is-visible'));
  }

  function wireForm() {
    const form = document.getElementById('inquiry-form');
    if (!form) return;
    document.addEventListener('settings:ready', (e) => {
      form.dataset.email = e.detail.email;
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const success = document.getElementById('inquiry-success');
      const endpoint = form.dataset.formspreeEndpoint;
      const data = new FormData(form);

      if (endpoint && !endpoint.includes('YOUR_FORM_ID')) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            body: data,
            headers: { Accept: 'application/json' },
          });
          if (res.ok) {
            form.reset();
            if (success) success.classList.add('is-visible');
            return;
          }
          throw new Error(`Formspree responded with ${res.status}`);
        } catch (err) {
          console.warn('Formspree submission failed, falling back to an email draft:', err);
        }
      }

      const email = form.dataset.email || 'safespacenottscic@gmail.com';
      const subject = encodeURIComponent(`Programs Inquiry: ${data.get('inquiry_type') || 'General'}`);
      const body = encodeURIComponent(
        `Name: ${data.get('name')}\nOrganisation: ${data.get('organisation') || 'N/A'}\nEmail: ${data.get('email')}\nInquiry type: ${data.get('inquiry_type')}\n\nMessage:\n${data.get('message')}`
      );
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
      if (success) success.classList.add('is-visible');
    });
  }

  loadEvents();
  wireForm();
})();
