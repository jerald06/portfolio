import { readFileSync } from 'fs';
import { resolve } from 'path';

const filePath = resolve('public/assets/command-center-redesign.html');
const base64Content = readFileSync(filePath, 'utf8').trim();
const decoded = Buffer.from(base64Content, 'base64').toString('utf8');

const idx = decoded.indexOf('not scaling for multi-tenant');
if (idx !== -1) {
  console.log('VERIFIED: New text present');
  console.log('Context:', JSON.stringify(decoded.slice(Math.max(0, idx - 80), idx + 100)));
} else {
  console.log('ERROR: New text not found!');
}

const oldIdx = decoded.indexOf('architecturally and experientially unfit');
console.log(oldIdx === -1 ? 'VERIFIED: Old text removed' : 'ERROR: Old text still present!');
