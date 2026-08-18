/* Build css/styles.css from css/input.css using this repo's own installed
   postcss + @tailwindcss/postcss + autoprefixer. No network at build time.
   Run from the repo root:  node scripts/build-site-css.js   (or: npm run build:css) */
const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const cfg = require(path.join(__dirname, "..", "postcss.config.js"));
const from = path.join(__dirname, "..", "css", "input.css");
const to = path.join(__dirname, "..", "css", "styles.css");

// Convert { pluginName: opts } into real PostCSS plugin functions
const plugins = Object.entries(cfg.plugins)
  .filter(([, opts]) => opts !== false)
  .map(([name, opts]) => require(name)(opts || {}));

postcss(plugins)
  .process(fs.readFileSync(from, "utf8"), { from, to })
  .then((result) => {
    fs.writeFileSync(to, result.css);
    console.log(`built ${to} (${(result.css.length / 1024).toFixed(1)} KB)`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
