const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const outPath = path.join(root, 'images', 'og-image.png');
const iconPath = path.join(root, 'images', 'logo.png');

const BG_R = 18;
const BG_G = 120;
const BG_B = 239;
const BG_TOLERANCE = 42;

async function iconWithTransparentBackground() {
  const { data, info } = await sharp(iconPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.from(data);

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    const isBlueBackground =
      Math.abs(r - BG_R) <= BG_TOLERANCE &&
      Math.abs(g - BG_G) <= BG_TOLERANCE &&
      Math.abs(b - BG_B) <= BG_TOLERANCE;

    if (isBlueBackground) {
      pixels[i + 3] = 0;
    }
  }

  return sharp(pixels, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png()
    .toBuffer();
}

async function buildOgImage() {
  const width = 1200;
  const height = 630;
  const iconTop = 118;
  const iconWidth = 300;

  const backgroundSvg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="52%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#0ea5e9"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <text x="600" y="430" text-anchor="middle" fill="#ffffff"
    font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="64" font-weight="700">TravelFaden</text>
  <text x="600" y="500" text-anchor="middle" fill="#ffffff"
    font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="32" opacity="0.96">Reisevorschläge &amp; Urlaubsplanung</text>
</svg>`;

  const iconBuffer = await iconWithTransparentBackground();
  const resizedIcon = await sharp(iconBuffer).resize(iconWidth, null, { fit: 'inside' }).png().toBuffer();
  const { width: iconW, height: iconH } = await sharp(resizedIcon).metadata();

  const background = await sharp(Buffer.from(backgroundSvg)).png().toBuffer();

  await sharp(background)
    .composite([
      {
        input: resizedIcon,
        top: iconTop,
        left: Math.round((width - iconW) / 2),
      },
    ])
    .png()
    .toFile(outPath);

  console.log('Created', outPath);
}

buildOgImage().catch((error) => {
  console.error(error);
  process.exit(1);
});
