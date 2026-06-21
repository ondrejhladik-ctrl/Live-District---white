/**
 * Image optimization script — Live District
 * Converts JPG/PNG → WebP, generates responsive sizes
 * Usage: node optimize-images.js
 */

const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

const SRC_DIR  = __dirname;
const OUT_DIR  = path.join(__dirname, 'webp');

// Sizes to generate per image type
const SIZES = {
  foto: [400, 800, 1200],   // artist card photos
  hero: [800, 1200, 1920],  // hero / fullscreen images
  other: [400, 800, 1200],
};

const WEBP_QUALITY  = 82;
const AVIF_QUALITY  = 60;

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

function getType(name) {
  if (name.includes('foto')) return 'foto';
  if (name.includes('hero')) return 'hero';
  return 'other';
}

async function processImage(file) {
  const ext  = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

  // Skip the poster image (tiny anyway)
  if (file.startsWith('Lboy OX')) return;

  const base  = path.basename(file, ext);
  const type  = getType(base);
  const sizes = SIZES[type];
  const src   = path.join(SRC_DIR, file);

  console.log(`\n→ ${file} (${type})`);

  const meta = await sharp(src).metadata();

  for (const w of sizes) {
    if (w > meta.width * 1.1) continue; // don't upscale

    // WebP
    const webpOut = path.join(OUT_DIR, `${base}-${w}.webp`);
    await sharp(src)
      .resize(w, null, { withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 5 })
      .toFile(webpOut);

    const sizeBefore = fs.statSync(src).size;
    const sizeAfter  = fs.statSync(webpOut).size;
    console.log(`  ${w}w WebP: ${(sizeAfter/1024).toFixed(0)} KB  (bylo ${(sizeBefore/1024/1024).toFixed(1)} MB)`);
  }

  // Also output a full-size WebP (capped at 1920)
  const fullW   = Math.min(meta.width, 1920);
  const fullOut = path.join(OUT_DIR, `${base}.webp`);
  await sharp(src)
    .resize(fullW, null, { withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 5 })
    .toFile(fullOut);
  console.log(`  full WebP: ${(fs.statSync(fullOut).size/1024).toFixed(0)} KB`);
}

(async () => {
  const files = fs.readdirSync(SRC_DIR)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f));

  console.log(`Found ${files.length} images to process…`);

  for (const f of files) {
    try { await processImage(f); }
    catch (e) { console.error(`  ERROR: ${f} — ${e.message}`); }
  }

  console.log('\n✓ Done! Images saved to ./webp/');
})();
