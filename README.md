# Safe Space - Notts CIC — Website

Static HTML5 / CSS3 / vanilla ES6 build with a Decap CMS admin panel,
per document SSN-DEV-2026-V2.

## Structure

```
index.html                Home
services.html              Services (Cook School, SOS Framework, Early Years)
programs.html               Programs & Events (CMS-connected)
gallery.html                 Gallery (CMS-connected, filterable, lightbox)
board.html                    Board of Directors
director-nancy.html            Executive portfolio — Rev. Min. Nancy Abakah Philips
director-christina.html         Executive portfolio — Christina Ama Aframoah

css/style.css                 Design tokens + all styling
js/partials.js                  Renders header/footer from content/settings.json
js/main.js                       Shared behaviors (scroll reveal, mobile nav)
js/programs.js                    Event stream + inquiry form (programs.html)
js/gallery.js                      Gallery filters + lightbox (gallery.html)

content/settings.json               Site-wide nav, contact & footer text — CMS-editable
content/events.json                  Upcoming events list — CMS-editable
content/gallery.json                  Gallery images list — CMS-editable

admin/index.html                       Decap CMS entry point
admin/config.yml                        Decap CMS collections config
admin/README.md                          CMS auth setup (Netlify Identity or GitHub OAuth)

assets/img/*.svg                          Placeholder gallery/portrait images —
                                            replace with real photography via /admin
```

## Running locally

Any static file server works, e.g.:

```
npx serve .
```

Opening `index.html` directly via `file://` will work for layout, but
the CMS-connected `fetch()` calls in `programs.js` and `gallery.js`
need an actual HTTP server (browsers block `fetch` of local files over
`file://`).

## Deploying

Push to a Git repository and deploy the whole folder as-is to Netlify,
Vercel, GitHub Pages, or any static host — there's no build step.

## CMS admin panel

See `admin/README.md` for the two supported ways to enable `/admin`
login (Netlify Identity + Git Gateway, or a GitHub OAuth backend).
**No password from the original brief is stored in this project** —
see that file for why, and for how real per-editor logins are set up.

## Brand tokens

Colors and font stack are enforced as CSS custom properties at the top
of `css/style.css`, matching the brief exactly:

- Royal Blue `#000080` — structural headers, nav, primary buttons
- Purple `#C000E0` — interactive accents, hover states
- Lime Green `#76CD26` — dividers, badges, highlights
- White `#FFFFFF` — base canvas
- Font stack: Inter / Montserrat, system-ui fallback

## Before going live

- [ ] Replace all `assets/img/*.svg` placeholders with real photography
- [ ] Set the real LinkedIn URL in `content/settings.json`
- [ ] Confirm `safespacenottscic@gmail.com` is the correct public
      contact address (used in the footer and the inquiry form)
- [ ] Set up `/admin` auth per `admin/README.md`
- [ ] Swap in a real logo if one exists (currently a CSS-drawn mark)
