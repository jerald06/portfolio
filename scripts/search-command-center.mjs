import { readFileSync } from 'fs';
import { resolve } from 'path';

const filePath = resolve('public/assets/command-center-redesign.html');

const base64Content = readFileSync(filePath, 'utf8').trim();
const decoded = Buffer.from(base64Content, 'base64').toString('utf8');

// Search for variations of the target text
const patterns = [
  'unfit',
  'architecturally',
  'experimentally',
  'multi-tenant',
  'enterprise-grade',
  'not scaling',
];

for (const pat of patterns) {
  const idx = decoded.indexOf(pat);
  if (idx !== -1) {
    console.log(`Found '${pat}' at position ${idx}`);
    console.log('Context:', JSON.stringify(decoded.slice(Math.max(0, idx - 80), idx + 100)));
    console.log('---');
  } else {
    console.log(`NOT FOUND: '${pat}'`);
  }
}
