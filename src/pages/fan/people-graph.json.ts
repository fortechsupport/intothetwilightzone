import type { APIRoute } from 'astro';
import { peopleGraph } from '../../lib/fan/graph';
export const GET: APIRoute = async () => new Response(JSON.stringify(await peopleGraph()), { headers: { 'Content-Type': 'application/json' } });
