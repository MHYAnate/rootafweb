// scripts/generate-pwa-icons.mjs

import { existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const ICON_SIZES = [48, 72, 96, 120, 128, 144, 152, 180, 192, 256, 384, 512];
const MASKABLE_SIZES = [192, 512];
const SHORTCUT_NAMES = ['dashboard', 'members', 'products', 'events'];

// Ensure directories
['public/images/icons', 'public/images/splash', 'public/images/screenshots'].forEach((dir) => {
  const full = resolve(ROOT, dir);
  if (!existsSync(full)) {
    mkdirSync(full, { recursive: true });
    console.log(`✅ Created: ${dir}`);
  }
});

console.log(`
╔════════════════════════════════════════════════════════════════╗
║              RootAF PWA Icon Generation                       ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Source: public/images/rootaf.jpeg                             ║
║                                                                ║
║  QUICK METHOD:                                                 ║
║  → https://www.pwabuilder.com/imageGenerator                   ║
║  → Upload rootaf.jpeg → extract to public/images/icons/        ║
║                                                                ║
║  For splash screens:                                           ║
║  → https://progressier.com/pwa-icons-and-splash-screen-generator ║
║                                                                ║
║  AUTO-GENERATE:                                                ║
║  npm i -D sharp && node scripts/generate-pwa-icons.mjs         ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);

try {
  const sharp = await import('sharp');
  const SOURCE = resolve(ROOT, 'public/images/rootaf.jpeg');

  if (!existsSync(SOURCE)) {
    console.log('⚠️  Source not found: public/images/rootaf.jpeg');
    process.exit(0);
  }

  console.log('🎨 Generating icons...\n');

  for (const size of ICON_SIZES) {
    await sharp.default(SOURCE)
      .resize(size, size, { fit: 'cover' })
      .png({ quality: 95 })
      .toFile(resolve(ROOT, `public/images/icons/icon-${size}x${size}.png`));
    console.log(`  ✅ icon-${size}x${size}.png`);
  }

  for (const size of MASKABLE_SIZES) {
    const inner = Math.round(size * 0.8);
    const buf = await sharp.default(SOURCE)
      .resize(inner, inner, { fit: 'cover' })
      .png()
      .toBuffer();
    await sharp.default({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 74, g: 157, b: 110, alpha: 1 },
      },
    })
      .composite([{ input: buf, gravity: 'center' }])
      .png({ quality: 95 })
      .toFile(resolve(ROOT, `public/images/icons/maskable-icon-${size}x${size}.png`));
    console.log(`  ✅ maskable-icon-${size}x${size}.png`);
  }

  await sharp.default(SOURCE)
    .resize(180, 180, { fit: 'cover' })
    .png({ quality: 95 })
    .toFile(resolve(ROOT, 'public/images/icons/apple-touch-icon.png'));
  console.log('  ✅ apple-touch-icon.png');

  await sharp.default(SOURCE)
    .resize(72, 72, { fit: 'cover' })
    .png({ quality: 95 })
    .toFile(resolve(ROOT, 'public/images/icons/badge-72x72.png'));
  console.log('  ✅ badge-72x72.png');

  for (const name of SHORTCUT_NAMES) {
    await sharp.default(SOURCE)
      .resize(96, 96, { fit: 'cover' })
      .png({ quality: 95 })
      .toFile(resolve(ROOT, `public/images/icons/shortcut-${name}.png`));
    console.log(`  ✅ shortcut-${name}.png`);
  }

  console.log('\n🎉 Done! Splash screens require manual creation.');
} catch {
  console.log('ℹ️  Sharp not available. Install: npm i -D sharp');
}