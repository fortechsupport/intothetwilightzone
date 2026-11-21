// robots.txt follows the build's review mode: preview builds (preview.intothetwilightzone.com and
// per-branch deploys) ask crawlers to stay out; the public build lets them in.
import type { APIRoute } from 'astro';
import { reviewMode } from '../lib/review';

export const GET: APIRoute = () => {
  const body =
    reviewMode() === 'public'
      ? 'User-agent: *\nAllow: /\n'
      : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
