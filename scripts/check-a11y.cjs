#!/usr/bin/env node
// Accessibility and layout checks on one page of every type, in Chromium.
//
//   node scripts/check-a11y.cjs [baseUrl]      (default http://localhost:4321, run `npm run preview` first)
//
// For each page: axe-core (WCAG 2.2 A and AA rules) must report no violations; at 320 x 640 nothing
// may scroll sideways and the page's h1 must start in the top third of the screen (213 px).
// Needs Playwright: `npm i --no-save playwright && npx playwright install chromium` (CI does this).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const base = process.argv[2] ?? 'http://localhost:4321';
const PAGES = [
  '/', '/start/', '/watch/', '/listen/', '/read/', '/meet/', '/visit/', '/discover/',
  '/series/', '/series/episodes/', '/series/homages/', '/series/anthologies/', '/films/the-outer-limits-1963/', '/television/the-simpsons/', '/television/homages/', '/films/robot-chicken/', '/series/1959/', '/episodes/1959/time-enough-at-last/', '/people/', '/people/rod-serling/',
  '/films/duel-1971/', '/songs/iron-maiden-twilight-zone/', '/radio/a-stop-at-willoughby/', '/books/more-stories-from-the-twilight-zone/',
  '/places/willoughby/', '/organizations/cayuga-productions/', '/characters/the-gremlin-nightmare-at-20-000-feet/',
  '/media/', '/media/reviews/', '/search/', '/timeline/', '/timeline/1960s/', '/people/a-z/s/', '/rod-serling/', '/night-gallery/', '/categories/', '/about/', '/my-zone/', '/map/', '/finder/', '/themes/', '/themes/the-uncanny/', '/404.html',
];
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

(async () => {
  const browser = await chromium.launch();
  let failures = 0;
  for (const scheme of ['dark', 'light']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: scheme });
    const page = await ctx.newPage();
    for (const p of PAGES) {
      const res = await page.goto(base + p, { waitUntil: 'load' });
      if (!res || (res.status() >= 400 && p !== '/404.html')) { console.log(`✗ ${p}: HTTP ${res?.status()}`); failures++; continue; }
      await page.addScriptTag({ content: axeSource });
      const r = await page.evaluate(async () => await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }));
      for (const v of r.violations) {
        failures++;
        console.log(`✗ [${scheme}] ${p}: ${v.id} (${v.impact}) ${v.help} — ${v.nodes.length} element(s), e.g. ${v.nodes[0]?.target?.join(' ')}`);
      }
    }
    await ctx.close();
  }
  const phone = await browser.newContext({ viewport: { width: 320, height: 640 } });
  const page = await phone.newPage();
  for (const p of PAGES) {
    await page.goto(base + p, { waitUntil: 'load' });
    const m = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - innerWidth, h1: document.querySelector('h1')?.getBoundingClientRect().top ?? null }));
    if (m.overflow > 1) { failures++; console.log(`✗ [320px] ${p}: scrolls sideways by ${m.overflow}px`); }
    if (m.h1 === null || m.h1 > 213) { failures++; console.log(`✗ [320px] ${p}: h1 starts at ${m.h1}px (limit 213)`); }
  }
  await browser.close();
  console.log(failures ? `${failures} accessibility/layout findings.` : `✓ ${PAGES.length} pages: no axe violations in dark or light, no sideways scroll, titles in the top third at 320 x 640.`);
  process.exit(failures ? 1 : 0);
})();
