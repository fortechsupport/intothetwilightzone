// Compact episode index for the browser tools: /finder/, /today/ and /my-zone/.
import type { APIRoute } from 'astro';
import { episodeIndex } from '../../lib/fan';
export const GET: APIRoute = async () => new Response(JSON.stringify(await episodeIndex()), { headers: { 'Content-Type': 'application/json' } });
