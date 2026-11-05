const fs = require('fs');
const content = fs.readFileSync('public/logo-black.svg', 'utf8');
const paths = content.split('<path').slice(2);
let allX = [], allY = [];
for (const p of paths) {
  const dMatch = p.match(/d="([^"]+)"/);
  if (!dMatch) continue;
  const coords = dMatch[1].match(/[-+]?\d*\.?\d+/g).map(Number);
  for (let i = 0; i < coords.length; i += 2) {
    if (!isNaN(coords[i])) allX.push(coords[i]);
    if (!isNaN(coords[i+1])) allY.push(coords[i+1]);
  }
}
console.log('X min, max:', Math.min(...allX), Math.max(...allX));
console.log('Y min, max:', Math.min(...allY), Math.max(...allY));

