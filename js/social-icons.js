window.SafeSpaceSocialIcons = (function () {
  const ICONS = {
    facebook: 'fa-brands fa-facebook-f',
    instagram: 'fa-brands fa-instagram',
    linkedin: 'fa-brands fa-linkedin-in',
    x: 'fa-brands fa-x-twitter',
    twitter: 'fa-brands fa-x-twitter',
    tiktok: 'fa-brands fa-tiktok',
    youtube: 'fa-brands fa-youtube',
    whatsapp: 'fa-brands fa-whatsapp',
    threads: 'fa-brands fa-threads',
  };

  function iconClass(platform) {
    const key = (platform || '').trim().toLowerCase();
    return ICONS[key] || 'fa-solid fa-link';
  }

  function renderLink(platform, url, ownerLabel) {
    const cls = iconClass(platform);
    const label = `${ownerLabel || ''} on ${platform}`.trim();
    return `<a href="${url}" aria-label="${label}" target="_blank" rel="noopener"><i class="${cls}" aria-hidden="true"></i></a>`;
  }

  return { iconClass, renderLink };
})();
