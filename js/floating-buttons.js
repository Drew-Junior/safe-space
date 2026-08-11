document.addEventListener('settings:ready', (e) => {
  const settings = e.detail;

  if (settings.whatsapp_number) {
    const wa = document.createElement('a');
    wa.href = `https://wa.me/${settings.whatsapp_number}`;
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.className = 'floating-btn floating-whatsapp';
    wa.setAttribute('aria-label', `Chat with ${settings.org_short || 'us'} on WhatsApp`);
    wa.innerHTML = '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>';
    document.body.appendChild(wa);
  }

  const cta = document.createElement('a');
  cta.href = settings.register_href || settings.cta_href || 'programs.html#inquiry';
  cta.className = 'floating-btn floating-cta';
  cta.setAttribute('aria-label', 'Fill the inquiry form');
  cta.innerHTML = '<i class="fa-solid fa-pen-to-square" aria-hidden="true"></i><span>Register</span>';
  document.body.appendChild(cta);
});
