# CarTyper Website

Static marketing site for **CarTyper** — the retro arcade typing race for schools
(app repo: [monyasau/cartyper](https://github.com/monyasau/cartyper)).

Clean light mode, vanilla HTML + ~70 lines of JS, Tailwind v4 compiled to exactly
the utilities the page uses (~6 KB CSS, no CDN, no runtime framework).

```
car-typer/
  index.html            the whole page
  css/input.css         Tailwind v4 source (fonts, custom bits, @source scan)
  css/styles.css        BUILT output — commit this, don't hand-edit
  js/main.js            mobile menu, link wiring, reveal-on-scroll
  assets/
    logo.png            app logo (downscaled)
    favicon.png
    shots/*.jpg         real screenshots captured from the running app
    cars/*.svg          car art for the hero strip
    fonts/*.woff2       Outfit + Press Start 2P (bundled, offline-first)
  play/                 THE WEB APP — copy of the app's built dist/ (full game)
  downloads/            Windows installer goes here (gitignored — see below)
  scripts/build-site-css.js   CSS build (postcss, no network needed)
```

## Deploy

Upload the whole folder to any static host (GitHub Pages, Netlify, Vercel,
nginx, your VPS). Everything is relative paths — no config required.

Link targets are configured in the `window.CARTYPER_SITE` block at the top of
`index.html`:

- `playUrl` — where the playable web build lives (default `play/`)
- `installerUrl` — installer filename (default `downloads/CarTyper-Setup-1.3.0.exe`)
- `installerSize` — text under the download button
- `version` — text under the download button

## Building the CSS (extract only what we need)

The output CSS contains only utilities actually used in `index.html` (Tailwind
v4 content scanning via `@source`; auto project-wide detection is disabled with
`source(none)` — without it the build pulls in thousands of unused utilities).

```bash
npm install          # one-time: postcss + @tailwindcss/postcss + autoprefixer
npm run build:css    # node scripts/build-site-css.js
```

Rebuild after editing classes in `index.html`. No network needed at build time
after the one-time install.

## Refreshing the playable web app

`play/` is the built web game (full feature parity — races, garage, shop,
achievements — on a localStorage backend). Refresh it after app updates:

```bash
# from the app repo (monyasau/cartyper): the built dist/ already uses
# relative asset paths, so it works in a subfolder
rm -rf ../car-typer/play && cp -r dist ../car-typer/play
```

## Shipping the Windows installer

GitHub rejects files over 100 MB, so `downloads/` is gitignored. Locally, drop
the latest installer in (e.g. `CarTyper Setup 1.3.0.exe` from the app's
`release/` folder) and keep `installerUrl` in `index.html` in sync. The
`downloads/` folder is part of the deploy — it just isn't in git.

## Verify locally

```bash
npm run serve        # http://localhost:4180
```
