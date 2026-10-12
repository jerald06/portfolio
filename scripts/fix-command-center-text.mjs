import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const filePath = resolve('public/assets/command-center-redesign.html');

// Read the base64-encoded file
const base64Content = readFileSync(filePath, 'utf8').trim();

// Decode from base64
const decoded = Buffer.from(base64Content, 'base64').toString('utf8');

// Check how many occurrences exist before replacement
const before = (decoded.match(/architecturally and experientially unfit for multi-tenant/g) || []).length;
console.log(`Found ${before} occurrence(s) of 'architecturally and experientially unfit for multi-tenant'`);

if (before === 0) {
  console.error('ERROR: Target text not found in decoded content!');
  process.exit(1);
}

// Make the replacement: change 'unfit' to 'not scaling'
const replaced = decoded.replace(
  /architecturally and experientially unfit for multi-tenant/g,
  'architecturally and experientially not scaling for multi-tenant'
);

// Verify replacement happened
const after = (replaced.match(/architecturally and experientially not scaling for multi-tenant/g) || []).length;
console.log(`Replaced with ${after} occurrence(s) of 'architecturally and experientially not scaling for multi-tenant'`);

// Re-encode to base64
const reEncoded = Buffer.from(replaced, 'utf8').toString('base64');

// Write back
writeFileSync(filePath, reEncoded, 'utf8');
console.log('Done! File written successfully.');
