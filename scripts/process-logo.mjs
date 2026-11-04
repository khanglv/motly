// Xử lý logo gốc (JPG nền trắng) thành các bản dùng trên web.
// Chạy: node scripts/process-logo.mjs   (sau khi thay public/images/logo.jpg)
//
// Tạo ra:
//   public/images/logo.png        logo nền trong suốt, cắt sát (dùng trên nền sáng)
//   public/images/logo-light.png  nét đen đổi thành màu kem (dùng trên nền xanh đậm)
//   src/app/icon.png              favicon: đầu gấu
//   src/app/apple-icon.png        icon khi thêm vào màn hình iPhone
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'public/images/logo.jpg');
const CREAM = [251, 248, 239];

/** "Color to alpha": nền trắng thành trong suốt, giữ viền mượt. */
function whiteToAlpha(data, channels) {
  const out = Buffer.alloc((data.length / channels) * 4);
  for (let i = 0, o = 0; i < data.length; i += channels, o += 4) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2];
    const dist = 255 - Math.min(r, g, b);
    const a = Math.min(1, (dist / 255) * 2.2);
    if (a < 0.04) {
      out[o + 3] = 0;
      continue;
    }
    const un = (c) =>
      Math.max(0, Math.min(255, Math.round((c - (1 - a) * 255) / a)));
    out[o] = un(r);
    out[o + 1] = un(g);
    out[o + 2] = un(b);
    out[o + 3] = Math.round(a * 255);
  }
  return out;
}

const { data, info } = await sharp(src)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const rgba = whiteToAlpha(data, info.channels);
const base = sharp(rgba, {
  raw: { width: info.width, height: info.height, channels: 4 }
});

// Tìm khung bao nội dung để cắt sát
const { info: trimInfo } = await base
  .clone()
  .png()
  .trim({ threshold: 1 })
  .toBuffer({ resolveWithObject: true });
const left = -(trimInfo.trimOffsetLeft ?? 0);
const top = -(trimInfo.trimOffsetTop ?? 0);
const pad = 24;
const region = {
  left: Math.max(0, left - pad),
  top: Math.max(0, top - pad),
  width: Math.min(
    info.width - Math.max(0, left - pad),
    trimInfo.width + pad * 2
  ),
  height: Math.min(
    info.height - Math.max(0, top - pad),
    trimInfo.height + pad * 2
  )
};

await base
  .clone()
  .extract(region)
  .resize({ width: 640 })
  .png({ compressionLevel: 9 })
  .toFile(join(root, 'public/images/logo.png'));

// Bản sáng: nét đen thành kem, giữ màu xanh matcha
const light = Buffer.from(rgba);
for (let o = 0; o < light.length; o += 4) {
  const r = light[o],
    g = light[o + 1],
    b = light[o + 2];
  const isGreen = g - r > 40 && g - b > 30;
  if (!isGreen) {
    light[o] = CREAM[0];
    light[o + 1] = CREAM[1];
    light[o + 2] = CREAM[2];
  }
}
await sharp(light, {
  raw: { width: info.width, height: info.height, channels: 4 }
})
  .extract(region)
  .resize({ width: 640 })
  .png({ compressionLevel: 9 })
  .toFile(join(root, 'public/images/logo-light.png'));

// Favicon: đầu gấu (vùng giữa phía trên của logo gốc 1280×1280)
const head = { left: 520, top: 395, width: 330, height: 330 };
const headPng = await sharp(rgba, {
  raw: { width: info.width, height: info.height, channels: 4 }
})
  .extract(head)
  .composite([
    {
      // Che phần dư ngoài vòng tròn (mép chữ T, tay gấu)
      input: Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="330" height="330"><circle cx="165" cy="165" r="160" fill="#000"/></svg>`
      ),
      blend: 'dest-in'
    }
  ])
  .png()
  .toBuffer();

const circle = (size) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#E3F6DA"/></svg>`
  );

for (const [file, size] of [
  ['src/app/icon.png', 512],
  ['src/app/apple-icon.png', 180]
]) {
  const inner = Math.round(size * 0.86);
  const face = await sharp(headPng).resize(inner, inner).toBuffer();
  await sharp(circle(size))
    .composite([{ input: face, gravity: 'center' }])
    .png()
    .toFile(join(root, file));
}

console.log('Logo đã xử lý:', region);
