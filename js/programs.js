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
      if (aValid) return -1;   // real dates sort before "Coming Soon"-style entries
      if (bValid) return 1;
      return 0;
    });
    grid.innerHTML = sorted.map((ev) => {
      const d = new Date(ev.date);
      const hasDate = !isNaN(d);
      const dateBadge = hasDate
        ? `<span class="day">${d.getDate()}</span><span>${MONTHS[d.getMonth()]} ${d.getFullYear()}</span>`
        : `<span class="day">&mdash;</span><span>${ev.date || 'Coming Soon'}</span>`;
      const image = ev.image
        ? `<img class="event-image" src="${ev.image}" alt="${ev.title}" loading="lazy">`
        : '';
      return `
        <article class="event-card reveal">
          ${image}
          <div class="event-date">
            ${dateBadge}
          </div>
          <div class="event-body">
            <span class="event-tag">${ev.category}</span>
            <h4>${ev.title}</h4>
            <p>${ev.summary}</p>
            <p class="form-note"> ${ev.location}</p>
          </div>
        </article>
      `;
    }).join('');

    // Re-observe newly injected .reveal elements
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

  if (endpoint && !endpoint.includes('https://formspree.io/f/mqeroyjo')) {
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
