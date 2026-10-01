// Self-hosted fork cleanup regression test.
// Run: node test/open-games-selfhosted-cleanup.mjs
// Verifies that the Buy Me A Coffee promotion is gone from the menu while
// the upstream author attribution and asset credits stay.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let failures = 0;
function check(desc, ok) {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${desc}`);
  if (!ok) failures++;
}
function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}

const menu = read('client/src/components/interface/Menu.tsx');
check('menu has no Buy Me A Coffee link', !menu.includes('buymeacoffee.com'));
check('menu has no bmc.png image', !menu.includes('bmc.png'));
check('bmc.png asset removed from public', !existsSync(join(root, 'client/public/bmc.png')));
check('author attribution by @dammafra stays', menu.includes('https://github.com/dammafra/hook-a-fish'));
check('credits screen keeps asset attributions', menu.includes('Kenney') && menu.includes('CC-BY'));
check('start/tutorial/credits menu actions stay', menu.includes("setMenu('tutorial')") && menu.includes("setMenu('credits')"));

if (failures > 0) {
  console.error(`${failures} check(s) failed`);
  process.exit(1);
}
console.log('open-games self-hosted cleanup checks passed');
