import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = join(__dirname, 'public', 'logo.jpg');
const publicDir = join(__dirname, 'public');
const appDir = join(__dirname, 'src', 'app');

async function generateFavicons() {
  console.log('Generating favicons from:', inputPath);

  // Generate favicon.ico (32x32)
  await sharp(inputPath)
    .resize(32, 32)
    .toFile(join(appDir, 'favicon.ico'));
  console.log('Created: favicon.ico (32x32)');

  // Generate apple-touch-icon (180x180)
  await sharp(inputPath)
    .resize(180, 180)
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));
  console.log('Created: apple-touch-icon.png (180x180)');

  // Generate icon-192.png for PWA
  await sharp(inputPath)
    .resize(192, 192)
    .png()
    .toFile(join(publicDir, 'icon-192.png'));
  console.log('Created: icon-192.png (192x192)');

  // Generate icon-512.png for PWA
  await sharp(inputPath)
    .resize(512, 512)
    .png()
    .toFile(join(publicDir, 'icon-512.png'));
  console.log('Created: icon-512.png (512x512)');

  // Generate og-image (1200x630) for social sharing
  await sharp(inputPath)
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 90 })
    .toFile(join(publicDir, 'og-image.jpg'));
  console.log('Created: og-image.jpg (1200x630)');

  console.log('\nAll favicons generated successfully!');
}

generateFavicons().catch(console.error);
