// IntoTheTwilightZone.com fan tools that run on every page. Everything is stored in this browser
// only (localStorage): no account, no cookies, nothing sent anywhere.
(function () {
  'use strict';
  var STORE = 'tz-tracker-v1';
  var SPOIL = 'tz-spoilers';
  function load() {
    try { var v = JSON.parse(localStorage.getItem(STORE) || '{}'); return { watched: v.watched || {}, owned: v.owned || {}, wanted: v.wanted || {} }; }
    catch (e) { return { watched: {}, owned: {}, wanted: {} }; }
  }
  function save(t) { try { localStorage.setItem(STORE, JSON.stringify(t)); } catch (e) { /* storage blocked: the buttons still toggle for this visit */ } }
  var tracker = load();
  window.tzTracker = {
    get: function () { return tracker; },
    set: function (t) { tracker = { watched: t.watched || {}, owned: t.owned || {}, wanted: t.wanted || {} }; save(tracker); paint(); },
    toggle: function (list, key) {
      if (tracker[list][key]) delete tracker[list][key]; else tracker[list][key] = new Date().toISOString().slice(0, 10);
      save(tracker); paint();
    },
  };

  function paint() {
    document.querySelectorAll('[data-track]').forEach(function (b) {
      var on = !!tracker[b.getAttribute('data-track')][b.getAttribute('data-key')];
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.querySelectorAll('[data-mark]').forEach(function (el) {
      var k = el.getAttribute('data-mark');
      el.classList.toggle('is-watched', !!tracker.watched[k]);
      el.classList.toggle('is-owned', !!tracker.owned[k]);
      el.classList.toggle('is-wanted', !!tracker.wanted[k]);
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
