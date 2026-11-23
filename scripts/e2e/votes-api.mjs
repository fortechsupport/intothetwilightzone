// Fan votes API checks against `wrangler pages dev` (see scripts/e2e/votes-seed.py for setup).
const B = 'http://localhost:8788';
const K = 'episodes/1959/walking-distance';
let fails = 0;
const ok = (c, m) => { console.log(`${c ? 'PASS' : 'FAIL'} ${m}`); if (!c) fails++; };
const call = async (who, path, body, method, origin = B) => {
  const h = { Cookie: who ? `__Host-tz_s=tok-${who}` : '' };
  if (body) { h['Content-Type'] = 'application/json'; h.Origin = origin; }
  const r = await fetch(B + path, { method: method ?? (body ? 'POST' : 'GET'), headers: h, body: body ? JSON.stringify(body) : undefined });
  const t = await r.text(); let j; try { j = JSON.parse(t); } catch { j = t; }
  return { s: r.status, j, h: r.headers };
};
const vote = (who, value, item = K) => call(who, '/api/votes', { item, value });
const alertOf = async (status = 'open') => (await call('adam', `/api/mod/votes${status === 'done' ? '?status=done' : ''}`)).j.items?.find((x) => x.item_key === K);

let r = await vote(null, 1); ok(r.s === 401, `signed-out vote refused (${r.s})`);
r = await call('bea', '/api/votes', { item: K, value: 1 }, 'POST', 'https://evil.example'); ok(r.s === 403, `cross-site vote refused (${r.s})`);
r = await vote('bea', 1, 'episodes/1959/not-a-real-episode'); ok(r.s === 404, `vote on a record that is not on the site refused (${r.s})`);
r = await vote('bea', 2); ok(r.s === 400, `vote value 2 refused (${r.s})`);
r = await vote('bea', 1); ok(r.s === 200 && r.j.up === 1 && r.j.down === 0, `bea up -> 1 up 0 down`);
r = await vote('bea', 1); ok(r.j.up === 1, `bea votes up twice -> still 1 (one vote per member)`);
r = await call('bea', `/api/votes?items=${K}&me=1`); ok(r.j.votes[K].mine === 1 && r.h.get('cache-control').includes('no-store'), `signed-in read shows own vote, not cached`);
r = await vote('cal', -1); ok(r.j.up === 1 && r.j.down === 1, `cal down -> net 0, no alert`);
ok(!(await alertOf()), 'no alert at net 0');
r = await vote('dot', -1); ok(r.j.down === 2, `dot down -> net -1`);
let a = await alertOf(); ok(a && a.up === 1 && a.down === 2 && a.title === 'Walking Distance' && a.path.startsWith('/episodes/'), `alert opened with title and path (${a?.title}, ${a?.path})`);
ok(a?.emailed_at > 0, 'alert email sent (dev log)');
r = await call('bea', '/api/mod/votes'); ok(r.s === 403, `member cannot see the alerts (${r.s})`);
r = await call('adam', '/api/me'); ok(r.j.queue?.votes === 1, `editor badge counts 1 alert`);
r = await vote('bea', 0); ok(r.j.up === 0 && r.j.down === 2 && r.j.mine === 0, 'bea withdraws -> 0 up 2 down');
r = await vote('bea', 1); r = await vote('adam', 1); ok(r.j.up === 2 && r.j.down === 2, 'two up two down -> net 0');
a = await alertOf('done'); ok(a?.status === 'recovered', `alert marked back above zero (${a?.status})`);
r = await vote('adam', -1); a = await alertOf(); ok(a?.status === 'open' && a.times === 2, `falls again -> reopened, times 2 (${a?.status}, ${a?.times})`);
r = await call('bea', '/api/mod/votes', { item: K, action: 'keep' }); ok(r.s === 403, `member cannot decide (${r.s})`);
r = await call('adam', '/api/mod/votes', { item: K, action: 'keep', note: 'Fair tie, sourced' }); ok(r.s === 200, 'Adam keeps it');
r = await vote('cal', 0); r = await vote('cal', -1); a = await alertOf('done'); ok(a?.status === 'kept', `kept item that stays below zero is not re-alerted (${a?.status})`);
// Suspend dot: dot's down vote stops counting.
r = await call('adam', '/api/mod/action', { type: 'user', id: 'umemberd000001', action: 'suspend' }); ok(r.s === 200, 'suspend dot');
r = await call(null, `/api/votes?items=${K}`); 
let tot = (await call('cal', `/api/votes?items=${K}&me=1`)).j.votes[K]; ok(tot.up === 1 && tot.down === 2, `after suspension dot's vote no longer counts (${tot.up}/${tot.down})`);
a = await alertOf('done'); ok(a?.status === 'kept', `still below zero after recount, stays kept (${a?.status})`);
r = await call('adam', '/api/mod/action', { type: 'user', id: 'umemberd000001', action: 'unsuspend' });
tot = (await call('cal', `/api/votes?items=${K}&me=1`)).j.votes[K]; ok(tot.down === 3, `lifting suspension counts dot again (${tot.down} down)`);
a = await alertOf('done'); ok(a?.status === 'kept' && a.up === 1 && a.down === 3, `kept alert counts updated, no new alert (${a?.status}, ${a?.up}/${a?.down})`);
r = await call('adam', '/api/mod/votes', { item: K, action: 'remove', note: 'Test removal' }); ok(r.s === 200, 'Adam marks for removal');
r = await call('adam', '/api/mod/votes/removals'); ok(r.j[K]?.status === 'exclude' && /after fans voted it below zero \(1 up, 3 down\): Test removal/.test(r.j[K].notes), `removals download: ${JSON.stringify(r.j[K])}`);
r = await call('bea', '/api/mod/votes/removals'); ok(r.s === 403, 'member cannot download removals');
r = await call(null, `/api/votes?items=${K},people/rod-serling`); ok(r.s === 200 && r.j.votes['people/rod-serling'].up === 0 && r.j.votes[K].mine === undefined, 'anonymous multi-item read');
r = await call(null, `/api/votes?items=${Array.from({ length: 21 }, (_, i) => 'people/x' + i).join(',')}`); ok(r.s === 400, '21 items refused');
r = await call('cal', '/api/account/export'); ok(r.j.votes?.length === 1 && r.j.votes[0].vote === 'down', 'data export includes votes');
// Delete cal: cal's down vote goes, the record recounts.
r = await call('cal', '/api/account/delete', { confirm: 'cal' }); ok(r.s === 200, 'cal deletes account');
tot = (await call(null, `/api/votes?items=${K}&x=1`)).j.votes[K];
tot = (await call('bea', `/api/votes?items=${K}&me=1`)).j.votes[K]; ok(tot.up === 1 && tot.down === 2, `after deletion cal's vote is gone (${tot.up}/${tot.down})`);
// Rate limit: 120 an hour.
let last; for (let i = 0; i < 125; i++) last = await vote('bea', i % 2 ? 1 : -1, 'people/rod-serling');
ok(last.s === 429, `rate limited after 120 votes an hour (${last.s})`);
console.log(fails ? `${fails} FAILED` : 'ALL PASS');
process.exit(fails ? 1 : 0);
