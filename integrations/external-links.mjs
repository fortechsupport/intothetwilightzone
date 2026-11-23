// After a build, apply the site's link rule (Adam, 2026-11-21): links to other websites open in a new tab,
// links within the site open in the same tab.
//
// Every <a href="http(s)://..."> that points off the site gets target="_blank", rel="noopener noreferrer"
// (kept alongside any rel it already has) and aria-describedby="ext-note", which screen readers announce as
// "opens in a new tab" (the note is a hidden element in the Base layout). The ↗ mark beside such links comes
// from public/site.css. Any target on an internal link is removed. Inline scripts are left alone; client
// templates follow the same rule by hand. scripts/check-site.mjs fails the build if a page breaks the rule.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SITE_HOSTS = /^(?:[a-z0-9-]+\.)*intothetwilightzone(?:-preview\.pages\.dev|\.com)$/i;

/** True for an absolute http(s) URL on another website. */
export function isExternal(href) {
  const m = /^https?:\/\/([^/?#:]+)/i.exec(href);
  return Boolean(m) && !SITE_HOSTS.test(m[1]);
}

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

/** Rewrite one opening <a ...> tag. */
export function fixTag(tag) {
  const href = /\shref="([^"]*)"/.exec(tag)?.[1];
  if (href === undefined) return tag;
  if (!isExternal(href)) return tag.replace(/\starget="[^"]*"/, '');
  let t = tag.replace(/\starget="[^"]*"/, '');
  const rel = /\srel="([^"]*)"/.exec(t)?.[1];
  const rels = new Set((rel ?? '').split(/\s+/).filter(Boolean));
  rels.add('noopener'); rels.add('noreferrer');
  t = rel === undefined ? t.replace(/^<a\b/, `<a rel="${[...rels].join(' ')}"`) : t.replace(/\srel="[^"]*"/, ` rel="${[...rels].join(' ')}"`);
  t = t.replace(/^<a\b/, '<a target="_blank"');
  if (!/\saria-describedby=/.test(t)) t = t.replace(/^<a\b/, '<a aria-describedby="ext-note"');
  return t;
}

/** Apply the rule to a whole page, skipping inline scripts and styles. */
export function fixHtml(html) {
  return html.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>)/).map((part, i) => (i % 2 ? part : part.replace(/<a\b[^>]*>/g, fixTag))).join('');
}

export default function externalLinks() {
  return {
    name: 'external-links-new-tab',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        let pages = 0;
        for (const file of await htmlFiles(root)) {
          const html = await readFile(file, 'utf8');
          const next = fixHtml(html);
          if (next !== html) { await writeFile(file, next); pages++; }
        }
        logger.info(`external links set to open in a new tab on ${pages} pages`);
      },
    },
  };
}
