# CarTyper Website

Static marketing site for **CarTyper** — the retro arcade typing race for schools
(app repo: [monyasau/cartyper](https://github.com/monyasau/cartyper)).

Clean light mode, vanilla HTML + a little vanilla JS, Tailwind v4 compiled to exactly
the utilities the page uses (no CDN, no runtime framework). Every link has a real
`href` in the HTML, and content stays visible if JS is blocked.

```
car-typer/
  index.html            the whole page
  css/input.css         Tailwind v4 source (fonts, custom bits, @source scan)
  css/styles.css        BUILT output — commit this, don't hand-edit
  js/main.js            mobile menu, link wiring, reveal-on-scroll
  js/demo.js            hero typing demo + platform-aware download buttons
  assets/
    logo.png            app logo (96px — displayed at 40px/32px)
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
nginx, your VPS). Page assets use relative paths.

The one exception: social-card tags (`canonical`, `og:url`, `og:image`,
`twitter:image`) need **absolute** URLs. They currently point at
`https://monyasau.github.io/car-typer/` — update them in `<head>` if you deploy
elsewhere.

Link targets are configured in the `window.CARTYPER_SITE` block at the top of
`index.html`. The same values are also written directly into the HTML (hrefs
and fallback text) so the page works without JS — keep the two in sync:

- `playUrl` — where the playable web build lives (default `play/`)
- `installerUrl` — GitHub Release asset URL (default `.../releases/download/latest/CarTyper-setup.exe`)
- `installerSize` — text under the download button
- `version` — shown on the download card and in the footer

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

GitHub caps git-tracked files at 100 MB, but **release assets allow up to
2 GB** — the installer is published as a GitHub Release asset, not a repo file.
The site's `installerUrl` points at
`https://github.com/monyasau/car-typer/releases/download/latest/CarTyper-setup.exe`
— the asset `CarTyper-setup.exe` on the release tagged **`latest`**. The URL
never changes, so shipping a new build means replacing that one asset.

To publish a new installer:

1. Build it in the app repo (`pnpm package` → `release/CarTyper Setup X.Y.Z.exe`)
2. Copy it into `downloads/` here as `CarTyper-setup.exe` (gitignored — local staging only)
3. Open the **`latest`** release on GitHub → **Edit** → delete the old
   `CarTyper-setup.exe` → drag the new one in → **Update release**

Then update `installerSize` in `index.html` if the size changed.

## Verify locally

```bash
npm run serve        # http://localhost:4180  (npx serve)
```
