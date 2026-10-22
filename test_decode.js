const fs = require('fs');
const zlib = require('zlib');
const { execSync } = require('child_process');

const xml = fs.readFileSync('SESI_App_Flow.drawio', 'utf-8');

// Run python encode_drawio_url.py --edit
const url = execSync('python "C:/Users/User/.agents/skills/drawio-skill/scripts/encode_drawio_url.py" --edit SESI_App_Flow.drawio', { encoding: 'utf-8' }).trim();

console.log('URL length:', url.length);
const hash = url.split('#create=')[1];
const decodedHash = decodeURIComponent(hash);
console.log('decodedHash parsed JSON...');
const obj = JSON.parse(decodedHash);
console.log('type:', obj.type, 'compressed:', obj.compressed);

// Now inflate
const b64 = obj.data;
const buf = Buffer.from(b64, 'base64');
zlib.inflateRaw(buf, (err, inflated) => {
  if (err) {
    console.error('Inflate error:', err);
    return;
  }
  const str = inflated.toString('utf-8');
  console.log('Inflated length:', str.length);
  try {
    const finalXml = decodeURIComponent(str);
    console.log('SUCCESS! decodeURIComponent passed!');
    console.log('Final XML start:', finalXml.substring(0, 100));
  } catch (e) {
    console.error('decodeURIComponent FAILED:', e.message);
  }
});
