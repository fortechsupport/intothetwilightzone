// After a build, write dist/sitemap.xml: every page a search engine should know about, by its canonical address.
// Built from the output, so it always matches what was published. Left out: pages marked noindex (old addresses
// that redirect, account and moderation pages) and the 404 page. robots.txt points to it in public builds.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function buildSitemap(root) {
  const locs = new Set();
  for (const file of await htmlFiles(root)) {
    if (file.endsWith(`${'/'}404.html`)) continue;
    const head = (await readFile(file, 'utf8')).slice(0, 6000);
    if (/<meta name="robots" content="[^"]*noindex/i.test(head)) continue;
    const canon = head.match(/<link rel="canonical" href="([^"]+)"/);
    if (canon) locs.add(canon[1]);
  }
  const list = [...locs].sort();
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    list.map((u) => `<url><loc>${esc(u)}</loc></url>`).join('\n') + '\n</urlset>\n';
  await writeFile(join(root, 'sitemap.xml'), xml);
  return list.length;
}

export default function sitemap() {
  return {
    name: 'sitemap',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const n = await buildSitemap(fileURLToPath(dir));
        logger.info(`Listed ${n} pages in /sitemap.xml`);
      },
    },
  };
}
