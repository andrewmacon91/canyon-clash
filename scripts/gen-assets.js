// Rasterize the SVG source into the PNGs @capacitor/assets expects.
// Uses the `sharp` library bundled with @capacitor/assets.
const fs = require('fs');
const path = require('path');
let sharp;
try { sharp = require('sharp'); }
catch (e) { console.error('sharp not found:', e.message); process.exit(1); }

const root = path.join(__dirname, '..');
const assets = path.join(root, 'assets');
const svg = fs.readFileSync(path.join(assets, 'icon.svg'));

async function main() {
  // 1024 app icon (full art, opaque)
  await sharp(svg, { density: 384 }).resize(1024, 1024).png().toFile(path.join(assets, 'icon-only.png'));

  // Splash: brand background with the icon centered
  const iconBuf = await sharp(svg, { density: 384 }).resize(1000, 1000).png().toBuffer();
  const bg = (hex) => ({
    create: { width: 2732, height: 2732, channels: 4,
      background: hex }
  });
  await sharp(bg({ r: 13, g: 8, b: 5, alpha: 1 }))
    .composite([{ input: iconBuf, gravity: 'center' }]).png()
    .toFile(path.join(assets, 'splash.png'));
  await sharp(bg({ r: 8, g: 5, b: 3, alpha: 1 }))
    .composite([{ input: iconBuf, gravity: 'center' }]).png()
    .toFile(path.join(assets, 'splash-dark.png'));

  console.log('Generated: icon-only.png, splash.png, splash-dark.png');
}
main().catch(e => { console.error(e); process.exit(1); });
