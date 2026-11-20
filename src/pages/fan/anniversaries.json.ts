import type { APIRoute } from 'astro';
import { anniversaries } from '../../lib/fan/anniversaries';
export const GET: APIRoute = async () => new Response(JSON.stringify(await anniversaries()), { headers: { 'Content-Type': 'application/json' } });
