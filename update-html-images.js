/**
 * HTML image updater — Live District
 * Wraps <img> tags with <picture> + WebP srcset
 * Usage: node update-html-images.js
 */

const fs   = require('fs');
const path = require('path');

const DIR     = __dirname;
const WEBP    = 'webp';

// sizes attribute per image class / context
const SIZES_MAP = {
  'artist-photo': '(max-width:768px) 100vw, (max-width:1100px) 50vw, 33vw',
  'photo':        '(max-width:768px) 100vw, (max-width:900px) 50vw, 33vw',
  'artist-hero-img':   '100vw',
  'about-video':  null, // skip — video
  'bento-item':   '(max-width:768px) 40vw, 20vw',
  'hero-title':   null, // SVG, skip
  'logo':         null,
  'footer-logo-img': null,
  'preloader-logo-img': null,
  'artist-arrow': null,
  'default':      '(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw',
};

function getSizes(classAttr) {
  if (!classAttr) return SIZES_MAP.default;
  for (const [key, val] of Object.entries(SIZES_MAP)) {
    if (classAttr.includes(key)) return val;
  }
  return SIZES_MAP.default;
}

function getWebpVersions(base, type) {
  const sizes = type === 'hero' ? [800, 1200, 1920] : [400, 800, 1200];
  return sizes
    .filter(w => fs.existsSync(path.join(DIR, WEBP, `${base}-${w}.webp`)))
    .map(w => `${WEBP}/${base}-${w}.webp ${w}w`)
    .join(', ');
}

function processHTML(file) {
  let html = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Match <img> tags (single-line, within reason)
  html = html.replace(/<img([^>]+)>/g, (match, attrs) => {
    // Extract src
    const srcMatch = attrs.match(/src="([^"]+)"/);
    if (!srcMatch) return match;
    const src = srcMatch[1];

    // Only process local jpg/png (not http, not SVG, not webp already)
    if (/^http|\.svg$|\.webp$/.test(src)) return match;
    if (!/\.(jpg|jpeg|png)$/i.test(src)) return match;

    const ext  = path.extname(src);
    const base = path.basename(src, ext);

    // Check if full WebP exists
    const fullWebp = path.join(DIR, WEBP, `${base}.webp`);
    if (!fs.existsSync(fullWebp)) return match;

    // Get class attr
    const classMatch = attrs.match(/class="([^"]*)"/);
    const cls = classMatch ? classMatch[1] : '';

    // Skip non-photo elements
    const sizes = getSizes(cls);
    if (sizes === null) return match;

    // Already wrapped in <picture>? Skip
    // (we'll check in the outer replace — just add lazy/decoding if missing)

    const type       = base.includes('hero') ? 'hero' : 'foto';
    const srcset     = getWebpVersions(base, type);

    // Ensure lazy + decoding on the img tag itself
    let newAttrs = attrs;
    if (!newAttrs.includes('loading='))   newAttrs += ' loading="lazy"';
    if (!newAttrs.includes('decoding='))  newAttrs += ' decoding="async"';

    if (!srcset) {
      // No multi-size srcset, just swap to single WebP source
      return `<picture>\n          <source srcset="${WEBP}/${base}.webp" type="image/webp">\n          <img${newAttrs}>\n        </picture>`;
    }

    const sizesAttr = `sizes="${sizes}"`;
    changed = true;
    return `<picture>\n          <source srcset="${srcset}" ${sizesAttr} type="image/webp">\n          <img${newAttrs}>\n        </picture>`;
  });

  // Don't double-wrap: remove <picture><picture>... artifacts (safety)
  html = html.replace(/<picture>\s*<picture>/g, '<picture>');

  if (changed) {
    fs.writeFileSync(file, html, 'utf8');
    console.log(`  ✓ updated: ${path.basename(file)}`);
  } else {
    console.log(`  — no changes: ${path.basename(file)}`);
  }
}

const htmlFiles = fs.readdirSync(DIR)
  .filter(f => f.endsWith('.html'))
  .map(f => path.join(DIR, f));

console.log(`Processing ${htmlFiles.length} HTML files…\n`);
htmlFiles.forEach(processHTML);
console.log('\nDone.');
