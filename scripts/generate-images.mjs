/**
 * Rasterizes the brand SVGs in public/ to PNGs that social platforms, Google,
 * and AI answer engines can actually render (SVG OG images don't display).
 *
 *   public/og-default.svg  -> public/og-default.png  (1200x630 share/card image)
 *   public/favicon.svg     -> public/logo.png        (512x512 Organization.logo)
 *
 * Re-run after editing either SVG:  node scripts/generate-images.mjs
 * Uses `sharp` (already present via Astro's image service).
 */
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PUB = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

async function render(svgFile, outFile, width, height, density) {
  const svg = readFileSync(join(PUB, svgFile));
  await sharp(svg, { density })
    .resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(PUB, outFile));
  console.log(`[images] wrote public/${outFile} (${width}x${height})`);
}

// og-default: intrinsic 1200x630; supersample at 144 DPI then downscale for crisp text.
await render('og-default.svg', 'og-default.png', 1200, 630, 144);
// logo: 64x64 glyph rendered at high density for a sharp 512x512 square.
await render('favicon.svg', 'logo.png', 512, 512, 600);
