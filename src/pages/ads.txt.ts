import type { APIContext } from 'astro';
import { MONETIZATION } from '../config';

// Serves /ads.txt for AdSense (authorized digital sellers). Generated from the
// configured AdSense client id so it never drifts. AdSense limits/holds ad
// serving for sites without a valid ads.txt, so this is required to "go live".
//   Format: google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
// (f08c47fec0942fa0 is Google's fixed certification-authority id for AdSense.)
export async function GET(_context: APIContext) {
  const { enabled, adsenseClientId } = MONETIZATION.ads;
  const pub = (adsenseClientId || '').replace(/^ca-/, ''); // ads.txt uses the "pub-..." form
  const body = enabled && pub ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n` : '';
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
