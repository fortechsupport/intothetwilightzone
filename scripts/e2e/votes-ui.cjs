// Fan votes page checks and screenshots against `wrangler pages dev` (see scripts/e2e/votes-seed.py). Usage: node scripts/e2e/votes-ui.cjs <dir>
const { chromium } = require('playwright');
const B = 'http://localhost:8788', K = 'episodes/1959/walking-distance', P = '/episodes/1959/walking-distance/';
const S = process.argv[2];
const post = (who, path, body) => fetch(B + path, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: B, Cookie: `__Host-tz_s=tok-${who}` }, body: JSON.stringify(body) }).then((r) => r.json());
(async () => {
  await post('bea', '/api/votes', { item: K, value: 1 }); await post('cal', '/api/votes', { item: K, value: 1 }); await post('dot', '/api/votes', { item: K, value: -1 });
  const T = 'works/80stees-twilight-zone-t-shirts';
  await post('bea', '/api/votes', { item: T, value: -1 });
  const browser = await chromium.launch();
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
  for (const scheme of ['dark', 'light']) for (const w of [320, 1440]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w === 320 ? 640 : 900 }, colorScheme: scheme });
    const page = await ctx.newPage();
    // Signed out
    await page.goto(B + P); await page.waitForSelector('.vote:not([hidden])');
    const up = await page.getAttribute('.vote-btn[data-vote="1"]', 'aria-label');
    // Signed-out counts are cached for a minute, so compare with what a signed-out reader gets from the API.
    const anon = (await (await fetch(`${B}/api/votes?items=${K}`)).json()).votes[K].up;
    ok(up === `Thumbs up, ${anon} ${anon === 1 ? 'vote' : 'votes'}`, `${scheme} ${w} signed-out counts (${up})`);
    await page.click('.vote-btn[data-vote="-1"]');
    ok(/Sign in to vote/.test(await page.textContent('.vote-msg')), `${scheme} ${w} signed-out click asks to sign in`);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth); ok(sw <= w, `${scheme} ${w} no sideways scroll (${sw})`);
    if (scheme === 'dark') await page.locator('.record-head').screenshot({ path: `${S}/shots/vote-signed-out-${w}.png` });
    // Signed in as adam
    await ctx.addCookies([{ name: '__Host-tz_s', value: 'tok-adam', url: 'https://localhost:8788/', secure: true }, { name: 'tz_hint', value: 'adam', url: 'https://localhost:8788/', secure: true }]);
    await page.goto(B + P); await page.waitForSelector('.vote:not([hidden])');
    if (scheme === 'dark' && w === 320) {
      await page.click('.vote-btn[data-vote="-1"]'); await page.waitForFunction(() => /vote is in/.test(document.querySelector('.vote-msg').textContent));
      ok(await page.getAttribute('.vote-btn[data-vote="-1"]', 'aria-pressed') === 'true', 'voting down presses the button');
      ok(await page.getAttribute('.vote-btn[data-vote="-1"]', 'aria-label') === 'Thumbs down, 2 votes', 'down count updates to 2');
      await page.click('.vote-btn[data-vote="1"]'); await page.waitForFunction(() => document.querySelector('.vote-btn[data-vote="1"]').getAttribute('aria-pressed') === 'true');
      ok(await page.getAttribute('.vote-btn[data-vote="-1"]', 'aria-label') === 'Thumbs down, 1 vote', 'switching to up moves the vote (1 down)');
      await page.reload(); await page.waitForSelector('.vote:not([hidden])');
      ok(await page.getAttribute('.vote-btn[data-vote="1"]', 'aria-pressed') === 'true', 'own vote shown after reload');
    }
    if (scheme === 'dark') await page.locator('.record-head').screenshot({ path: `${S}/shots/vote-signed-in-${w}-${scheme}.png` });
    if (scheme === 'light') await page.locator('.record-head').screenshot({ path: `${S}/shots/vote-signed-in-${w}-${scheme}.png` });
    // keyboard focus visible
    await page.focus('.vote-btn[data-vote="1"]');
    // Moderation
    await page.goto(B + '/moderation/#q=votes'); await page.waitForSelector('.mod-item');
    ok(/80stees|T-Shirts|T-shirts/i.test(await page.textContent('#list')), `${scheme} ${w} moderation lists the below-zero record`);
    await page.screenshot({ path: `${S}/shots/moderation-votes-${w}-${scheme}.png`, fullPage: w === 320 ? false : true });
    await ctx.close();
  }
  // Single links: the homages list and an episode's Legacy list.
  for (const w of [320, 1440]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w === 320 ? 640 : 900 }, colorScheme: 'dark' });
    await ctx.addCookies([{ name: '__Host-tz_s', value: 'tok-bea', url: 'https://localhost:8788/', secure: true }, { name: 'tz_hint', value: 'bea', url: 'https://localhost:8788/', secure: true }]);
    const page = await ctx.newPage();
    await page.goto(B + '/television/homages/'); await page.waitForSelector('.link-vote.vote:not([hidden])');
    const total = await page.locator('.link-vote').count();
    const shown = await page.locator('.link-vote.vote:not([hidden])').count();
    ok(shown > 0 && shown < total, `${w} homages: counts load near the screen first (${shown} of ${total})`);
    if (w === 320) {
      const first = page.locator('.link-vote.vote:not([hidden])').first();
      await first.locator('.vote-btn[data-vote="1"]').click();
      await page.waitForFunction(() => document.querySelector('.link-vote .vote-btn[data-vote="1"][aria-pressed="true"]'));
      ok(/Thumbs up for this link, 1 vote/.test(await first.locator('.vote-btn[data-vote="1"]').getAttribute('aria-label')), 'vote on a single link');
      await first.locator('.vote-btn[data-vote="1"]').click();
      await page.waitForFunction(() => !document.querySelector('.link-vote .vote-btn[aria-pressed="true"]'));
    }
    await page.mouse.wheel(0, 20000); await page.waitForTimeout(800);
    ok((await page.locator('.link-vote.vote:not([hidden])').count()) > shown, `${w} homages: more load on scrolling`);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth); ok(sw <= w, `${w} homages: no sideways scroll (${sw})`);
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
    await page.locator('li:has(> p .link-vote.vote:not([hidden]))').nth(1).screenshot({ path: `${S}/shots/link-vote-homage-${w}.png` });
    await page.goto(B + '/episodes/1959/time-enough-at-last/#legacy'); await page.waitForSelector('#legacy .link-vote.vote:not([hidden])');
    await page.locator('#legacy').screenshot({ path: `${S}/shots/link-vote-legacy-${w}.png` });
    await ctx.close();
  }
  // axe on episode (signed in, votes visible) and moderation
  const axe = require('fs').readFileSync(require.resolve('axe-core/axe.min.js', { paths: [process.cwd()] }), 'utf8');
  for (const scheme of ['dark', 'light']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: scheme });
    await ctx.addCookies([{ name: '__Host-tz_s', value: 'tok-adam', url: 'https://localhost:8788/', secure: true }, { name: 'tz_hint', value: 'adam', url: 'https://localhost:8788/', secure: true }]);
    const page = await ctx.newPage();
    for (const p of [P, '/moderation/#q=votes', '/people/rod-serling/', '/television/homages/', '/series/1959/']) {
      await page.goto(B + p); await page.waitForSelector(p.startsWith('/moderation') ? '.mod-item' : '.vote:not([hidden])');
      await page.addScriptTag({ content: axe });
      const r = await page.evaluate(async () => await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }));
      ok(!r.violations.length, `axe ${scheme} ${p}: ${r.violations.map((v) => v.id + ' ' + v.nodes.map((n) => n.target).join(' ')).join('; ') || 'clean'}`);
    }
    await ctx.close();
  }
  await browser.close();
  console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
})();
