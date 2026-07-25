# Content Manager (`/admin`) — Setup Notes

This folder gives non-technical staff a browser dashboard at `/admin` to
edit navigation, contact details, upcoming events, and gallery photos,
without touching code. It uses **Decap CMS** (formerly Netlify CMS),
per Option B in the technical brief.

## No password is stored anywhere in this project

The brief listed one shared admin password. That has **not** been
placed anywhere in these files, and it shouldn't be — a static site's
HTML/JS/config is either public or, at best, sits in a Git repo people
often forget is exposed; a shared password baked into any of that is a
standing security risk, and it also means every staff member shares
one login with no way to tell who changed what. Use one of the two
real auth setups below instead — both give each editor their own
account.

## Option 1 — Netlify hosting (fastest to set up)

1. Deploy this site to Netlify (drag-and-drop the folder, or connect
   the Git repo).
2. In the Netlify dashboard: **Site settings → Identity → Enable
   Identity**.
3. Under **Identity → Registration**, set it to **Invite only**.
4. Under **Identity → Services**, enable **Git Gateway**. This lets
   Decap commit content changes back to the repo on editors' behalf,
   without giving them raw Git/GitHub access.
5. Invite each staff member by email from **Identity → Invite users**.
   They'll set their own password on first login — nobody shares one.
6. Staff log in at `https://yoursite.com/admin/`.

`admin/config.yml` is already set to `backend: name: git-gateway`, so
no further config changes are needed for this option.

## Option 2 — Any other host (GitHub OAuth backend)

If you're not hosting on Netlify, swap the backend in
`admin/config.yml` to:

```yaml
backend:
  name: github
  repo: your-org/your-repo-name
  branch: main
```

You'll then need a small OAuth provider (Decap's docs list a one-click
Netlify function or a self-hosted option) so GitHub can authenticate
editors — again, each with their own GitHub account, not a shared
password. See: https://decapcms.org/docs/github-backend/

## What editors can change from the dashboard

- **Site Settings** — organisation name, address, email, nav links,
  footer text, header CTA button
- **Programs & Events** — add/edit/remove upcoming sessions shown on
  `programs.html`
- **Gallery** — add/edit/remove photos and captions shown on
  `gallery.html`, organised by category

Everything else (page layout, design, copy blocks not listed above)
lives directly in the HTML/CSS and should be edited by a developer.
