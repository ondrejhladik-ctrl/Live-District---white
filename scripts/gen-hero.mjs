// Generuje WebP varianty hero fotek profilů z images/large/*.jpg do images/hero/.
// Spuštění:  node scripts/gen-hero.mjs
import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC_DIR = path.join(ROOT, 'images', 'large');
const OUT = path.join(ROOT, 'images', 'hero');

// Hero je full-bleed (přes celou šířku displeje) → větší krajní varianta.
const SIZES = { sm: 768, md: 1280, lg: 1920 };
const QUALITY = { sm: 60, md: 70, lg: 76 };

async function run() {
  if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });
  const files = (await readdir(SRC_DIR)).filter(f => /\.(jpe?g|png)$/i.test(f));
  let totalIn = 0, totalOut = 0;
  for (const file of files) {
    const src = path.join(SRC_DIR, file);
    const meta = await sharp(src).metadata();
    totalIn += (await stat(src)).size;
    const base = file.replace(/\.(jpe?g|png)$/i, '');
    for (const [tag, width] of Object.entries(SIZES)) {
      const w = Math.min(width, meta.width || width);
      const dst = path.join(OUT, `${base}-${tag}.webp`);
      await sharp(src).rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY[tag], effort: 5 })
        .toFile(dst);
      const outSize = (await stat(dst)).size;
      totalOut += outSize;
      console.log(`  ${path.basename(dst).padEnd(26)} ${String(w).padStart(4)}px  ${(outSize/1024).toFixed(0).padStart(5)} KB`);
    }
  }
  console.log(`\nORIGINÁLY: ${(totalIn/1024/1024).toFixed(1)} MB  →  WEBP: ${(totalOut/1024/1024).toFixed(1)} MB`);
}
run().catch(e => { console.error(e); process.exit(1); });
