const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

fs.copyFileSync(
  'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\95fe2e2f-feb8-4f19-bdf8-1c99180fb6cf\\.user_uploaded\\media_1790928904791.jpg',
  path.join(publicDir, 'ss-logo.jpg')
);
console.log('Copied successfully!');
