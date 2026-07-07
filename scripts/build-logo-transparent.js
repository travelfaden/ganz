const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const iconPath = path.join(root, 'images', 'logo.png');
const outIconPath = path.join(root, 'images', 'logo-icon-transparent.png');
const outWordmarkPath = path.join(root, 'images', 'logo-travelfaden-transparent.png');
const outWordmark2xPath = path.join(root, 'images', 'logo-travelfaden-transparent-2x.png');

const BRAND_BLUE = '#1278ef';

function wordmarkSvg(textSize, canvasHeight, textWidth) {
  const textY = Math.round(canvasHeight * 0.72);
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${textWidth}" height="${canvasHeight}" viewBox="0 0 ${textWidth} ${canvasHeight}">
  <text x="0" y="${textY}" fill="${BRAND_BLUE}"
    font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="${textSize}" font-weight="700">TravelFaden</text>
</svg>`);
}

async function build() {
  const iconSize = 220;
  const textSize = 132;
  const gap = 28;
  const canvasHeight = iconSize;
  const textWidth = Math.round(textSize * 5.1);

  const resizedIcon = await sharp(iconPath).resize(iconSize, iconSize, { fit: 'contain' }).png().toBuffer();
  const { width: iconW, height: iconH } = await sharp(resizedIcon).metadata();

  const textRaster = await sharp(wordmarkSvg(textSize, canvasHeight, textWidth)).png().toBuffer();
  const { width: textW, height: textH } = await sharp(textRaster).metadata();

  const trimmedText = await sharp(textRaster).trim().png().toBuffer();
  const { width: trimmedTextW, height: trimmedTextH } = await sharp(trimmedText).metadata();

  const totalWidth = iconW + gap + trimmedTextW;
  const iconTop = Math.round((canvasHeight - iconH) / 2);
  const textTop = Math.round((canvasHeight - trimmedTextH) / 2);

  await sharp(iconPath).png().toFile(outIconPath);

  await sharp({
    create: {
      width: totalWidth,
      height: canvasHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: resizedIcon, top: iconTop, left: 0 },
      { input: trimmedText, top: textTop, left: iconW + gap },
    ])
    .png()
    .toFile(outWordmarkPath);

  await sharp(outWordmarkPath)
    .resize(totalWidth * 2, canvasHeight * 2, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toFile(outWordmark2xPath);

  console.log('Created', outIconPath);
  console.log('Created', outWordmarkPath, `(${totalWidth}x${canvasHeight})`);
  console.log('Created', outWordmark2xPath);
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
