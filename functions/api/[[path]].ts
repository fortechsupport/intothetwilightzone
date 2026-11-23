// Cloudflare Pages Function: every /api/* request goes to the accounts API (server/router.ts).
// Static pages are untouched; Cloudflare only runs this code for /api/ addresses.
import { handle } from '../../server/router';
import type { Env } from '../../server/env';

export const onRequest: PagesFunction<Env> = ({ request, env, waitUntil }) => handle(request, env, waitUntil);
