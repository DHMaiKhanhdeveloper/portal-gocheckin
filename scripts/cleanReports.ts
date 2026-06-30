import * as fs from 'fs';
import * as path from 'path';

/** Removes generated output folders. Run via `npm run clean`. */
const targets = ['reports', 'test-results', 'playwright-report', '.auth'];

for (const target of targets) {
  const full = path.resolve(process.cwd(), target);
  if (fs.existsSync(full)) {
    fs.rmSync(full, { recursive: true, force: true });
    console.info(`Removed ${target}/`);
  }
}
