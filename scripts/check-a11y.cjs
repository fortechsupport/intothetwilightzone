#!/usr/bin/env node
// Accessibility and layout checks on one page of every type, in Chromium.
//
//   node scripts/check-a11y.cjs [baseUrl]      (default http://localhost:4321, run `npm run preview` first)
//
// For each page: axe-core (WCAG 2.2 A and AA rules) must report no violations; at 320 x 640 nothing
// may scroll sideways and the page's h1 must start in the top third of the screen (213 px). A sample of pages
// must not jump while loading on a slow phone connection (layout shift at most 0.1).
// Needs Playwright: `npm i --no-save playwright && npx playwright install chromium` (CI does this).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const base = process.argv[2] ?? 'http://localhost:4321';
const PAGES = [
  '/', '/start/', '/watch/', '/listen/', '/read/', '/meet/', '/visit/', '/discover/',
  '/series/', '/series/twilight-zone/', '/series/episodes/', '/series/homages/', '/series/anthologies/', '/films/the-outer-limits-1963/', '/television/american-dad/', '/television/homages/', '/films/robot-chicken/', '/series/1959/', '/episodes/1959/time-enough-at-last/', '/people/', '/people/rod-serling/',
  '/films/duel-1971/', '/songs/iron-maiden-twilight-zone/', '/radio/a-stop-at-willoughby/', '/radio/twilight-zone-radio-dramas-series/', '/radio/radio-dramas/', '/radio/serling-radio/', '/stage/serling-on-stage/', '/films/the-twilight-zone-stage-play/', '/books/more-stories-from-the-twilight-zone/', '/books/to-serve-man-knight-story/', '/reading/source-stories/',
  '/places/willoughby/', '/organizations/cayuga-productions/', '/characters/the-gremlin-nightmare-at-20-000-feet/',
  '/media/', '/media/reviews/', '/podcasts/episodes/', '/podcasts/shows/', '/search/', '/timeline/', '/timeline/1960s/', '/people/a-z/s/', '/rod-serling/', '/night-gallery/', '/categories/', '/about/', '/my-zone/', '/map/', '/finder/', '/themes/', '/themes/the-uncanny/', '/404.html',
  '/account/', '/community/', '/community/guidelines/', '/community/uploads/', '/contribute/suggest/', '/contribute/share/', '/moderation/', '/privacy/', '/terms/', '/copyright/', '/credits/images/',
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
  // The era themes (design/tokens.json): axe on a sample of page types in each.
  const SAMPLE = ['/', '/watch/', '/episodes/1959/time-enough-at-last/', '/people/rod-serling/', '/media/', '/search/', '/community/'];
  for (const theme of ['original', 'neon', 'steel', 'crimson']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript((t) => { try { localStorage.setItem('tz-theme', t); } catch (e) {} }, theme);
    const page = await ctx.newPage();
    for (const p of SAMPLE) {
      await page.goto(base + p, { waitUntil: 'load' });
      await page.addScriptTag({ content: axeSource });
      const r = await page.evaluate(async () => await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }));
      for (const v of r.violations) {
        failures++;
        console.log(`✗ [${theme}] ${p}: ${v.id} (${v.impact}) ${v.help} — ${v.nodes.length} element(s), e.g. ${v.nodes[0]?.target?.join(' ')}`);
      }
    }
    // The era themes' display faces are wider or heavier: nothing may run past the edge at 320 px in them either.
    const narrow = await browser.newContext({ viewport: { width: 320, height: 640 } });
    await narrow.addInitScript((t) => { try { localStorage.setItem('tz-theme', t); } catch (e) {} }, theme);
    const np = await narrow.newPage();
    for (const p of SAMPLE) {
      await np.goto(base + p, { waitUntil: 'load' });
      const w = await np.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      const clipped = await np.evaluate(() => [...document.querySelectorAll('main h1, main h2, main .lead')].filter((el) => el.getBoundingClientRect().right > innerWidth + 1).length);
      if (w > 1 || clipped) { failures++; console.log(`✗ [${theme} 320px] ${p}: ${w > 1 ? `scrolls sideways by ${w}px` : `${clipped} heading(s) run past the right edge`}`); }
    }
    await narrow.close();
    await ctx.close();
  }
  const phone = await browser.newContext({ viewport: { width: 320, height: 640 } });
  const page = await phone.newPage();
  for (const p of PAGES) {
    await page.goto(base + p, { waitUntil: 'load' });
    const m = await page.evaluate(() => {
      // Content cut off at the right edge, even when nothing scrolls (a clipped grid column hides it from scrollWidth).
      // Elements inside a sideways-scrolling box (tables, the breadcrumb) are fine.
      const scrolls = (el) => { for (let e = el.parentElement; e; e = e.parentElement) { const o = getComputedStyle(e).overflowX; if (o === 'auto' || o === 'scroll') return true; } return false; };
      const clipped = [];
      for (const el of document.querySelectorAll('main *')) {
        if (el.closest('.leaflet-container')) continue; // map tiles are meant to run past the frame
        const r = el.getBoundingClientRect();
        if (r.width > 1 && r.height > 1 && r.right > innerWidth + 1 && !scrolls(el)) clipped.push(el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''));
      }
      return { overflow: document.documentElement.scrollWidth - innerWidth, h1: document.querySelector('h1')?.getBoundingClientRect().top ?? null, clipped };
    });
    if (m.overflow > 1) { failures++; console.log(`✗ [320px] ${p}: scrolls sideways by ${m.overflow}px`); }
    if (m.clipped.length) { failures++; console.log(`✗ [320px] ${p}: ${m.clipped.length} element(s) run past the right edge, e.g. ${m.clipped.slice(0, 3).join(', ')}`); }
    if (m.h1 === null || m.h1 > 213) { failures++; console.log(`✗ [320px] ${p}: h1 starts at ${m.h1}px (limit 213)`); }
  }
  // Layout stability: on a slow phone connection a page must not jump as fonts, scripts and the actions bar arrive
  // (cumulative layout shift at most 0.1, the "good" Core Web Vitals limit).
  const STABLE = [...SAMPLE, '/places/willoughby/', '/organizations/cayuga-productions/', '/films/duel-1971/', '/books/more-stories-from-the-twilight-zone/', '/series/1959/'];
  for (const p of STABLE) {
    const c = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const pg = await c.newPage();
    const cdp = await c.newCDPSession(pg);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 94000 });
    await pg.addInitScript(() => { window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
    await pg.goto(base + p, { waitUntil: 'load' });
    await pg.waitForTimeout(1500);
    const cls = await pg.evaluate(() => window.__cls);
    if (cls > 0.1) { failures++; console.log(`✗ [layout shift] ${p}: ${cls.toFixed(3)} (limit 0.1)`); }
    await c.close();
  }
  await browser.close();
  console.log(failures ? `${failures} accessibility/layout findings.` : `✓ ${PAGES.length} pages: no axe violations in dark or light (or the four era themes on a sample), no sideways scroll, titles in the top third at 320 x 640, no layout shift over 0.1 on a slow phone.`);
  process.exit(failures ? 1 : 0);
})();
