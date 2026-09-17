/* =========================================================================
   MIZTWEAKZ. site.js (Shopify theme build)
   Shared behaviour for every page (no framework, no build step):
     1. inline icon set            (<i data-icon="name"></i> → inline SVG)
     2. (header + footer are rendered server-side by Liquid, not here)
     3. nav: hover dropdown, active tab, hamburger drawer
     4. renderers: pack grid, testimonial marquee, review cards, FAQ items
     5. mount animation ([data-mount]) + scroll reveal (.animate / .reveal)
     6. brand marquee cloning
     7. FAQ accordion ([data-accordion])
     8. modal system (data-modal="pack-buy|pack-learn|login|cookie-prefs")
     9. cookie consent card + preferences modal (localStorage "mz-consent")
    10. page transitions (same-origin links fade out 220 ms, then navigate)
    11. download buttons hand off to /pages/install
    12. deep links (?pack=<handle> opens that pack's Buy modal)
   Public API: window.MZ.ui  (see BUILD-NOTES.md)
   Requires data.js to be loaded first.
   ========================================================================= */
(function () {
  'use strict';

  var MZ = window.MZ || (window.MZ = {});
  var H = MZ.helpers || {};
  var doc = document;
  var reduceMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var DESKTOP_NAV_MIN = 1416; // px. Matches the CSS breakpoint (Paragon NavBar: isMobile = innerWidth <= 1415)

  /* ---------- utilities ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function qs(sel, root) { return (root || doc).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); }
  function el(html) { var t = doc.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function money(n) { return H.money ? H.money(n) : '$' + Number(n).toFixed(2); }

  /* ---------- 1. icons ---------- */
  var STROKE_ATTRS = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  var ICONS = {
    'aff-account': '<rect x="3" y="5" width="18" height="14" rx="3" fill="currentColor" opacity=".14" stroke="none"/><rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="11" r="2.2"/><path d="M5.6 16.4c.7-1.5 1.9-2.3 3.4-2.3s2.7.8 3.4 2.3"/><path d="M15 9.5h3.5M16.75 7.75v3.5"/><path d="M14.5 14.5h4"/>',
    'aff-share': '<path d="M3.5 12V5.5a2 2 0 0 1 2-2H12l8.5 8.5-6.5 6.5z" fill="currentColor" opacity=".14" stroke="none"/><path d="M3.5 12V5.5a2 2 0 0 1 2-2H12l8.5 8.5-6.5 6.5z"/><circle cx="8.2" cy="8.2" r="1.3"/><path d="M8.5 15.5l5-5"/><circle cx="9.3" cy="14.7" r=".8" fill="currentColor" stroke="none"/><circle cx="12.7" cy="11.3" r=".8" fill="currentColor" stroke="none"/><path d="M16.5 21h4.5v-4.5M21 21l-5-5"/>',
    'aff-earn': '<rect x="3.5" y="13" width="4" height="7" rx="1" fill="currentColor" opacity=".12" stroke="none"/><rect x="3.5" y="13" width="4" height="7" rx="1"/><rect x="10" y="9" width="4" height="11" rx="1" fill="currentColor" opacity=".18" stroke="none"/><rect x="10" y="9" width="4" height="11" rx="1"/><rect x="16.5" y="4.5" width="4" height="15.5" rx="1" fill="currentColor" opacity=".26" stroke="none"/><rect x="16.5" y="4.5" width="4" height="15.5" rx="1"/><path d="M4 9.5l4.5-3 3.5 2 6-4.5"/><path d="M15.5 4h2.5v2.5"/>',

    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    tags: '<path d="M12.6 2.6 21 11a2 2 0 0 1 0 2.8l-7.2 7.2a2 2 0 0 1-2.8 0L2.6 12.6A2 2 0 0 1 2 11.2V4a2 2 0 0 1 2-2h7.2a2 2 0 0 1 1.4.6z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    envelope: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    bars: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    times: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    'arrow-right': '<path d="M5 12h14M12 5l7 7-7 7"/>',
    'arrow-up-right': '<path d="M7 17 17 7M7 7h10v10"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    gauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
    stopwatch: '<circle cx="12" cy="14" r="8"/><path d="M12 14v-4M9 2h6M12 2v4"/>',
    signal: '<path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    'shield-half': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 2v20"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    headset: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
    infinity: '<path d="M12 12c-2-2.7-3.6-4-6-4a4 4 0 0 0 0 8c2.4 0 4-1.3 6-4 2 2.7 3.6 4 6 4a4 4 0 0 0 0-8c-2.4 0-4 1.3-6 4z"/>',
    external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/>',
    broom: '<path d="M21 3 12 12"/><path d="m12 12-4-2-5 5 6 6 5-5-2-4z"/><path d="m6 18 3 3"/>',
    cookie: '<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5z"/><path d="M8.5 8.5v.01M16 15.5v.01M12 12v.01M11 17v.01M7 14v.01"/>',
    cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    /* filled */
    bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    crown: '<path d="M3 18h18l1-11-5 4-5-7-5 7-5-4 1 11zm0 2h18v2H3z"/>',
    star: '<path d="M12 2l3.1 6.6 7 .9-5.2 4.9 1.4 7L12 18l-6.3 3.4 1.4-7L2 9.5l7-.9z"/>',
    discord: '<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>',
    youtube: '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>',
    tiktok: '<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>',
    instagram: '<path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>',
    twitch: '<path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0 1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>',
    kick: '<path d="M1.333 0h8v5.333H12V2.667h2.667V0h8v8H20v2.667h-2.667v2.666H20V16h2.667v8h-8v-2.667H12v-2.666H9.333V24h-8z"/>',
  };
  var FILLED = { bolt: 1, crown: 1, star: 1, discord: 1, youtube: 1, tiktok: 1, instagram: 1 };

  function icon(name, cls) {
    var d = ICONS[name];
    if (!d) return '';
    return '<svg class="icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false" ' +
      (FILLED[name] ? 'fill="currentColor"' : STROKE_ATTRS) + '>' + d + '</svg>';
  }
  function hydrateIcons(root) {
    qsa('[data-icon]', root).forEach(function (n) {
      if (n.getAttribute('data-icon-done')) return;
      n.innerHTML = icon(n.getAttribute('data-icon'));
      n.classList.add('icon-wrap');
      n.setAttribute('data-icon-done', '1');
    });
  }

  /* ---------- 2. active-link helpers (header markup lives in sections/header.liquid) ---------- */
  function firstSegment(pathname) {
    var s = (pathname || location.pathname).split('/')[1] || '';
    return '/' + (s ? s + '/' : '');
  }
  function isActive(href) { return firstSegment(href) === firstSegment(location.pathname); }
  /* the word "Free" is always green in UI labels (owner request 2026-09-10): wrap standalone "Free" in buttons, pills, plan names, labels and feature lists */
  function greenFree(root) {
    var scope = root || document;
    var sel = '.nice-button, .btn-clear, .plan-name, .plan-tag, .title-tag, .banner-pill, .pill, .section-label, .cta-note, .features li, h1, h2, h3, .stat-chip, .footer-cta, .download-meta, .billing-note';
    var walker, nodes = [], el;
    var boxes = scope.querySelectorAll(sel);
    for (var i = 0; i < boxes.length; i++) {
      walker = document.createTreeWalker(boxes[i], NodeFilter.SHOW_TEXT, null);
      while ((el = walker.nextNode())) { if (/\bFree\b/.test(el.nodeValue) && !el.parentNode.closest('.free-word')) nodes.push(el); }
    }
    nodes.forEach(function (t) {
      var frag = document.createDocumentFragment(), parts = t.nodeValue.split(/(\bFree\b)/);
      parts.forEach(function (s) { if (s === 'Free') { var sp = document.createElement('span'); sp.className = 'free-word'; sp.textContent = s; frag.appendChild(sp); } else if (s) frag.appendChild(document.createTextNode(s)); });
      t.parentNode.replaceChild(frag, t);
    });
  }



  /* ---------- 3. nav behaviour ---------- */
  function initNav(root) {
    root = root || doc;     // the header is server-rendered by Liquid, so query the live DOM
    /* one Shopify menu can have several parents with children, so wire every wrapper (the static build only ever had one) */
    qsa('.nav-dropdown-wrap', root).forEach(function (wrap) {
      if (wrap.getAttribute('data-nav-ready')) return;
      var tab = qs('.has-dropdown', wrap), timer;
      if (!tab) return;
      wrap.setAttribute('data-nav-ready', '1');
      var open = function () { clearTimeout(timer); wrap.classList.add('open'); tab.setAttribute('aria-expanded', 'true'); };
      var close = function () { wrap.classList.remove('open'); tab.setAttribute('aria-expanded', 'false'); };
      wrap.addEventListener('mouseenter', open);
      wrap.addEventListener('mouseleave', function () { timer = setTimeout(close, 120); });
      wrap.addEventListener('focusin', open);
      wrap.addEventListener('focusout', function (e) { if (!wrap.contains(e.relatedTarget)) close(); });
      wrap.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { close(); tab.focus(); }
        if (e.key === 'ArrowDown' && e.target === tab) {
          e.preventDefault(); open();
          var first = qs('.dropdown-panel a', wrap);
          if (first) first.focus();
        }
      });
    });

    var burger = qs('.hamburger-container', root), menu = qs('#mobile-menu', root);
    if (burger && menu) {
      var setMenu = function (on) {
        menu.classList.toggle('open', on);
        doc.body.classList.toggle('menu-open', on);            // lock page scroll behind the open panel
        burger.setAttribute('aria-expanded', String(on));
        burger.setAttribute('aria-label', on ? 'Close menu' : 'Open menu');
        burger.innerHTML = icon(on ? 'times' : 'bars');         // bars ⇄ X so the close affordance is visible
      };
      burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
      menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
      doc.addEventListener('pointerdown', function (e) {
        if (menu.classList.contains('open') && !menu.contains(e.target) && !burger.contains(e.target)) setMenu(false);
      });
      doc.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); burger.focus(); }
      });
      window.addEventListener('resize', function () { if (window.innerWidth >= DESKTOP_NAV_MIN) setMenu(false); });
    }
  }

  /* ---------- 4. renderers ---------- */
  function stars(n) {
    var out = '';
    for (var i = 1; i <= 5; i++) out += icon('star', i <= n ? '' : 'dim');
    return '<span class="review-stars" role="img" aria-label="' + n + ' out of 5 stars">' + out + '</span>';
  }
  function reviewCard(r, cls) {
    var pack = H.pack ? H.pack(r.pack) : null;
    var avatar = r.avatar
      ? '<img src="' + r.avatar + '" width="45" height="45" alt="" loading="lazy">'
      : esc(r.initials || r.name.charAt(0));
    return '<article class="review-card' + (cls ? ' ' + cls : '') + '">' +
      '<div class="review-head"><div class="review-avatar" aria-hidden="true">' + avatar + '</div>' +
      '<div><div class="review-name">' + esc(r.name) + '</div><span class="review-verified">' + icon('check') + 'Verified Buyer</span></div></div>' +
      stars(r.rating) +
      (r.title ? '<h3 class="review-title">' + esc(r.title) + '</h3>' : '') +
      '<p class="review-body">' + esc(r.body) + '</p>' +
      '<div class="review-meta"><span>' + esc(pack ? pack.name : 'XBOX Pack') + '</span>' +
      '<time datetime="' + esc(r.date) + '">' + esc(H.formatDate ? H.formatDate(r.date) : r.date) + '</time></div>' +
      '</article>';
  }
  function priceRow(p) {
    var save = p.compareAt && H.savings ? H.savings(p) : 0;
    return '<div class="price-row">' +
      '<span class="price">' + money(p.price) + '<span class="price-currency">USD</span></span>' +
      (p.compareAt ? '<span class="original-price"><span class="sr-only">Regular price </span>' + money(p.compareAt) + '</span>' +
        '<span class="sale-badge">Sale · ' + save + '% off</span>' : '') +
      '</div>';
  }
  function featureList(items, cls) {
    return '<ul class="features' + (cls ? ' ' + cls : '') + '">' + items.map(function (f) {
      return '<li>' + icon('check') + '<span>' + esc(f) + '</span></li>';
    }).join('') + '</ul>';
  }
  /* Box art as <picture>: real 2:3 renders. Webp 512w + 768w, PNG fallback. `sizes` = rendered CSS width. */
  function packArt(p, sizes, eager) {
    var srcset = p.imageLg ? p.image + ' 512w, ' + p.imageLg + ' 768w' : p.image;
    return '<picture>' +
      '<source type="image/webp" srcset="' + srcset + '" sizes="' + (sizes || '220px') + '">' +
      '<img src="' + (p.imageFallback || p.image) + '" width="512" height="768" alt="' + esc(p.name) + ' box art"' + (eager ? '' : ' loading="lazy"') + '>' +
      '</picture>';
  }
  function packCard(p, opts) {
    opts = opts || {};
    var gradient = !!p.gradient;
    var tag = p.tag ? '<span class="card-tag' + (gradient ? ' card-tag--gradient' : '') + '">' + esc(p.tag) + '</span>' : '';
    var card =
      '<div class="pack-card-wrapper" style="--color:' + p.color + '">' + tag +
        '<article class="pack-card glass-card glass-card--hover" id="pack-' + esc(p.handle) + '" aria-labelledby="pack-' + esc(p.handle) + '-title">' +
          '<div class="top-card-container"><div class="top-card' + (gradient ? ' top-card--gradient' : '') + '">' +
            packArt(p, '180px') +
          '</div></div>' +
          '<div class="content-wrapper">' +
            '<h3 class="feature-header" id="pack-' + esc(p.handle) + '-title" style="font-size:1.5rem">' + esc(p.name) + '</h3>' +
            priceRow(p) +
            '<p class="description">' + esc(p.description) + '</p>' +
            '<div class="nice-button-box book-now-box"><button type="button" class="nice-button btn-md' + (gradient ? ' gradient' : '') + '" data-modal="pack-buy" data-pack="' + esc(p.handle) + '">Buy Now</button></div>' +
            '<div><h4 class="feature-header" style="margin-bottom:10px;font-size:1.05em">What\'s Included</h4>' + featureList(p.features.slice(0, opts.maxFeatures || 6)) + '</div>' +
            '<button type="button" class="btn-clear" data-modal="pack-learn" data-pack="' + esc(p.handle) + '"><span>Learn More</span><span class="btn-clear__arrow">' + icon('arrow-right') + '</span></button>' +
          '</div>' +
        '</article>' +
      '</div>';
    if (p.featured && opts.featuredShell !== false) card = '<div class="outer-glow-container">' + card + '</div>';
    return card;
  }
  function renderPackGrids(root) {
    qsa('[data-render="pack-grid"]', root).forEach(function (grid) {
      var packs = MZ.packs || [];
      var handles = grid.getAttribute('data-packs'), cat = grid.getAttribute('data-category');
      if (handles) {
        var list = handles.split(',').map(function (h) { return h.trim(); });
        packs = list.map(function (h) { return H.pack ? H.pack(h) : null; }).filter(Boolean);
      } else if (cat) {
        packs = packs.filter(function (p) { return p.category === cat; });
      }
      grid.innerHTML = packs.map(function (p) { return packCard(p, { maxFeatures: Number(grid.getAttribute('data-max-features')) || 6 }); }).join('');
    });
  }
  function renderTestimonials(root) {
    qsa('[data-render="testimonials"]', root).forEach(function (box) {
      var ids = MZ.homeReviews || [];
      var reviews = ids.map(function (id) {
        return (MZ.reviews || []).filter(function (r) { return r.id === id; })[0];
      }).filter(Boolean);
      if (!reviews.length) return;
      var n = reviews.length, cardW = 320, gap = 30;
      var set = reviews.map(function (r) { return reviewCard(r); }).join('');
      box.innerHTML =
        '<div class="testimonials" aria-label="Customer reviews">' +
          '<div class="testimonial-track" style="--marquee-distance:' + (-(cardW + gap) * n) + 'px;--marquee-duration:' + ((cardW + gap) * n * 0.0162).toFixed(2) + 's">' +
            '<div class="testimonial-set">' + set + '</div>' +
            '<div class="testimonial-set" aria-hidden="true">' + set + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="static-cards">' + reviews.slice(0, 3).map(function (r) { return reviewCard(r, 'review-card--static'); }).join('') + '</div>';
    });
  }
  function faqItem(f) {
    return '<div class="faq-item"><h3><button type="button" class="faq-question" aria-expanded="false">' + esc(f.q) +
      '<span class="faq-icon" aria-hidden="true">' + icon('plus') + '</span></button></h3>' +
      '<div class="faq-answer"><div class="faq-answer-inner">' + esc(f.a) + '</div></div></div>';
  }
  function renderFaqs(root) {
    qsa('[data-render="faq"]', root).forEach(function (list) {
      var src = MZ[list.getAttribute('data-source') || 'faqs'] || [];
      list.innerHTML = src.map(faqItem).join('');
      list.setAttribute('data-accordion', '');
    });
  }

  /* ---------- 5. mount animation + scroll reveal ---------- */
  function initMount() {
    var mounts = qsa('[data-mount]');
    setTimeout(function () { mounts.forEach(function (m) { m.classList.add('loaded'); }); }, 100);
    var logo = qs('.logo-showcase');
    if (logo) {
      setTimeout(function () { logo.classList.add('transitioning'); }, 500);
      setTimeout(function () { logo.classList.add('final'); }, 1300);
    }
  }
  var revealers = null;
  function initReveal(root) {
    var animate = qsa('.animate:not(.slide-up)', root), reveal = qsa('.reveal:not(.visible)', root);
    if (!('IntersectionObserver' in window) || reduceMotion.matches) {
      animate.forEach(function (a) { a.classList.add('slide-up'); });
      reveal.forEach(function (r) { r.classList.add('visible'); });
      return;
    }
    if (!revealers) {
      revealers = {
        animate: new IntersectionObserver(function (entries, io) {
          entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('slide-up'); io.unobserve(en.target); } });
        }, { threshold: 0.01, rootMargin: '0px' }),
        reveal: new IntersectionObserver(function (entries, io) {
          entries.forEach(function (en) {
            // tall sections (> 1.5 viewports) can never reach 20 %, so lower the bar for them
            var need = en.target.offsetHeight > window.innerHeight * 1.5 ? 0.05 : 0.2;
            if (en.isIntersecting && en.intersectionRatio >= need) { en.target.classList.add('visible'); io.unobserve(en.target); }
          });
        }, { threshold: [0.05, 0.2] })
      };
    }
    animate.forEach(function (a) { revealers.animate.observe(a); });
    reveal.forEach(function (r) { revealers.reveal.observe(r); });
  }

  /* ---------- 6. brand marquee ---------- */
  function initBrandsMarquee() {
    qsa('[data-marquee="brands"]').forEach(function (track) {
      var set = qs('.brands-set', track);
      if (!set) return;
      if (!set.children.length && MZ.games) {
        set.innerHTML = MZ.games.map(function (g) {
          return '<li class="brand-item"><img src="' + g.image + '" width="120" height="60" alt="' + esc(g.name) + '" loading="lazy"></li>';
        }).join('');
      }
      for (var i = 0; i < 2; i++) {
        var clone = set.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      }
    });
  }

  /* ---------- 7. FAQ accordion ---------- */
  var accId = 0;
  function initAccordions(root) {
    qsa('[data-accordion]', root).forEach(function (list) {
      if (list.getAttribute('data-accordion-ready')) return;
      list.setAttribute('data-accordion-ready', '1');
      var items = qsa('.faq-item', list);
      items.forEach(function (item) {
        var btn = qs('.faq-question', item), ans = qs('.faq-answer', item);
        if (!btn || !ans) return;
        var id = 'faq-answer-' + (++accId);
        ans.id = id;
        btn.setAttribute('aria-controls', id);
        btn.setAttribute('aria-expanded', 'false');
        btn.addEventListener('click', function () {
          var wasOpen = item.classList.contains('open');
          items.forEach(function (o) {
            o.classList.remove('open');
            qs('.faq-question', o).setAttribute('aria-expanded', 'false');
            qs('.faq-answer', o).style.maxHeight = '';
          });
          if (!wasOpen) {
            item.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
            ans.style.maxHeight = ans.scrollHeight + 'px';
          }
        });
      });
      window.addEventListener('resize', function () {
        qsa('.faq-item.open .faq-answer', list).forEach(function (a) { a.style.maxHeight = a.scrollHeight + 'px'; });
      });
    });
  }

  /* ---------- 8. modal system ---------- */
  var modal = { root: null, opener: null, pendingOpener: null, open: false, closeTimer: null, onClose: null };
  function focusables(root) {
    return qsa('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])', root)
      .filter(function (n) { return n.offsetParent !== null; });
  }
  function ensureModal() {
    if (modal.root) return;
    modal.root = el(
      '<div class="modal-backdrop" id="mz-modal" hidden>' +
        '<div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="mz-modal-title" tabindex="-1">' +
          '<div class="modal-top-bar"><div id="mz-modal-title"></div>' +
            '<button type="button" class="modal-close" aria-label="Close dialog">&times;</button></div>' +
          '<div class="modal-body" id="mz-modal-body"></div>' +
          '<div class="modal-footer" id="mz-modal-footer"></div>' +
        '</div>' +
      '</div>');
    doc.body.appendChild(modal.root);
    modal.root.addEventListener('click', function (e) { if (e.target === modal.root) closeModal(); });
    qs('.modal-close', modal.root).addEventListener('click', closeModal);
    var mb = qs('.modal-body', modal.root);
    mb.addEventListener('scroll', function () { mb.classList.toggle('is-scrolled', mb.scrollTop > 10); });
  }
  /* openModal({ title, titleHTML, color, gradient, colored, maxWidth, bodyHTML, footerHTML, onOpen, onClose }) */
  function openModal(o) {
    o = o || {};
    ensureModal();
    clearTimeout(modal.closeTimer);
    var content = qs('.modal-content', modal.root), mb = qs('.modal-body', modal.root);
    content.style.setProperty('--max-width', o.maxWidth || '1200px');
    content.style.setProperty('--color', o.color || 'var(--accent)');
    content.classList.toggle('modal-content--colored', !!o.colored);
    qs('#mz-modal-title', modal.root).innerHTML = o.titleHTML ||
      ('<h2 class="title-tag title-tag--large' + (o.gradient ? ' title-tag--gradient' : '') + '">' +
        (o.gradient ? '<span>' + esc(o.title) + '</span>' : esc(o.title)) + '</h2>');
    mb.innerHTML = o.bodyHTML || '';
    qs('#mz-modal-footer', modal.root).innerHTML = o.footerHTML || '';
    hydrateIcons(modal.root);
    if (!modal.open) modal.opener = modal.pendingOpener || doc.activeElement; // pendingOpener = the clicked trigger (Safari/Firefox don't focus buttons on click)
    modal.pendingOpener = null;
    modal.onClose = o.onClose || modal.onClose;
    modal.root.hidden = false;
    doc.body.classList.add('modal-open');
    requestAnimationFrame(function () { requestAnimationFrame(function () { modal.root.classList.add('is-open'); }); });
    modal.open = true;
    mb.scrollTop = 0;
    mb.classList.remove('is-scrolled');
    var f = focusables(content);
    (f.length > 1 ? f[1] : (f[0] || content)).focus({ preventScroll: true }); // skip the × when there is real content
    if (o.onOpen) o.onOpen(modal.root);
    doc.dispatchEvent(new CustomEvent('mz:modal-open', { detail: { title: o.title } }));
  }
  function closeModal() {
    if (!modal.open) return;
    modal.open = false;
    modal.root.classList.remove('is-open');
    doc.body.classList.remove('modal-open');
    modal.closeTimer = setTimeout(function () { modal.root.hidden = true; }, reduceMotion.matches ? 0 : 260);
    if (modal.opener && modal.opener.focus && doc.contains(modal.opener)) modal.opener.focus({ preventScroll: true });
    modal.opener = null;
    var cb = modal.onClose; modal.onClose = null;
    if (cb) cb();
    doc.dispatchEvent(new CustomEvent('mz:modal-close'));
  }
  doc.addEventListener('keydown', function (e) {
    if (!modal.open) return;
    if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
    if (e.key !== 'Tab') return;
    var f = focusables(qs('.modal-content', modal.root));
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* modal content: pack "Learn More" (Paragon LearnMore) */
  function infoCards() {
    return '<div class="glass-info-card-grid">' + (MZ.delivery.receive || []).map(function (r) {
      return '<div class="glass-info-card glass-card"><span class="info-accent" aria-hidden="true"></span>' +
        '<h4>' + icon(r.icon) + esc(r.title) + '</h4><p>' + esc(r.text) + '</p></div>';
    }).join('') + '</div>';
  }
  function packLearn(p) {
    var reviews = H.reviewsFor ? H.reviewsFor(p.handle).slice(0, 3) : [];
    var body =
      priceRow(p) +
      '<p class="modal-description">' + esc(p.description) + '</p>' +
      '<div class="modal-section"><h3 class="feature-header feature-header--color">What\'s Included</h3>' + featureList(p.features) + '</div>' +
      '<div class="modal-section"><h3 class="feature-header feature-header--color">' + esc(MZ.delivery.receiveTitle) + '</h3>' + infoCards() + '</div>' +
      '<div class="modal-note">' + icon('download') + '<span><strong>Delivery:</strong> ' + esc(MZ.delivery.text) + '</span></div>' +
      (reviews.length
        ? '<div class="modal-section"><h3 class="feature-header feature-header--color">Reviews</h3>' +
          '<div class="rating-summary">' + stars(Math.round(p.rating)) + '<span>' + p.rating.toFixed(2) + ' average · ' + p.reviewCount + ' verified reviews</span></div>' +
          '<div class="modal-reviews">' + reviews.map(function (r) { return reviewCard(r, 'review-card--compact'); }).join('') + '</div></div>'
        : '<div class="modal-note">' + icon('star') + '<span>No reviews yet. This pack is brand new.</span></div>') +
      '<div class="modal-section"><h3 class="feature-header feature-header--color">Frequently Asked Questions</h3>' +
        '<div class="faq-list" data-accordion>' + (MZ.faqs || []).slice(1, 5).map(faqItem).join('') + '</div></div>' +
      '<div class="modal-note modal-note--warn">' + icon('info') + '<span><strong>Refund policy:</strong> ' + esc(MZ.delivery.refund) + '</span></div>';
    var footer =
      '<div class="nice-button-box" style="--color:' + p.color + '"><button type="button" class="nice-button btn-md' + (p.gradient ? ' gradient' : '') + '" data-modal="pack-buy" data-pack="' + esc(p.handle) + '">Buy Now · ' + money(p.price) + '</button></div>';
    openModal({ title: p.name, color: p.color, gradient: p.gradient, colored: true, bodyHTML: body, footerHTML: footer,
      onOpen: function (root) { initAccordions(root); }, onClose: clearPackUrl });
  }
  /* modal content: pack "Buy Now" (Paragon Book Now) */
  function packBuy(p) {
    var body =
      '<div class="buy-layout">' +
        '<div class="buy-art">' + packArt(p, '220px', true) + '</div>' +
        '<div class="buy-details">' +
          priceRow(p) +
          '<p class="modal-description"><span class="highlight">' + esc(p.tagline) + '</span> ' + esc(p.description) + '</p>' +
          '<div class="modal-section"><h3 class="feature-header feature-header--color">What\'s Included</h3>' + featureList(p.features) + '</div>' +
          '<div class="modal-note">' + icon('download') + '<span>' + esc(MZ.delivery.text) + ' ' + esc(MZ.delivery.receive[2].text) + '.</span></div>' +
          (p.reviewCount ? '<div class="rating-summary">' + stars(Math.round(p.rating)) + '<span>' + p.rating.toFixed(2) + ' average from ' + p.reviewCount + ' verified reviews</span></div>' : '') +
          '<p class="cta-note">' + esc(MZ.delivery.refund) + ' Checkout is completed securely on miztweakz.com.</p>' +
        '</div>' +
      '</div>';
    var footer =
      '<button type="button" class="btn-clear" data-modal="pack-learn" data-pack="' + esc(p.handle) + '"><span>Learn More</span><span class="btn-clear__arrow">' + icon('arrow-right') + '</span></button>' +
      '<div class="nice-button-box" style="--color:' + p.color + '"><a class="nice-button btn-md' + (p.gradient ? ' gradient' : '') + '" href="' + p.url + '" target="_blank" rel="noopener noreferrer">Buy Now · ' + money(p.price) + ' ' + icon('external') + '<span class="sr-only">(opens miztweakz.com in a new tab)</span></a></div>';
    openModal({ title: p.name, color: p.color, gradient: p.gradient, colored: true, maxWidth: '900px', bodyHTML: body, footerHTML: footer, onClose: clearPackUrl });
  }

  /* ?pack=<handle> sync (only on /packs/, mirrors Paragon's /services/<Section>/<Service>) */
  function syncPackUrl(p) {
    if (doc.body.getAttribute('data-page') !== 'packs') return;
    var u = new URL(location.href);
    u.searchParams.set('pack', p.handle);
    history.replaceState(null, '', u.pathname + u.search + u.hash);
  }
  function clearPackUrl() {
    if (doc.body.getAttribute('data-page') !== 'packs') return;
    var u = new URL(location.href);
    if (!u.searchParams.has('pack')) return;
    u.searchParams.delete('pack');
    history.replaceState(null, '', u.pathname + (u.search || '') + u.hash);
  }
  function openPackModal(type, handle) {
    var p = H.pack ? H.pack(handle) : null;
    if (!p) return false;
    (type === 'pack-learn' ? packLearn : packBuy)(p);
    syncPackUrl(p);
    return true;
  }

  /* ---------- 9. cookie consent ---------- */
  var CONSENT_KEY = 'mz-consent';
  var consent = {
    state: null,
    get: function () { return consent.state; },
    read: function () {
      try { var v = JSON.parse(localStorage.getItem(CONSENT_KEY)); return v && typeof v === 'object' ? v : null; } catch (e) { return null; }
    },
    save: function (c) {
      var v = { necessary: true, functional: !!c.functional, advertisement: !!c.advertisement, ts: Date.now() };
      try { localStorage.setItem(CONSENT_KEY, JSON.stringify(v)); } catch (e) { /* storage blocked. Keep in memory */ }
      consent.state = v;
      var notice = qs('.pt-notice'), revisit = qs('.pt-prefs-revisit');
      if (notice) notice.hidden = true;
      if (revisit) revisit.hidden = false;
      doc.dispatchEvent(new CustomEvent('mz:consent', { detail: v }));
      return v;
    }
  };
  function renderNotice() {
    if (qs('.pt-notice')) return;
    var notice = el(
      '<aside class="pt-notice glass-card" aria-label="Cookie consent" hidden>' +
        '<h2>We value your privacy</h2>' +
        '<p>We use necessary cookies to make this site work. With your consent, we use optional cookies for enhanced features and advertising conversion measurement.</p>' +
        '<div class="pt-notice-actions">' +
          '<button type="button" class="nice-button grey btn-md" data-consent="customise">Customise</button>' +
          '<button type="button" class="nice-button grey btn-md" data-consent="reject">Reject All</button>' +
          '<button type="button" class="nice-button btn-md" data-consent="accept">Accept All</button>' +
        '</div>' +
      '</aside>');
    var revisit = el('<button type="button" class="pt-prefs-revisit" aria-label="Cookie preferences" data-modal="cookie-prefs" hidden>' + icon('shield-half') + '</button>');
    doc.body.appendChild(notice);
    doc.body.appendChild(revisit);
    notice.addEventListener('click', function (e) {
      var b = e.target.closest('[data-consent]');
      if (!b) return;
      var a = b.getAttribute('data-consent');
      if (a === 'accept') consent.save({ functional: true, advertisement: true });
      else if (a === 'reject') consent.save({});
      else prefsModal();
    });
    consent.state = consent.read();
    if (consent.state) revisit.hidden = false; else notice.hidden = false;
  }
  function prefsGroup(id, title, desc, always, on) {
    return '<div class="pt-prefs-group"><div class="pt-prefs-head"><h3>' + title + '</h3>' +
      (always ? '<span class="pt-prefs-always">Always Active</span>'
        : '<label class="pt-switch"><input type="checkbox" name="' + id + '"' + (on ? ' checked' : '') + ' aria-label="Enable ' + title.toLowerCase() + ' cookies"><span class="pt-prefs-slider"></span></label>') +
      '</div><p class="pt-prefs-desc">' + desc + '</p></div>';
  }
  function prefsModal() {
    var c = consent.state || {};
    openModal({
      title: 'Customise Consent Preferences', maxWidth: '720px',
      bodyHTML:
        '<p class="pt-prefs-intro">Choose which optional cookies this site may use. Necessary cookies keep the site working and cannot be switched off. You can change your mind at any time from the shield button or the footer.</p>' +
        prefsGroup('necessary', 'Necessary', 'Required for core functionality such as remembering your cookie choices and your open cart. Stored in first-party storage only.', true) +
        prefsGroup('functional', 'Functional', 'Enables embedded YouTube videos (loaded from youtube-nocookie.com) and remembers preferences like dismissed announcements.', false, c.functional) +
        prefsGroup('advertisement', 'Advertisement', 'Allows ad-conversion measurement pixels if we ever add them. Nothing loads unless this is on.', false, c.advertisement),
      footerHTML:
        '<button type="button" class="nice-button grey btn-sm" data-consent-modal="reject">Reject All</button>' +
        '<button type="button" class="nice-button grey btn-sm" data-consent-modal="save">Save My Preferences</button>' +
        '<button type="button" class="nice-button btn-sm" data-consent-modal="accept">Accept All</button>'
    });
  }

  /* ---------- 10. page transitions ---------- */
  function leaveTo(href) {
    if (reduceMotion.matches) { location.href = href; return; }
    doc.body.classList.add('is-leaving');
    setTimeout(function () { location.href = href; }, 220);
  }
  function initTransitions() {
    window.addEventListener('pageshow', function () { doc.body.classList.remove('is-leaving'); });
  }

  /* ---------- delegated clicks (modals, consent, transitions) ---------- */
  doc.addEventListener('click', function (e) {
    if (e.defaultPrevented) return;
    var trigger = e.target.closest('[data-modal]');
    if (trigger) {
      e.preventDefault();
      var type = trigger.getAttribute('data-modal');
      if (!modal.open && type !== 'close') modal.pendingOpener = trigger; // so closeModal() can return focus to the real trigger
      if (type === 'pack-buy' || type === 'pack-learn') openPackModal(type, trigger.getAttribute('data-pack'));
      else if (type === 'cookie-prefs') prefsModal();
      else if (type === 'close') closeModal();
      modal.pendingOpener = null;
      return;
    }
    var cm = e.target.closest('[data-consent-modal]');
    if (cm) {
      var action = cm.getAttribute('data-consent-modal');
      if (action === 'accept') consent.save({ functional: true, advertisement: true });
      else if (action === 'reject') consent.save({});
      else {
        var fn = qs('#mz-modal input[name="functional"]'), ad = qs('#mz-modal input[name="advertisement"]');
        consent.save({ functional: fn && fn.checked, advertisement: ad && ad.checked });
      }
      closeModal();
      return;
    }
    /* Download buttons hand off to the install guide. The href is a .exe, so the
       browser downloads it without navigating and we can send the visitor on once
       it has started. No preventDefault here, or the download never begins.
       [data-no-guide] opts out, which the guide page uses on its own button. */
    var dlLink = e.target.closest('a[href]');
    var dlHref = dlLink ? (dlLink.getAttribute('href') || '').toLowerCase() : '';
    if (dlLink && dlHref.indexOf('.exe') > -1 && !dlLink.hasAttribute('data-no-guide')) {
      setTimeout(function () { leaveTo('/pages/install'); }, 900);
      return;
    }

    var a = e.target.closest('a[href]');
    if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((a.target && a.target !== '_self') || a.hasAttribute('download') || a.hasAttribute('data-no-transition')) return;
    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin || /^(mailto|tel):/i.test(a.getAttribute('href') || '')) return;
    var samePage = url.pathname === location.pathname && url.search === location.search;
    if (samePage && url.hash) return;                                  // in-page anchor: let the browser scroll
    if (samePage) { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' }); return; }
    e.preventDefault();
    leaveTo(url.href);
  });

  /* ---------- 11. deep link ---------- */
  function deepLink() {
    var handle = new URLSearchParams(location.search).get('pack');
    if (handle) openPackModal('pack-buy', handle);
  }

  /* ---------- boot ---------- */
  function init() {
    initNav(doc);            // header + footer are rendered by Liquid (sections/header.liquid, sections/footer.liquid)
    try { greenFree(); } catch (e) { /* cosmetic */ }
    /* greenFree-rerun: page scripts may rebuild labels after init */
    window.addEventListener('load', function () { try { greenFree(); } catch (e) {} });
    setTimeout(function () { try { greenFree(); } catch (e) {} }, 1200);
    renderPackGrids();
    renderTestimonials();
    renderFaqs();
    initBrandsMarquee();
    hydrateIcons(doc);
    initAccordions(doc);
    initMount();
    initReveal();
    // renderNotice(); // Shopify serves its own cookie banner on this store, so the theme does not add a second one.
    initTransitions();
    deepLink();
  }

  MZ.ui = {
    icon: icon,
    hydrateIcons: hydrateIcons,
    openModal: openModal,
    closeModal: closeModal,
    openPackModal: openPackModal,
    packCard: packCard,
    packArt: packArt,
    reviewCard: reviewCard,
    stars: stars,
    faqItem: faqItem,
    priceRow: priceRow,
    featureList: featureList,
    renderPackGrids: renderPackGrids,
    renderTestimonials: renderTestimonials,
    renderFaqs: renderFaqs,
    initAccordions: initAccordions,
    refreshReveal: initReveal,
    consent: consent,
    esc: esc
  };

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();
})();
