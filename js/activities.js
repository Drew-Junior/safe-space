(function () {
  async function loadActivities() {
    const grid = document.getElementById('activity-grid');
    if (!grid) return;
    try {
      const res = await fetch('content/activities.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('activities.json not found');
      const data = await res.json();
      renderActivities(grid, data.items || []);
    } catch (err) {
      grid.innerHTML = '<p class="state-msg">Activities will appear here shortly.</p>';
      console.warn(err);
    }
  }

  function renderActivities(grid, items) {
    if (!items.length) {
      grid.innerHTML = '<p class="state-msg">No activities listed yet.</p>';
      return;
    }
    grid.innerHTML = items.map((item) => {
      const visual = item.image
        ? `<img class="activity-image" src="${item.image}" alt="${item.title}" loading="lazy">`
        : `<span class="activity-icon">${item.icon || '✨'}</span>`;
      return `
        <div class="activity-card reveal">
          ${visual}
          <h4>${item.title}</h4>
          <span>${item.category}</span>
        </div>
      `;
    }).join('');
    grid.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  loadActivities();
})();
