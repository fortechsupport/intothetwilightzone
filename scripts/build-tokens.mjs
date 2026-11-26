#!/usr/bin/env node
// design/tokens.json -> public/tokens.css, with a contrast test. Fails (exit 1) when a text pair is
// under 4.5:1 or a UI pair (borders that mark controls, focus rings) is under 3:1, in any theme.
//   node scripts/build-tokens.mjs           write public/tokens.css
//   node scripts/build-tokens.mjs --check   only test contrast and that tokens.css is up to date
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const t = JSON.parse(fs.readFileSync(path.join(root, 'design/tokens.json'), 'utf8'));

const hex = (h) => { const m = /^#([0-9a-f]{6})$/i.exec(h); return m ? [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255) : null; };
const lum = (c) => { const [r, g, b] = c.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

let bad = 0;
for (const [name, theme] of [...Object.entries(t.themes), ['print', t.print]]) {
  for (const [kind, min] of [['text', 4.5], ['ui', 3]]) {
    for (const [fg, bg] of t.contrast[kind]) {
      const a = hex(theme.color[fg]), b = hex(theme.color[bg]);
      if (!a || !b) { console.log(`✗ ${name}: ${fg} on ${bg} is not a #rrggbb pair`); bad++; continue; }
      const r = ratio(a, b);
      if (r < min) { console.log(`✗ ${name}: ${fg} on ${bg} is ${r.toFixed(2)}:1, needs ${min}:1`); bad++; }
    }
  }
}

const vars = (obj, prefix) => Object.entries(obj).map(([k, v]) => `  --${prefix}${k}: ${v};`).join('\n');
// A theme's colors plus its type: display face, its weight, tracking and scale, and the accent face for kickers.
const themeVars = (th) => `${vars(th.color, '')}\n${vars(th.font ?? {}, 'theme-')}`;
const def = t.themes[t.default];
// The default theme (the 1959 series) is the page's own colors; each theme, the default included, also answers to
// its key so the Theme menu can choose it. Nothing follows the device's light or dark setting (decision 0014).
const css = `/* Generated from design/tokens.json by scripts/build-tokens.mjs. Do not edit by hand. */
:root {
${vars(t.font, 'font-')}
${vars(t.size, '')}
${vars(t.space, 'space-')}
${vars(t.radius, 'radius-')}
${vars(t.layout, 'layout-')}
${themeVars(def)}
  color-scheme: ${def.scheme};
}
${Object.entries(t.themes).map(([name, th]) => `/* ${th.label} */
:root[data-theme="${name}"] {
${themeVars(th)}
  color-scheme: ${th.scheme};
}
`).join('')}/* ${t.print.label} (light text on white paper would vanish). */
@media print {
  :root, :root[data-theme] {
${themeVars(t.print).replace(/^/gm, '  ')}
    color-scheme: light;
  }
}
`;
const out = path.join(root, 'public/tokens.css');
if (process.argv.includes('--check')) {
  if (!fs.existsSync(out) || fs.readFileSync(out, 'utf8') !== css) { console.log('✗ public/tokens.css is out of date: run npm run tokens'); bad++; }
} else fs.writeFileSync(out, css);
console.log(bad ? `${bad} token findings.` : `✓ Tokens: every text pair meets 4.5:1 and every UI pair 3:1 in all ${Object.keys(t.themes).length} themes and in print.`);
process.exit(bad ? 1 : 0);
