const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

fs.copyFileSync(
  'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\95fe2e2f-feb8-4f19-bdf8-1c99180fb6cf\\solar_grid_portrait_1790926177279.jpg',
  path.join(publicDir, 'poster2.jpg')
);
fs.copyFileSync(
  'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\95fe2e2f-feb8-4f19-bdf8-1c99180fb6cf\\solar_grid_portrait_1790926177279.jpg',
  path.join(publicDir, 'poster2.webp')
);
fs.copyFileSync(
  'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\95fe2e2f-feb8-4f19-bdf8-1c99180fb6cf\\solar_grid_portrait_1790926177279.jpg',
  path.join(publicDir, 'poster2.png')
);
console.log('Copied successfully!');
