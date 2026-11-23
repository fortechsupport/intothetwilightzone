// IntoTheTwilightZone.com member features that run on every page:
// - fills the header's account slot ("Sign in", or the member's username),
// - adds Favorite / Later / thumbs up and down / Discuss / Fan contributions to a record's actions,
// - keeps the browser checklist (fan.js) and the member's account in step.
// Visitors who never sign in cause one request, on record pages only: the vote counts (cached for a minute at
// Cloudflare). Everything else waits for the tz_hint cookie, which only exists after signing in and holds nothing
// but the username.
(function () {
  'use strict';
  function cookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }
  var handle = cookie('tz_hint');
  var OWNER = 'tz-account-owner';
  var SYNCED = 'tz-synced-at';

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } }
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }

  function api(path, body, method) {
    return fetch(path, {
      method: method || (body ? 'POST' : 'GET'),
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'same-origin',
    }).then(function (r) {
      if (r.status === 401) { signedOutLocally(); throw new Error('signed out'); }
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  function signedOutLocally() {
    document.cookie = 'tz_hint=; Max-Age=0; Path=/; Secure; SameSite=Lax';
    window.tzAccount.signedOut();
  }

  function paintSlot() {
    document.querySelectorAll('[data-account-slot]').forEach(function (slot) {
      var a = slot.tagName === 'A' ? slot : slot.querySelector('a');
      if (!a) return;
      a.setAttribute('href', '/account/');
      a.textContent = handle ? handle : 'Sign in';
      if (handle) a.setAttribute('aria-label', 'Your account: ' + handle); else a.removeAttribute('aria-label');
      a.classList.toggle('is-signed-in', !!handle);
    });
  }

  // Record pages: the layout leaves <div class="record-actions" data-record-key="collection/id">.
  function fillRecordActions() {
    document.querySelectorAll('.record-actions[data-record-key]').forEach(function (box) {
      if (box.getAttribute('data-filled')) return;
      var key = box.getAttribute('data-record-key');
      if (!KEY_RE.test(key)) return;
      var html = '';
      var has = function (list) { return document.querySelector('[data-track="' + list + '"][data-key="' + key + '"]'); };
      if (!has('favorite')) html += '<button type="button" class="track-btn" data-track="favorite" data-key="' + esc(key) + '" aria-pressed="false"><span aria-hidden="true" class="tick"></span>Favorite</button>';
      if (!has('later')) html += '<button type="button" class="track-btn" data-track="later" data-key="' + esc(key) + '" aria-pressed="false"><span aria-hidden="true" class="tick"></span>Later</button>';
      html += voteGroup(key);
      html += '<a class="action-link" href=' + "'" + '/community/discuss/?item=' + encodeURIComponent(key) + "'" + '>Discuss</a>';
      html += '<a class="action-link" href=' + "'" + '/community/uploads/?item=' + encodeURIComponent(key) + "'" + '>Fan contributions</a>';
      box.insertAdjacentHTML('beforeend', html);
      box.setAttribute('data-filled', '1');
    });
    document.dispatchEvent(new Event('tz:repaint'));
    loadVotes();
  }

  // Thumbs up / thumbs down (docs/plans/fan-votes.md). Counts are public; voting needs an account so each
  // fan counts once. The group stays hidden until the counts arrive, so it never shows where accounts are off.
  // Icons: Feather (MIT licence, feathericons.com).
  var KEY_RE = /^[a-z0-9][a-z0-9-]*(\/[a-z0-9][a-z0-9._-]*)+$/;
  var THUMB_UP = '<svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>';
  var THUMB_DOWN = '<svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></svg>';
  function voteButtons(what) {
    return '<button type="button" class="vote-btn" data-vote="1" data-what="' + what + '" aria-pressed="false">' + THUMB_UP + '<span class="vote-n">0</span></button>' +
      '<button type="button" class="vote-btn" data-vote="-1" data-what="' + what + '" aria-pressed="false">' + THUMB_DOWN + '<span class="vote-n">0</span></button>' +
      '<span class="vote-msg" aria-live="polite"></span>';
  }
  function voteGroup(key) {
    return '<div class="vote" role="group" aria-label="Fan votes" data-vote-key="' + esc(key) + '" hidden>' + voteButtons('') + '</div>';
  }
  // Single links (homages, references, adaptations): <span class="link-vote" data-vote-key="connections/..."> from
  // src/components/fan/LinkVote.astro. Smaller buttons, same behaviour.
  function setUpLinkVotes() {
    document.querySelectorAll('.link-vote[data-vote-key]:not(.vote)').forEach(function (el) {
      if (!KEY_RE.test(el.getAttribute('data-vote-key'))) return;
      el.className = 'link-vote vote vote-sm';
      el.setAttribute('role', 'group');
      el.setAttribute('aria-label', 'Fan votes on this link');
      el.hidden = true;
      el.innerHTML = voteButtons(' for this link');
    });
  }
  function paintVote(group, v) {
    var btns = group.querySelectorAll('.vote-btn');
    [[btns[0], v.up, 1, 'Thumbs up'], [btns[1], v.down, -1, 'Thumbs down']].forEach(function (b) {
      var what = b[0].getAttribute('data-what') || '';
      b[0].querySelector('.vote-n').textContent = String(b[1]);
      b[0].setAttribute('aria-label', b[3] + what + ', ' + b[1] + (b[1] === 1 ? ' vote' : ' votes'));
      b[0].setAttribute('title', b[3] + what);
      b[0].setAttribute('aria-pressed', v.mine === b[2] ? 'true' : 'false');
    });
    group.hidden = false;
  }
  function groupsFor(key) {
    return Array.prototype.filter.call(document.querySelectorAll('.vote[data-vote-key]'), function (g) { return g.getAttribute('data-vote-key') === key; });
  }

  // Counts load as groups come near the screen, 50 at a time (a long homage list doesn't load all at once).
  var votesOff = false, queued = {}, loaded = {}, timer = 0, observer = null;
  function want(key) { if (votesOff || loaded[key] || queued[key]) return; queued[key] = 1; clearTimeout(timer); timer = setTimeout(flush, 60); }
  function flush() {
    var keys = Object.keys(queued);
    queued = {};
    for (var i = 0; i < keys.length; i += 50) fetchVotes(keys.slice(i, i + 50));
  }
  function fetchVotes(keys) {
    keys.forEach(function (k) { loaded[k] = 1; });
    fetch('/api/votes?items=' + keys.map(encodeURIComponent).join(',') + (handle ? '&me=1' : ''), { credentials: 'same-origin', cache: handle ? 'no-store' : 'default' })
      .then(function (r) { if (r.status === 503) votesOff = true; return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || !d.votes) return; // accounts not switched on here: leave the buttons hidden
        keys.forEach(function (k) { var v = d.votes[k]; if (v) groupsFor(k).forEach(function (g) { paintVote(g, v); }); });
      })
      .catch(function () { keys.forEach(function (k) { delete loaded[k]; }); });
  }
  function loadVotes(again) {
    setUpLinkVotes();
    if (again) loaded = {};
    var groups = document.querySelectorAll('.vote[data-vote-key]');
    if (!groups.length) return;
    if (!('IntersectionObserver' in window)) { groups.forEach(function (g) { want(g.getAttribute('data-vote-key')); }); return; }
    // A hidden group has no box to watch, so watch the row (or actions bar) it sits in.
    if (!observer) observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) en.target.querySelectorAll(':scope > .vote[data-vote-key]').forEach(function (g) { want(g.getAttribute('data-vote-key')); });
      });
    }, { rootMargin: '600px 0px' });
    groups.forEach(function (g) { var row = g.parentElement; observer.unobserve(row); observer.observe(row); });
  }
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.vote-btn') : null;
    if (!btn) return;
    var group = btn.closest('.vote');
    var key = group.getAttribute('data-vote-key');
    var msg = group.querySelector('.vote-msg');
    if (!handle) {
      msg.innerHTML = '<a href=' + "'" + '/account/' + "'" + '>Sign in to vote</a>. Votes need a free account so each fan counts once.';
      return;
    }
    var chosen = Number(btn.getAttribute('data-vote'));
    var value = btn.getAttribute('aria-pressed') === 'true' ? 0 : chosen; // pressing your vote again withdraws it
    group.querySelectorAll('.vote-btn').forEach(function (b) { b.disabled = true; });
    api('/api/votes', { item: key, value: value })
      .then(function (r) {
        groupsFor(key).forEach(function (g) { paintVote(g, r); });
        msg.textContent = value === 0 ? 'Vote withdrawn.' : 'Thanks, your vote is in.';
      })
      .catch(function (err) {
        msg.textContent = /signed out/.test(err.message) ? 'Please sign in again to vote.' : /429/.test(err.message) ? 'That is a lot of votes at once. Please try again later.' : 'Your vote did not go through. Please try again.';
      })
      .then(function () { group.querySelectorAll('.vote-btn').forEach(function (b) { b.disabled = false; }); });
  });

  // Keep the account and this browser in step.
  function sync(force) {
    if (!handle || !window.tzTracker) return;
    var last = Number(ss(SYNCED) || '0');
    if (!force && Date.now() - last < 5 * 60 * 1000 && ls(OWNER) === handle) return;
    var local = window.tzTracker.get();
    var first = ls(OWNER) !== handle;
    var hasLocal = window.tzTracker.lists.some(function (l) { return Object.keys(local[l] || {}).length; });
    var p = first && hasLocal ? api('/api/lists/merge', local).then(function (r) { return r.lists; }) : api('/api/lists');
    p.then(function (lists) {
      ls(OWNER, handle);
      ss(SYNCED, String(Date.now()));
      window.tzTracker.set(lists);
      document.dispatchEvent(new CustomEvent('tz:synced'));
      if (first && hasLocal) document.dispatchEvent(new CustomEvent('tz:migrated'));
    }).catch(function () { /* offline or signed out: the browser copy still works */ });
  }

  document.addEventListener('tz:toggle', function (e) {
    if (!handle) return;
    var d = e.detail || {};
    api('/api/lists', { list: d.list, key: d.key, on: !!d.on }).catch(function () { ss(SYNCED, '0'); });
  });

  // When the account page signs someone in or out, it tells us.
  window.tzAccount = {
    signedIn: function (h) { handle = h; paintSlot(); sync(true); loadVotes(true); },
    signedOut: function () {
      handle = '';
      // Only clear the browser copy if it belongs to an account; a visitor's own checklist stays.
      if (!ls(OWNER)) { paintSlot(); return; }
      ls(OWNER, null);
      ss(SYNCED, '0');
      // The account keeps the lists; clear this browser's copy so the next person here doesn't see them.
      if (window.tzTracker) window.tzTracker.set({});
      document.dispatchEvent(new CustomEvent('tz:synced'));
      paintSlot();
      loadVotes(true);
    },
    handle: function () { return handle; },
  };

  function init() { paintSlot(); fillRecordActions(); sync(false); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
