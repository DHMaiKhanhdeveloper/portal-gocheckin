/**
 * Pre-test check: verify the GoCheckin POS portal is reachable at BASE_URL.
 * Invoked via the `pretest` npm hook so `npm test` fails fast with a helpful
 * message if the app/env is misconfigured.
 */
const BASE_URL = process.env.BASE_URL || 'https://pos.gocheckin.net';

try {
  const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(5000) });
  // Any HTTP response (even a redirect to /login) means the app is up.
  if (res.status < 500) {
    console.log(`\x1b[32m✓ GoCheckin POS is reachable at ${BASE_URL} (HTTP ${res.status})\x1b[0m`);
  } else {
    console.error(`\x1b[31m✗ GoCheckin POS returned ${res.status} at ${BASE_URL}\x1b[0m`);
    process.exit(1);
  }
} catch (err) {
  console.error(`\x1b[31m✗ GoCheckin POS is not reachable at ${BASE_URL}\x1b[0m`);
  console.error(`  ${err?.message ?? err}`);
  console.error(`\nCheck:`);
  console.error(`  • BASE_URL in configs/env/.env.<ENV> (current: ${BASE_URL})`);
  console.error(`  • your network / VPN connection`);
  process.exit(1);
}
