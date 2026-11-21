// IntoTheTwilightZone.com fan tools that run on every page. The checklist (watched, owned, wanted,
// favorites and later) is kept in this browser (localStorage). When a member is signed in, account.js
// copies it into their account and keeps the two in step through the tz:toggle event below.
(function () {
  'use strict';
  var STORE = 'tz-tracker-v1';
  var SPOIL = 'tz-spoilers';
  function load() {
    try { return norm(JSON.parse(localStorage.getItem(STORE) || '{}')); }
    catch (e) { return norm({}); }
  }
  var LISTS = ['watched', 'owned', 'wanted', 'favorite', 'later'];
  function norm(v) { var o = {}; LISTS.forEach(function (l) { o[l] = (v && v[l]) || {}; }); return o; }
  function save(t) { try { localStorage.setItem(STORE, JSON.stringify(t)); } catch (e) { /* storage blocked: the buttons still toggle for this visit */ } }
  var tracker = load();
  window.tzTracker = {
    get: function () { return tracker; },
    lists: LISTS,
    set: function (t) { tracker = norm(t); save(tracker); paint(); },
    toggle: function (list, key) {
      if (!tracker[list]) return;
      var on = !tracker[list][key];
      if (on) tracker[list][key] = new Date().toISOString().slice(0, 10); else delete tracker[list][key];
      save(tracker); paint();
      document.dispatchEvent(new CustomEvent('tz:toggle', { detail: { list: list, key: key, on: on } }));
    },
  };

  function paint() {
    document.querySelectorAll('[data-track]').forEach(function (b) {
      var l = tracker[b.getAttribute('data-track')];
      var on = !!(l && l[b.getAttribute('data-key')]);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.querySelectorAll('[data-mark]').forEach(function (el) {
      var k = el.getAttribute('data-mark');
      el.classList.toggle('is-watched', !!tracker.watched[k]);
      el.classList.toggle('is-owned', !!tracker.owned[k]);
      el.classList.toggle('is-wanted', !!tracker.wanted[k]);
      el.classList.toggle('is-favorite', !!tracker.favorite[k]);
      el.classList.toggle('is-later', !!tracker.later[k]);
    });
    document.querySelectorAll('[data-progress]').forEach(function (el) {
      var keys = (el.getAttribute('data-progress') || '').split(' ').filter(Boolean);
      var n = keys.filter(function (k) { return tracker.watched[k]; }).length;
      el.textContent = n + ' of ' + keys.length + ' watched';
    });
  }

  function spoilersOn() { try { return localStorage.getItem(SPOIL) === 'on'; } catch (e) { return false; } }
  function applySpoilers(on) {
    document.documentElement.classList.toggle('spoilers-on', on);
    document.querySelectorAll('details.spoiler').forEach(function (d) { d.open = on; });
    document.querySelectorAll('[data-spoiler-toggle]').forEach(function (b) {
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.textContent = on ? 'Spoilers shown: hide endings' : 'Spoilers hidden: show all endings';
    });
  }

  document.addEventListener('click', function (ev) {
    var t = ev.target.closest && ev.target.closest('[data-track],[data-spoiler-toggle]');
    if (!t) return;
    if (t.hasAttribute('data-track')) { window.tzTracker.toggle(t.getAttribute('data-track'), t.getAttribute('data-key')); return; }
    var on = !spoilersOn();
    try { localStorage.setItem(SPOIL, on ? 'on' : 'off'); } catch (e) { /* ignore */ }
    applySpoilers(on);
  });

  function init() { paint(); applySpoilers(spoilersOn()); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  document.addEventListener('tz:repaint', paint);
  window.addEventListener('storage', function (e) { if (e.key === STORE) { tracker = load(); paint(); } });
})();
