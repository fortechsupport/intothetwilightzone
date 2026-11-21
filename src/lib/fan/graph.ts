// People graph for /degrees/: who worked with whom, through on-screen credits (episodes and films).
import { allPeople } from '../data';

export interface PeopleGraph { people: [string, string][]; works: [string, string][]; links: number[][] }
let cache: PeopleGraph | undefined;
export async function peopleGraph(): Promise<PeopleGraph> {
  if (cache) return cache;
  const people: [string, string][] = [];
  const works: [string, string][] = [];
  const workIdx = new Map<string, number>();
  const links: number[][] = [];
  for (const p of (await allPeople()).values()) {
    const mine = new Set<number>();
    for (const c of p.credits) {
      if (!c.url || !/^\/(episodes|films)\//.test(c.url)) continue;
      if (!workIdx.has(c.url)) { workIdx.set(c.url, works.length); works.push([c.title, c.url]); }
      mine.add(workIdx.get(c.url)!);
    }
    if (mine.size) { people.push([p.name, p.slug]); links.push([...mine]); }
  }
  cache = { people, works, links };
  return cache;
}

/** People with the most distinct collaborators, for the "most connected" list. */
export async function mostConnected(limit = 25) {
  const g = await peopleGraph();
  const byWork = g.works.map(() => [] as number[]);
  g.links.forEach((ws, p) => ws.forEach((w) => byWork[w].push(p)));
  return g.people.map(([name, slug], i) => {
    const co = new Set<number>();
    g.links[i].forEach((w) => byWork[w].forEach((q) => q !== i && co.add(q)));
    return { name, slug, co: co.size, works: g.links[i].length };
  }).sort((a, b) => b.co - a.co).slice(0, limit);
}
