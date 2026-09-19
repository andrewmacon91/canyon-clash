// Generate PWA / home-screen icons from the master app icon.
const sharp = require('sharp');
const path = require('path');
const root = path.join(__dirname, '..');
const src = path.join(root, 'assets', 'icon-only.png');
const out = path.join(root, 'docs');

async function main() {
  await sharp(src).resize(192, 192).png().toFile(path.join(out, 'icon-192.png'));
  await sharp(src).resize(512, 512).png().toFile(path.join(out, 'icon-512.png'));
  await sharp(src).resize(180, 180).png().toFile(path.join(out, 'apple-touch-icon.png'));
  // maskable: pad to 80% so Android's mask doesn't clip art
  await sharp(src).resize(410, 410).extend({ top: 51, bottom: 51, left: 51, right: 51,
    background: { r: 224, g: 145, b: 63, alpha: 1 } }).resize(512, 512).png()
    .toFile(path.join(out, 'icon-maskable-512.png'));
  console.log('PWA icons generated in docs/');
}
main().catch(e => { console.error(e); process.exit(1); });
