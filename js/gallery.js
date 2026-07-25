/**
 * gallery.js — CMS-connected gallery grid, category filters, and a
 * dependency-free lightbox viewer. Images are managed by editors via the
 * /admin CMS dashboard (see /content/gallery.json).
 */
(function () {
  let items = [];
  let activeFilter = 'All';

  async function loadGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    try {
      const res = await fetch('content/gallery.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('gallery.json not found');
      const data = await res.json();
      items = data.items || [];
      buildFilters();
      renderGrid();
    } catch (err) {
      grid.innerHTML = '<p class="state-msg">Gallery images will appear here shortly.</p>';
      console.warn(err);
    }
  }

  function buildFilters() {
    const tabWrap = document.getElementById('filter-tabs');
    if (!tabWrap) return;
    const categories = ['All', ...new Set(items.map((i) => i.category))];
    tabWrap.innerHTML = categories.map((cat, idx) => (
      `<button class="filter-tab ${idx === 0 ? 'active' : ''}" data-filter="${cat}">${cat}</button>`
    )).join('');

    tabWrap.querySelectorAll('.filter-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        tabWrap.querySelectorAll('.filter-tab').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        renderGrid();
      });
    });
  }

  function renderGrid() {
    const grid = document.getElementById('gallery-grid');
    const visible = activeFilter === 'All' ? items : items.filter((i) => i.category === activeFilter);

    if (!visible.length) {
      grid.innerHTML = '<p class="state-msg">No images in this category yet.</p>';
      return;
    }

    grid.innerHTML = visible.map((item, idx) => `
      <button class="gallery-item reveal" data-index="${idx}" aria-label="View ${item.title}">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        <span class="gallery-caption">${item.title}</span>
      </button>
    `).join('');

    grid.querySelectorAll('.gallery-item').forEach((el) => el.classList.add('is-visible'));

    grid.querySelectorAll('.gallery-item').forEach((btn) => {
      btn.addEventListener('click', () => openLightbox(visible[Number(btn.dataset.index)]));
    });
  }

  function openLightbox(item) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    if (!lightbox || !img) return;
    img.src = item.image;
    img.alt = item.title;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function wireLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  }

  loadGallery();
  wireLightbox();
})();
