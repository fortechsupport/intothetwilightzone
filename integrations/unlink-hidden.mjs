// After a build, turn internal links to pages that were not built into plain text.
//
// Review hides records (see src/lib/review.ts), but included records still mention hidden ones:
// a person credited on a hidden episode, a book that lists episodes, a film adapting an episode.
// Rather than teach every page about review status, this pass checks every <a href="/...">
// against the built output (and its #fragment against the target page's ids) and unwraps
// links that would 404. It logs how many it unwrapped.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
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

const pagePath = (file, root) => {
  const rel = '/' + relative(root, file).split(sep).join('/');
  return rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel;
};
const normalize = (path) => {
  if (path.endsWith('.html')) return path;
  return path.endsWith('/') ? path : path + '/';
};

export default function unlinkHidden() {
  return {
    name: 'unlink-hidden-records',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const files = await htmlFiles(root);
        const pages = new Map(); // path -> { file, html, ids }
        for (const file of files) {
          const html = await readFile(file, 'utf8');
          const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
          pages.set(pagePath(file, root), { file, html, ids });
        }
        const exists = (href) => {
          const [pathPart, frag] = href.split('#');
          const path = pathPart.split('?')[0];
          if (/\.[a-z0-9]+$/i.test(path) && !path.endsWith('.html')) return true; // assets, feeds
          if (path.startsWith('/pagefind/')) return true;
          const page = pages.get(normalize(path));
          if (!page) return false;
          return !frag || page.ids.has(decodeURIComponent(frag));
        };
        let unlinked = 0;
        for (const page of pages.values()) {
          const next = page.html.replace(/<a\b([^>]*?)\shref="(\/[^"]*)"([^>]*)>([\s\S]*?)<\/a>/g, (whole, _pre, href, _post, inner) => {
            if (exists(href)) return whole;
            unlinked++;
            return `<span class="unlinked">${inner}</span>`;
          });
          if (next !== page.html) await writeFile(page.file, next);
        }
        logger.info(`Unlinked ${unlinked} links to hidden or missing pages`);
      },
    },
  };
}
