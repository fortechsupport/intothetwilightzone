// After a build, list every record page that has an actions bar (RecordHeader's
// <div class="record-actions" data-record-key="collection/id">) in dist/fan/vote-items.json:
//   { "episodes/1959/walking-distance": ["Walking Distance", "/episodes/1959/walking-distance/"], ... }
// The votes API reads it (through the Pages ASSETS binding) to accept votes only on records the site
// really shows, and to name the record in Adam's below-zero alerts. Built from the output, so it
// always matches what was published, in both review modes.
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
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

const decode = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/\s+/g, ' ').trim();

export async function buildRecordIndex(root) {
  const items = {};
  for (const file of await htmlFiles(root)) {
    const html = await readFile(file, 'utf8');
    const key = /class="record-actions" data-record-key="([^"]+)"/.exec(html)?.[1];
    if (!key || items[key]) continue;
    const title = decode(/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1] ?? key);
    const rel = '/' + relative(root, file).split(sep).join('/');
    items[key] = [title, rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel];
  }
  await mkdir(join(root, 'fan'), { recursive: true });
  await writeFile(join(root, 'fan', 'vote-items.json'), JSON.stringify(items));
  return Object.keys(items).length;
}

export default function recordIndex() {
  return {
    name: 'record-index',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const n = await buildRecordIndex(fileURLToPath(dir));
        logger.info(`Listed ${n} votable records in /fan/vote-items.json`);
      },
    },
  };
}
