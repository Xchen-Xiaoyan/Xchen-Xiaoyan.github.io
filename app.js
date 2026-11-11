(function () {
  'use strict';
  var D = window.PORTFOLIO, IC = window.ICONS;
  var exps = D.experiences.slice().sort(function (a, b) { return a.sortKey < b.sortKey ? -1 : 1; });
  var byId = {}; exps.forEach(function (e, i) { e.n = i + 1; byId[e.id] = e; });

  var $ = function (id) { return document.getElementById(id); };
  var mqMobile = window.matchMedia('(max-width: 759px)');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  var lang = 'zh';
  var current = null;       // 当前打开的经历 id
  var lastPlace = null;     // 关闭后焦点回到这里
  var tourIndex = 0;

  function t(o) { if (o == null) return ''; if (typeof o === 'string') return o; return o[lang] != null ? o[lang] : o.zh; }
  function ui() { return D.ui[lang]; }
  function list(o) { var v = t(o); return Array.isArray(v) ? v : []; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(m) { return m.replace('-', '.'); }
  function dateLabel(e) { return e.date ? t(e.date) : fmt(e.start) + ' – ' + fmt(e.end); }
  function dateShort(e) { return e.date ? t(e.date) : fmt(e.start) + '–' + e.end.slice(5); }

  /* ---------- 地图背景与道路 ---------- */
  function smoothPath(pts) {
    var d = 'M' + pts[0][0] + ' ' + pts[0][1];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      var c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      var c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ' C' + c1.map(Math.round).join(' ') + ',' + c2.map(Math.round).join(' ') + ',' + p2.join(' ');
    }
    return d;
  }
  function roadSvg(d) {
    return '<path d="' + d + '" fill="none" stroke="#2b2a33" stroke-width="17" stroke-linecap="round" vector-effect="non-scaling-stroke"/>' +
      '<path d="' + d + '" fill="none" stroke="#f1deb0" stroke-width="11" stroke-linecap="round" vector-effect="non-scaling-stroke"/>' +
      '<path d="' + d + '" fill="none" stroke="#fffaf0" stroke-width="2" stroke-dasharray="9 9" stroke-linecap="round" vector-effect="non-scaling-stroke"/>';
  }
  function bgDesktop() {
    var pts = exps.map(function (e) { return [e.pos.x * 12, e.pos.y * 7]; });
    return '<svg class="map-bg desktop" viewBox="0 0 1200 700" preserveAspectRatio="none" aria-hidden="true">' +
      '<rect width="1200" height="700" fill="#f6efdb"/>' +
      '<g filter="url(#rough)">' +
      '<path d="M0 470 C150 430 260 520 380 560 S560 640 700 610 S900 520 1010 560 S1160 640 1200 600 L1200 700 L0 700 Z" fill="#dde7c6" stroke="#2b2a33" stroke-width="2.5" stroke-dasharray="2 9" stroke-linecap="round"/>' +
      '<path d="M1200 90 C1120 130 1050 100 990 150 S880 120 820 70 S740 20 700 0 L1200 0 Z" fill="#cddcb0" stroke="#2b2a33" stroke-width="2.5" stroke-dasharray="2 9" stroke-linecap="round"/>' +
      '<path d="M0 0 L360 0 C340 70 250 110 160 100 S40 150 0 200 Z" fill="#e6edcf"/>' +
      '<ellipse cx="1085" cy="628" rx="92" ry="36" fill="#cfe3e6" stroke="#2b2a33" stroke-width="3"/>' +
      '<path d="M1040 626 q12 -8 24 0 t24 0 M1075 640 q10 -6 20 0 t20 0" fill="none" stroke="#2b2a33" stroke-width="2" stroke-linecap="round"/>' +
      roadSvg(smoothPath(pts)) +
      '</g></svg>';
  }
  function bgMobile() {
    var pts = exps.map(function (e) { return [e.mpos.x, e.mpos.y]; });
    return '<svg class="map-bg mobile" viewBox="0 0 100 1660" preserveAspectRatio="none" aria-hidden="true">' +
      '<rect width="100" height="1660" fill="#f6efdb"/>' +
      '<path d="M0 360 C30 330 60 380 100 350 L100 620 C60 650 30 600 0 640 Z" fill="#dde7c6"/>' +
      '<path d="M0 860 C40 820 70 880 100 840 L100 1130 C60 1160 30 1110 0 1150 Z" fill="#dde7c6"/>' +
      '<path d="M0 1380 C30 1350 70 1400 100 1360 L100 1660 L0 1660 Z" fill="#dde7c6"/>' +
      roadSvg(smoothPath(pts)) +
      '</svg>';
  }

  /* ---------- 地图 ---------- */
  function renderMap() {
    var T = ui(), html = bgDesktop() + bgMobile();
    D.decor.forEach(function (d, i) {
      var svg = d.t === 'sign' ? IC.sign(T[d.text]) : IC.decor[d.t];
      var m = d.m;
      html += '<div class="decor ' + d.t + (i % 2 ? ' c2' : '') + (m ? '' : ' no-m') + '" style="--x:' + d.x + '%;--y:' + d.y + '%;--w:' + d.w + '%;' +
        (m ? '--mx:' + m.x + '%;--my:' + m.y + 'px;--mw:' + m.w + 'px;' : '') + '">' + svg + '</div>';
    });
    html += '<ol class="places" aria-label="' + esc(T.mapLabel) + '">';
    exps.forEach(function (e) {
      html += '<li class="place-wrap" style="--x:' + e.pos.x + '%;--y:' + e.pos.y + '%;--mx:' + e.mpos.x + '%;--my:' + e.mpos.y + 'px">' +
        '<button type="button" class="place' + (current === e.id ? ' is-selected' : '') + '" data-id="' + e.id + '" aria-haspopup="dialog" aria-describedby="bub-' + e.id + '">' +
        '<span class="bubble" id="bub-' + e.id + '" role="tooltip">' + esc(t(e.preview)) + '</span>' +
        '<svg class="flag" viewBox="0 0 22 26" aria-hidden="true"><path d="M4 24 V3" stroke="#2b2a33" stroke-width="2.5" stroke-linecap="round"/><path d="M4 3 L20 8 L4 14 Z" fill="#e8833a" stroke="#2b2a33" stroke-width="2.2" stroke-linejoin="round"/></svg>' +
        '<span class="building">' + IC.places[e.icon] + '</span>' +
        '<span class="tag"><span class="num" aria-hidden="true">' + e.n + '</span><b>' + esc(t(e.mapName)) + '</b><i>' + esc(t(e.kind)) + ' · ' + esc(dateShort(e)) + '</i></span>' +
        '<span class="peek">' + esc(t(e.preview)) + '</span>' +
        '</button></li>';
    });
    html += '</ol>';
    $('map').innerHTML = html;
  }

  /* ---------- 静态文案 ---------- */
  function renderStatic() {
    var T = ui(), P = D.profile;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = T.siteTitle;
    $('brand').textContent = T.siteTitle;
    $('nav-all').textContent = T.all; $('nav-contact').textContent = T.contact;
    var lb = $('lang'); lb.textContent = T.switchTo; lb.setAttribute('aria-label', T.switchLabel); lb.setAttribute('lang', lang === 'zh' ? 'en' : 'zh-CN');
    $('skip').textContent = lang === 'zh' ? '跳到地图' : 'Skip to map';
    $('kicker').textContent = T.kicker;
    $('map-title').innerHTML = esc(t(P.name)) + (lang === 'zh' ? ' <span class="en-name">Xiaoyan Chen</span>' : '');
    $('lede').textContent = t(P.intro);
    $('hint').textContent = T.hint;
    $('btn-start').textContent = T.start; $('btn-all').textContent = T.all; $('btn-contact').textContent = T.contact;
    $('contact-title').textContent = T.contactTitle; $('contact-text').textContent = T.contactText;
    $('contact-links').innerHTML =
      '<li><a href="mailto:' + P.email + '">' + T.email + '<small>' + P.email + '</small></a></li>' +
      '<li><a href="' + P.github + '" target="_blank" rel="noopener">' + T.github + '</a></li>' +
      (P.oldSite ? '<li><a href="' + P.oldSite + '" target="_blank" rel="noopener">' + T.oldSite + '</a></li>' : '');
    $('foot').textContent = T.footer;
    $('prev').innerHTML = '‹ <span>' + T.prev + '</span>'; $('prev').setAttribute('aria-label', T.prev);
    $('next').innerHTML = '<span>' + T.next + '</span> ›'; $('next').setAttribute('aria-label', T.next);
    $('close').textContent = '×'; $('close').setAttribute('aria-label', T.close);
    $('log-title').textContent = T.logTitle; $('log-hint').textContent = T.logHint;
    $('log-close').textContent = '×'; $('log-close').setAttribute('aria-label', T.logClose);
    $('log-list').innerHTML = exps.map(function (e) {
      return '<li><button type="button" class="log-item" data-id="' + e.id + '" data-n="' + e.n + '">' +
        '<span class="d">' + esc(dateLabel(e)) + '</span><span class="n">' + esc(t(e.name)) + '</span><span class="r">' + esc(t(e.role)) + '</span></button></li>';
    }).join('');
  }

  /* ---------- 详情面板 ---------- */
  function section(key, num, items, extra) {
    return '<section class="sec"><h3><span>' + num + '</span>' + esc(ui().sec[key]) + '</h3>' +
      (items.length ? '<ul>' + items.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' : '') + (extra || '') + '</section>';
  }
  function tourHtml(e) {
    if (!e.tour) return '';
    return '<div class="tour"><h4>' + esc(t(e.tour.title)) + '</h4>' +
      '<div class="tabs" role="tablist" aria-label="' + esc(ui().tourLabel) + '">' +
      e.tour.steps.map(function (s, i) {
        return '<button type="button" role="tab" class="tab" id="tab-' + i + '" aria-controls="tour-body" aria-selected="' + (i === tourIndex) + '" tabindex="' + (i === tourIndex ? 0 : -1) + '" data-i="' + i + '">' + esc(t(s.tab)) + '</button>';
      }).join('') + '</div><div class="tour-body" id="tour-body" role="tabpanel" aria-labelledby="tab-' + tourIndex + '">' + tourBody(e) + '</div></div>';
  }
  function tourBody(e) {
    var s = e.tour.steps[tourIndex];
    return '<p class="tour-q">' + esc(t(s.q)) + '</p><p class="tour-a">' + esc(t(s.a)) + '</p><img src="' + esc(s.img) + '" alt="' + esc(t(s.alt)) + '" loading="lazy">';
  }
  function renderPanel() {
    var e = byId[current]; if (!e) return;
    var T = ui();
    var links = (e.links || []).filter(function (l) { return l.url; });
    var tags = (e.tags || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') +
      list(e.pending).map(function (s) { return '<li class="pend">' + esc(T.pending) + ':' + esc(s.replace(/待补|TBD/g, '').trim() || s) + '</li>'; }).join('');
    var shots = (e.images || []).map(function (im) {
      return '<figure class="shot"><img src="' + esc(im.src) + '" alt="' + esc(t(im.alt)) + '" loading="lazy"><figcaption>' + esc(t(im.alt)) + '</figcaption></figure>';
    }).join('');
    $('panel-body').innerHTML =
      '<p class="p-kicker">' + e.n + ' · ' + esc(t(e.kind)) + ' · ' + esc(dateLabel(e)) + '</p>' +
      '<h2 id="panel-title" tabindex="-1">' + esc(t(e.name)) + '</h2>' +
      '<p class="p-meta"><b>' + esc(t(e.role)) + '</b>' + esc(e.org) + '</p>' +
      section('background', 1, list(e.background)) + section('mine', 2, list(e.mine)) + section('how', 3, list(e.how)) +
      section('result', 4, list(e.result), tourHtml(e) + shots) +
      (links.length ? '<div class="p-links">' + links.map(function (l) { return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(t(l.label)) + ' ↗</a>'; }).join('') + '</div>' : '') +
      (tags ? '<ul class="chips" aria-label="' + esc(T.tags) + '">' + tags + '</ul>' : '');
    $('count').textContent = e.n + ' ' + T.of + ' ' + exps.length;
  }

  var panel = $('panel'), scrim = $('scrim');
  function setSelected() {
    document.querySelectorAll('.place').forEach(function (b) { b.classList.toggle('is-selected', b.getAttribute('data-id') === current); });
  }
  function placeBtn(id) { return document.querySelector('.place[data-id="' + id + '"]'); }

  function shiftMap() {
    var shell = $('map-shell');
    if (mqMobile.matches || !current) { shell.style.transform = ''; return; }
    shell.style.transform = '';
    var b = placeBtn(current); if (!b) return;
    var r = b.getBoundingClientRect(), pw = Math.min(440, window.innerWidth);
    var limit = window.innerWidth - pw - 24;
    var over = r.right + 16 - limit;
    if (over > 0) shell.style.transform = 'translateX(' + (-Math.min(over, window.innerWidth * 0.45)) + 'px)';
  }

  function openExp(id, opts) {
    opts = opts || {};
    if (!byId[id]) return;
    var wasOpen = panel.classList.contains('open');
    current = id; tourIndex = 0;
    if (!wasOpen || opts.trigger) lastPlace = opts.trigger || placeBtn(id);
    if (wasOpen && !opts.trigger) lastPlace = placeBtn(id);
    renderPanel(); setSelected();
    panel.removeAttribute('inert'); panel.classList.add('open');
    var mobile = mqMobile.matches;
    panel.setAttribute('aria-modal', mobile ? 'true' : 'false');
    scrim.hidden = !mobile; document.body.classList.toggle('sheet-open', mobile);
    document.body.classList.add('reading');
    shiftMap();
    $('panel-body').scrollTop = 0;
    try { history.replaceState(null, '', '#' + id); } catch (e) {}
    $('live').textContent = ui().opened + t(byId[id].name);
    if (opts.keepFocus) return;
    var h = $('panel-title');
    setTimeout(function () { h && h.focus({ preventScroll: true }); }, 30);
  }

  function closePanel(returnFocus) {
    if (!panel.classList.contains('open')) return;
    var id = current;
    panel.classList.remove('open'); panel.setAttribute('inert', '');
    scrim.hidden = true; document.body.classList.remove('sheet-open', 'reading');
    $('map-shell').style.transform = '';
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    // 关闭后保留“当前选中”标记,并把焦点放回原来的地点
    var b = lastPlace && document.contains(lastPlace) ? lastPlace : placeBtn(id);
    if (returnFocus !== false && b) b.focus();
  }

  function step(delta) {
    var i = exps.findIndex(function (e) { return e.id === current; });
    var next = exps[(i + delta + exps.length) % exps.length];
    var focusId = document.activeElement && document.activeElement.id;
    openExp(next.id, { keepFocus: true });
    $('panel-body').scrollTop = 0;
    if (focusId === 'prev' || focusId === 'next') $(focusId).focus();
  }

  /* ---------- 小互动:看板巡览 ---------- */
  function setTour(i, focus) {
    var e = byId[current]; if (!e || !e.tour) return;
    var n = e.tour.steps.length; tourIndex = (i + n) % n;
    document.querySelectorAll('.tab').forEach(function (b, k) {
      var on = k === tourIndex; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    });
    var body = $('tour-body'); body.setAttribute('aria-labelledby', 'tab-' + tourIndex);
    body.innerHTML = tourBody(e); body.classList.remove('swap'); void body.offsetWidth; body.classList.add('swap');
  }

  /* ---------- 全部经历 ---------- */
  var log = $('log');
  function openLog() { if (typeof log.showModal === 'function') log.showModal(); else log.setAttribute('open', ''); }
  function closeLog() { if (log.open) log.close(); }

  /* ---------- 事件 ---------- */
  function scrollToEl(el) { el.scrollIntoView({ behavior: mqReduce.matches ? 'auto' : 'smooth', block: 'start' }); }

  document.addEventListener('click', function (ev) {
    var pl = ev.target.closest('.place');
    if (pl) { openExp(pl.getAttribute('data-id'), { trigger: pl }); return; }
    var li = ev.target.closest('.log-item');
    if (li) {
      var id = li.getAttribute('data-id'); closeLog();
      var b = placeBtn(id);
      if (!mqMobile.matches && b) b.scrollIntoView({ block: 'nearest' });
      openExp(id, { trigger: b }); return;
    }
    var tab = ev.target.closest('.tab');
    if (tab) { setTour(+tab.getAttribute('data-i'), false); return; }
    if (ev.target === scrim) closePanel();
  });
  document.addEventListener('keydown', function (ev) {
    var tab = ev.target.closest && ev.target.closest('.tab');
    if (tab && (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft' || ev.key === 'Home' || ev.key === 'End')) {
      ev.preventDefault();
      var i = +tab.getAttribute('data-i'), n = byId[current].tour.steps.length;
      setTour(ev.key === 'Home' ? 0 : ev.key === 'End' ? n - 1 : i + (ev.key === 'ArrowRight' ? 1 : -1), true); return;
    }
    if (ev.key === 'Escape' && panel.classList.contains('open') && !log.open) { ev.preventDefault(); closePanel(); return; }
    if (ev.key === 'Tab' && panel.classList.contains('open') && mqMobile.matches) {
      var f = panel.querySelectorAll('button, a[href], [tabindex="0"]');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (!panel.contains(document.activeElement)) { ev.preventDefault(); first.focus(); }
      else if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
      else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
    }
  });
  $('close').addEventListener('click', function () { closePanel(); });
  $('prev').addEventListener('click', function () { step(-1); });
  $('next').addEventListener('click', function () { step(1); });
  $('log-close').addEventListener('click', closeLog);
  log.addEventListener('click', function (ev) { if (ev.target === log) closeLog(); });
  ['nav-all', 'btn-all'].forEach(function (id) { $(id).addEventListener('click', openLog); });
  ['nav-contact', 'btn-contact'].forEach(function (id) {
    $(id).addEventListener('click', function () { var c = $('contact'); scrollToEl(c); c.focus({ preventScroll: true }); });
  });
  $('btn-start').addEventListener('click', function () {
    var first = exps[0], b = placeBtn(first.id);
    scrollToEl($('hero'));
    openExp(first.id, { trigger: $('btn-start') });
    lastPlace = b;
  });
  $('skip').addEventListener('click', function (ev) { ev.preventDefault(); scrollToEl($('hero')); $('map-title').focus({ preventScroll: true }); });
  $('lang').addEventListener('click', function () {
    lang = lang === 'zh' ? 'en' : 'zh';
    try { localStorage.setItem('lang', lang); } catch (e) {}
    var had = document.activeElement && document.activeElement.getAttribute && document.activeElement.getAttribute('data-id');
    renderStatic(); renderMap(); if (current) { renderPanel(); setSelected(); shiftMap(); }
    if (had) { var b = placeBtn(had); b && b.focus(); }
  });
  window.addEventListener('resize', function () {
    if (!current || !panel.classList.contains('open')) return;
    var mobile = mqMobile.matches;
    panel.setAttribute('aria-modal', mobile ? 'true' : 'false');
    scrim.hidden = !mobile; document.body.classList.toggle('sheet-open', mobile); shiftMap();
  });

  /* ---------- 初始化 ---------- */
  try { var saved = localStorage.getItem('lang'); lang = saved === 'en' || saved === 'zh' ? saved : 'zh'; } catch (e) { lang = 'zh'; }
  renderStatic(); renderMap();
  var h = location.hash.replace('#', '');
  if (byId[h]) openExp(h, { keepFocus: true });
})();
