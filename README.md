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

GitHub caps git-tracked files at 100 MB, but **release assets allow up to
2 GB** — the installer is published as a GitHub Release asset, not a repo file.
The site's `installerUrl` already points at
`https://github.com/monyasau/car-typer/releases/latest/download/CarTyper-Setup-1.3.0.exe`
which always routes to the newest release, so future versions keep working as
long as the asset keeps the same filename.

To publish a new installer:

1. Build it in the app repo (`pnpm package` → `release/CarTyper Setup X.Y.Z.exe`)
2. Copy it into `downloads/` here (gitignored — local staging only)
3. Upload as a release asset — web UI: **Releases → Draft a new release →
   tag `vX.Y.Z` → drag the .exe onto the box → Publish**, or via the API:

```bash
curl -X POST \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Content-Type: application/octet-stream" \
  --data-binary @downloads/CarTyper-Setup-X.Y.Z.exe \
  "https://uploads.github.com/repos/monyasau/car-typer/releases/<release_id>/assets?name=CarTyper-Setup-X.Y.Z.exe"
```

Then update `installerUrl` (and `installerSize`/`version`) in `index.html` if
the filename changed.

## Verify locally

```bash
npm run serve        # http://localhost:4180
```
