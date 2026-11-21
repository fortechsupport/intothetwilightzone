// IntoTheTwilightZone.com member features that run on every page:
// - fills the header's account slot ("Sign in", or the member's username),
// - adds Favorite / Later / Discuss / Fan contributions to a record's actions,
// - keeps the browser checklist (fan.js) and the member's account in step.
// Visitors who never sign in cause no requests: everything waits for the tz_hint cookie, which only
// exists after signing in and holds nothing but the username.
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
    document.querySelectorAll('[data-account-slot]').forEach(function (a) {
      if (a.tagName !== 'A') return;
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
      if (!/^[a-z0-9][a-z0-9-]*(\/[a-z0-9][a-z0-9._-]*)+$/.test(key)) return;
      var html = '';
      var has = function (list) { return document.querySelector('[data-track="' + list + '"][data-key="' + key + '"]'); };
      if (!has('favorite')) html += '<button type="button" class="track-btn" data-track="favorite" data-key="' + esc(key) + '" aria-pressed="false"><span aria-hidden="true" class="tick"></span>Favorite</button>';
      if (!has('later')) html += '<button type="button" class="track-btn" data-track="later" data-key="' + esc(key) + '" aria-pressed="false"><span aria-hidden="true" class="tick"></span>Later</button>';
      html += '<a class="action-link" href=' + "'" + '/community/discuss/?item=' + encodeURIComponent(key) + "'" + '>Discuss</a>';
      html += '<a class="action-link" href=' + "'" + '/community/uploads/?item=' + encodeURIComponent(key) + "'" + '>Fan contributions</a>';
      box.insertAdjacentHTML('beforeend', html);
      box.setAttribute('data-filled', '1');
    });
    document.dispatchEvent(new Event('tz:repaint'));
  }

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
    signedIn: function (h) { handle = h; paintSlot(); sync(true); },
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
    },
    handle: function () { return handle; },
  };

  function init() { paintSlot(); fillRecordActions(); sync(false); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
