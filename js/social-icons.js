/**
 * social-icons.js — shared icon lookup + link renderer for social links.
 * Used by both the site-wide footer (js/partials.js) and director
 * portfolio pages (js/board.js), so the same platform name always
 * renders the same icon in both places.
 *
 * Uses Font Awesome's brand icon set (loaded via CDN in each page's
 * <head>) — Font Awesome's brand icons exist specifically to be used
 * this way, to link out to an organisation's own official profiles.
 */
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
