import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicAssetsDir = path.join(__dirname, 'public', 'assets');
if (!fs.existsSync(publicAssetsDir)) {
  fs.mkdirSync(publicAssetsDir, { recursive: true });
}

const assets = [
  { src: 'C:/Users/User/.gemini/antigravity-ide/brain/64e02f0e-9a34-4ae4-a35c-a08ed77461c3/.user_uploaded/media_1791251781865.png', dest: 'reset2030_icon.png' },
  { src: 'C:/Users/User/.gemini/antigravity-ide/brain/29a0a901-89c7-44bb-b8ba-d27e704d88a7/.user_uploaded/media_1791169498492.png', dest: 'pattern_dark.png' },
  { src: 'C:/Users/User/.gemini/antigravity-ide/brain/29a0a901-89c7-44bb-b8ba-d27e704d88a7/.user_uploaded/media_1791171890246.png', dest: 'pattern_light.png' },
  { src: 'C:/Users/User/.gemini/antigravity-ide/brain/64e02f0e-9a34-4ae4-a35c-a08ed77461c3/hd_dark_topo_1791271080189.jpg', dest: 'hd_dark_topo.jpg' },
  { src: 'C:/Users/User/.gemini/antigravity-ide/brain/64e02f0e-9a34-4ae4-a35c-a08ed77461c3/hd_light_topo_1791271068815.jpg', dest: 'hd_light_topo.jpg' },
  { src: 'C:/Users/User/.gemini/antigravity-ide/brain/64e02f0e-9a34-4ae4-a35c-a08ed77461c3/.user_uploaded/media_1791269952460.png', dest: 'logo.png' }
];

assets.forEach(({ src, dest }) => {
  const destPath = path.join(publicAssetsDir, dest);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, destPath);
    console.log(`Successfully copied ${dest} to public/assets!`);
  } else {
    console.error(`Source not found: ${src}`);
  }
});
