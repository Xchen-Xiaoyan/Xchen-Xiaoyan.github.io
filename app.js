(function () {
  'use strict';
  var D = window.PORTFOLIO, IC = window.ICONS;
  var $ = function (id) { return document.getElementById(id); };
  var mqMobile = window.matchMedia('(max-width: 759px)');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  var lang = 'zh';
  var exps = [], byId = {}, districts = [], byDist = {};
  var g = null;                           // 几何:街区位置、项目位置、道路
  var cam = { x: 0, y: 0, z: 1 }, VW = 0, VH = 0, z0 = 1, zmax = 3;
  var focus = undefined;                  // 当前聚焦的街区 id(null = 全景)
  var current = null, lastTrigger = null, restoreCam = null, tourIndex = 0, listOpen = true;
  var animT = 0, suppressClick = false, padTop = 0;

  /* ================= 工具 ================= */
  function t(o) { if (o == null) return ''; if (typeof o === 'string') return o; return o[lang] != null ? o[lang] : o.zh; }
  function ui() { return D.ui[lang]; }
  function list(o) { var v = t(o); return Array.isArray(v) ? v : []; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(m) { return m.replace('-', '.'); }
  function dateLabel(e) { return e.date ? t(e.date) : fmt(e.start) + ' – ' + fmt(e.end); }
  function dateShort(e) { return e.date ? t(e.date) : fmt(e.start) + '–' + e.end.slice(5); }
  function projCount(n) { return lang === 'en' ? n + (n === 1 ? ' project' : ' projects') : ui().projCount.replace('{n}', n); }
  function shortName(e) { return t(e.short || e.mapName || e.name); }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var x = Math.imul(seed ^ seed >>> 15, 1 | seed); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; }; }

  /* ================= 数据模型 ================= */
  function buildModel() {
    exps = D.experiences.slice().sort(function (a, b) {
      var ka = a.sortKey || a.start || '9999', kb = b.sortKey || b.start || '9999'; return ka < kb ? -1 : ka > kb ? 1 : 0;
    });
    byId = {}; byDist = {};
    var all = D.districts.map(function (d) { return Object.assign({}, d); });
    all.forEach(function (d) { byDist[d.id] = d; });
    exps.forEach(function (e, i) {
      e.n = i + 1; byId[e.id] = e;
      if (!byDist[e.district]) {                       // 没写街区或写错了:放进“其他”
        e.district = 'other';
        if (!byDist.other) { byDist.other = { id: 'other', icon: 'archive', name: { zh: '其他', en: 'Other' }, blurb: { zh: '尚未分类的经历', en: 'Not yet categorised' } }; all.push(byDist.other); }
      }
    });
    all.forEach(function (d) { d.items = exps.filter(function (e) { return e.district === d.id; }); });
    districts = all.filter(function (d) { return d.items.length > 0; });
  }

  /* ================= 自动布局 ================= */
  function smoothPath(pts) {
    var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      var c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ' C' + c1[0].toFixed(1) + ' ' + c1[1].toFixed(1) + ',' + c2[0].toFixed(1) + ' ' + c2[1].toFixed(1) + ',' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d;
  }
  function gatePoint(z, P) {
    var dx = P.x - z.cx, dy = P.y - z.cy;
    var sx = dx ? (z.w / 2) / Math.abs(dx) : Infinity, sy = dy ? (z.h / 2) / Math.abs(dy) : Infinity, s = Math.min(sx, sy, 1);
    return { x: z.cx + dx * s, y: z.cy + dy * s };
  }
  function layoutItems(z) {
    var items = z.d.items, n = items.length, iw = z.w - 32, ih = z.h - 70, best = null;
    for (var c = 1; c <= n; c++) {
      var r = Math.ceil(n / c), cw = iw / c, ch = ih / r, bw = Math.min(cw * 0.84, ch * 0.76 / 0.786, 104);
      if (!best || bw > best.bw + 0.01) best = { c: c, r: r, bw: bw, cw: cw, ch: ch };
    }
    var bw2 = Math.max(best.bw, 26), bh = bw2 * 0.786, pts = [];
    items.forEach(function (e, i) {
      var row = Math.floor(i / best.c), col = i % best.c, inRow = Math.min(best.c, n - row * best.c);
      var off = (best.c - inRow) * best.cw / 2;
      e.px = z.x + 16 + off + best.cw * (col + 0.5);
      e.py = z.y + 36 + best.ch * (row + 0.5) + bh / 2;
      e.bw = bw2; e.row = row; e.col = col;
    });
    // 道路顺着“蛇形”顺序穿过所有项目门口
    var order = items.slice().sort(function (a, b) { return a.row - b.row || (a.row % 2 ? b.col - a.col : a.col - b.col); });
    order.forEach(function (e) { pts.push([e.px, e.py + 5]); });
    z.road = pts;
  }
  function buildGeometry() {
    var mob = mqMobile.matches, n = districts.length, zones = [], CW, CH, plaza;
    g = { mob: mob };
    if (!mob) {
      CW = 1200; CH = 700;
      var S = [[215, 410], [555, 195], [905, 215], [880, 525], [535, 540], [210, 130]];
      districts.forEach(function (d, i) {
        var p = n <= 6 ? S[i] : [200 + (i % 3) * 400, 170 + Math.floor(i / 3) * 290];
        zones.push({ d: d, cx: p[0], cy: p[1], w: 330, h: 240 });
      });
      if (n > 6) CH = Math.max(700, Math.ceil(n / 3) * 290 + 80);
      plaza = { x: 610, y: n > 6 ? CH / 2 : 365 };
      g.river = { cx: 1130, amp: 14, per: 80, hw: 34 };
    } else {
      CW = 760;
      districts.forEach(function (d, i) { zones.push({ d: d, cx: i % 2 ? 555 : 195, cy: 175 + i * 250, w: 330, h: 255 }); });
      CH = Math.max(700, 175 + (n - 1) * 250 + 175);
      plaza = { x: 380, y: CH / 2 };
      g.river = { cx: 748, amp: 8, per: 70, hw: 20 };
    }
    zones.forEach(function (z) { z.x = z.cx - z.w / 2; z.y = z.cy - z.h / 2; z.gate = gatePoint(z, plaza); layoutItems(z); });
    g.zones = zones; g.CW = CW; g.CH = CH; g.plaza = plaza; g.zoneOf = {};
    zones.forEach(function (z) { g.zoneOf[z.d.id] = z; });
  }
  function riverX(y) { var r = g.river; return r.cx + r.amp * Math.sin(y / r.per); }

  /* ================= 地形(SVG) ================= */
  function terrain() {
    var X0 = -800, Y0 = -500, TW = g.CW + 1600, TH = g.CH + 1000, r = rng(5), s = '';
    s += '<svg class="terrain" style="left:' + X0 + 'px;top:' + Y0 + 'px;width:' + TW + 'px;height:' + TH + 'px" viewBox="' + [X0, Y0, TW, TH].join(' ') + '" aria-hidden="true">';
    s += '<rect x="' + X0 + '" y="' + Y0 + '" width="' + TW + '" height="' + TH + '" fill="#f5eedb"/>';
    s += '<g filter="url(#rough)">';
    // 草坡:先画偏移的深色底,再画浅色面,光源在左上
    var fills = ['#dde8d2', '#d3e1c8', '#e4ecd8'], i, cx, cy, rx, ry;
    for (i = 0; i < 26; i++) {
      cx = X0 + 300 + r() * (TW - 600); cy = Y0 + 200 + r() * (TH - 400); rx = 130 + r() * 190; ry = 70 + r() * 110;
      s += '<ellipse cx="' + (cx + 9) + '" cy="' + (cy + 11) + '" rx="' + rx + '" ry="' + ry + '" fill="#c7d8bc"/><ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + fills[i % 3] + '"/>';
    }
    // 河流 + 池塘
    var pts = [], y; for (y = -420; y <= g.CH + 420; y += 60) pts.push([riverX(y), y]);
    var rp = smoothPath(pts), hw = g.river.hw;
    s += '<path d="' + rp + '" fill="none" stroke="#8fb0bd" stroke-width="' + (hw * 2 + 9) + '" stroke-linecap="round"/><path d="' + rp + '" fill="none" stroke="#bcd5de" stroke-width="' + (hw * 2) + '" stroke-linecap="round"/>' +
      '<path d="' + rp + '" fill="none" stroke="#fff" stroke-opacity=".65" stroke-width="2" stroke-dasharray="14 22" stroke-linecap="round" transform="translate(-8 0)"/>';
    if (!g.mob) s += '<ellipse cx="108" cy="640" rx="92" ry="38" fill="#8fb0bd"/><ellipse cx="104" cy="636" rx="88" ry="34" fill="#bcd5de"/><path d="M60 634 q12 -7 24 0 t24 0 M96 648 q10 -6 20 0 t20 0" fill="none" stroke="#fff" stroke-width="2" opacity=".8" stroke-linecap="round"/>';
    // 街区地块
    var tints = ['#fbf6e6', '#f1f4e6', '#eef3f1', '#f7f0e0'];
    g.zones.forEach(function (z, k) {
      s += '<rect x="' + (z.x + 7) + '" y="' + (z.y + 9) + '" width="' + z.w + '" height="' + z.h + '" rx="30" fill="rgba(61,58,71,.10)"/>' +
        '<rect x="' + z.x + '" y="' + z.y + '" width="' + z.w + '" height="' + z.h + '" rx="30" fill="' + tints[k % 4] + '" stroke="#3d3a47" stroke-opacity=".38" stroke-width="2" stroke-dasharray="7 8"/>';
    });
    // 主路:广场 → 各街区入口
    var P = g.plaza, road = function (d, w) {
      return '<path d="' + d + '" fill="none" stroke="#cdbd96" stroke-width="' + (w + 5) + '" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="#f2e5c0" stroke-width="' + w + '" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="#fffaf0" stroke-opacity=".9" stroke-width="1.6" stroke-dasharray="8 9" stroke-linecap="round"/>';
    };
    g.zones.forEach(function (z, k) {
      var G = z.gate, mx = (P.x + G.x) / 2, my = (P.y + G.y) / 2, dx = G.x - P.x, dy = G.y - P.y, L = Math.hypot(dx, dy) || 1, off = (k % 2 ? 1 : -1) * Math.min(46, L * 0.18);
      s += road('M' + P.x + ' ' + P.y + ' Q' + (mx - dy / L * off) + ' ' + (my + dx / L * off) + ' ' + G.x + ' ' + G.y, 15);
      if (z.road.length) s += '<g class="inroad" data-d="' + z.d.id + '">' + road(smoothPath([[G.x, G.y]].concat(z.road)), 9) + '</g>';
    });
    // 桥:最靠近河的街区旁边
    var wz = g.zones.filter(function (z) { return z.d.icon === 'lab'; })[0] || g.zones.reduce(function (a, b) { return b.cx > a.cx ? b : a; }, g.zones[0]), by = wz.cy + (g.mob ? 20 : 10), bx = riverX(by);
    s += road('M' + (wz.x + wz.w) + ' ' + by + ' L' + (bx - hw - 16) + ' ' + by, 9);
    s += '<rect x="' + (bx - hw - 18) + '" y="' + (by - 12) + '" width="' + (hw * 2 + 36) + '" height="24" rx="5" fill="#e6d8b9" stroke="#3d3a47" stroke-width="2"/>' +
      '<path d="M' + (bx - hw - 8) + ' ' + (by - 12) + ' v24 M' + (bx - hw + 8) + ' ' + (by - 12) + ' v24 M' + (bx + hw - 8) + ' ' + (by - 12) + ' v24 M' + (bx + hw + 8) + ' ' + (by - 12) + ' v24" stroke="#3d3a47" stroke-opacity=".4" stroke-width="1.4" fill="none"/>';
    // 广场
    s += '<circle cx="' + (P.x + 5) + '" cy="' + (P.y + 7) + '" r="34" fill="rgba(61,58,71,.12)"/><circle cx="' + P.x + '" cy="' + P.y + '" r="34" fill="#f2e5c0" stroke="#3d3a47" stroke-width="2"/><circle cx="' + P.x + '" cy="' + P.y + '" r="15" fill="#bcd5de" stroke="#3d3a47" stroke-width="2"/><circle cx="' + P.x + '" cy="' + P.y + '" r="4" fill="#fff" stroke="#3d3a47" stroke-width="1.6"/>';
    s += '</g></svg>';
    return s;
  }

  /* 树丛、草丛、石头:程序生成,避开街区、道路、河流 */
  function decorHtml() {
    var r = rng(11), out = [], tries = 0, want = g.mob ? 90 : 72, P = g.plaza;
    function near(x, y) {
      var k, z;
      for (k = 0; k < g.zones.length; k++) {
        z = g.zones[k];
        if (x > z.x - 22 && x < z.x + z.w + 22 && y > z.y - 18 && y < z.y + z.h + 26) return true;
        var G = z.gate, ax = P.x, ay = P.y, bx = G.x, by = G.y, vx = bx - ax, vy = by - ay, L2 = vx * vx + vy * vy || 1;
        var tt = Math.max(0, Math.min(1, ((x - ax) * vx + (y - ay) * vy) / L2));
        if (Math.hypot(x - (ax + vx * tt), y - (ay + vy * tt)) < 34) return true;
      }
      if (Math.hypot(x - P.x, y - P.y) < 60) return true;
      if (Math.abs(x - riverX(y)) < g.river.hw + 34) return true;
      if (!g.mob && Math.hypot((x - 106) / 120, (y - 638) / 60) < 1) return true;
      return false;
    }
    while (out.length < want && tries++ < 2000) {
      var x = -140 + r() * (g.CW + 280), y = -60 + r() * (g.CH + 160);
      if (near(x, y)) continue;
      var q = r(), type = q < .42 ? 'tree' : q < .78 ? 'pine' : q < .95 ? 'bush' : 'rock', w = type === 'tree' ? 38 + r() * 16 : type === 'pine' ? 30 + r() * 14 : type === 'bush' ? 28 + r() * 14 : 16 + r() * 8;
      out.push({ x: x, y: y, w: w, t: type });
    }
    out.sort(function (a, b) { return a.y - b.y; });
    var html = out.map(function (d) { return '<div class="decor" style="left:' + d.x.toFixed(0) + 'px;top:' + d.y.toFixed(0) + 'px;width:' + d.w.toFixed(0) + 'px">' + IC.decor[d.t] + '</div>'; }).join('');
    [[0.12, -26, 130], [0.42, -8, 100], [0.7, -34, 120], [0.93, -12, 96]].forEach(function (c, i) {
      html += '<div class="decor cloud' + (i % 2 ? ' c2' : '') + '" style="left:' + (c[0] * g.CW) + 'px;top:' + c[1] + 'px;width:' + c[2] + 'px">' + IC.decor.cloud + '</div>';
    });
    return html;
  }

  /* ================= 渲染 ================= */
  function renderWorld() {
    var T = ui(), h = '', w = $('world');
    w.style.width = g.CW + 'px'; w.style.height = g.CH + 'px';
    h += terrain() + decorHtml();
    g.zones.forEach(function (z) {
      var d = z.d, lw = 190, name = t(d.name);
      h += '<button type="button" class="lm" data-d="' + d.id + '" style="left:' + z.cx + 'px;top:' + (z.cy + 62) + 'px;--lw:' + lw + 'px" aria-label="' + esc(name + ' · ' + projCount(d.items.length)) + '">' +
        '<span class="lm-b">' + (IC.landmarks[d.icon] || IC.landmarks.archive) + '</span>' +
        '<span class="lm-sign cs"><b>' + esc(name) + '</b><i>' + esc(projCount(d.items.length)) + '</i></span></button>';
      h += '<div class="dsign cs-l" data-d="' + d.id + '" style="left:' + (z.x + 14) + 'px;top:' + (z.y + 9) + 'px"><b>' + esc(name) + '</b></div>';
      d.items.forEach(function (e) {
        h += '<button type="button" class="proj' + (current === e.id ? ' is-selected' : '') + '" data-id="' + e.id + '" data-d="' + d.id + '" style="left:' + e.px.toFixed(1) + 'px;top:' + e.py.toFixed(1) + 'px;--bw:' + e.bw.toFixed(1) + 'px" aria-haspopup="dialog" aria-describedby="b-' + e.id + '" aria-label="' + esc(t(e.name)) + '">' +
          '<span class="bubble cs-b" id="b-' + e.id + '" role="tooltip"><i>' + esc(dateLabel(e)) + '</i>' + esc(t(e.preview)) + '</span>' +
          '<span class="bld">' + (IC.places[e.icon] || IC.places.house) + '</span><span class="ring"></span>' +
          '<span class="lab cs"><b>' + esc(shortName(e)) + '</b></span></button>';
      });
    });
    w.innerHTML = h;
    focus = undefined; applyCamera(); syncFocus(true);
  }

  function renderChrome() {
    var T = ui(), P = D.profile;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = T.siteTitle;
    var lb = $('lang'); lb.textContent = T.switchTo; lb.setAttribute('aria-label', T.switchLabel); lb.setAttribute('lang', lang === 'zh' ? 'en' : 'zh-CN');
    $('skip').textContent = lang === 'zh' ? '跳到地图' : 'Skip to map';
    $('map-title').textContent = t(P.name);
    $('sub').innerHTML = '<span>' + esc(lang === 'zh' ? P.name.en.toUpperCase() : P.name.zh) + '</span><i aria-hidden="true"></i><span>' + esc(T.kicker) + '</span>';
    $('tagline').textContent = t(P.tagline);
    $('btn-start').textContent = T.start; $('btn-all').textContent = T.all; $('btn-contact').textContent = T.contact;
    $('vp-all').textContent = T.all;
    $('vp').setAttribute('aria-label', T.mapAria); $('maphelp').textContent = T.mapHelp;
    $('z-in').textContent = '+'; $('z-in').setAttribute('aria-label', T.zoomIn); $('z-in').title = T.zoomIn;
    $('z-out').textContent = '−'; $('z-out').setAttribute('aria-label', T.zoomOut); $('z-out').title = T.zoomOut;
    $('z-home').innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M3 11 L12 3 L21 11 M6 9.5 V20 H18 V9.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/></svg>';
    $('z-home').setAttribute('aria-label', T.home); $('z-home').title = T.home;
    $('about-title').textContent = T.aboutTitle; $('about-text').textContent = t(P.intro);
    $('contact-links').innerHTML =
      '<li><a href="mailto:' + P.email + '">' + T.email + '<small>' + P.email + '</small></a></li>' +
      '<li><a href="' + P.github + '" target="_blank" rel="noopener">' + T.github + '</a></li>';
    $('foot').textContent = T.footer;
    $('prev').innerHTML = '‹ <span>' + T.prev + '</span>'; $('prev').setAttribute('aria-label', T.prev);
    $('next').innerHTML = '<span>' + T.next + '</span> ›'; $('next').setAttribute('aria-label', T.next);
    $('close').textContent = '×'; $('close').setAttribute('aria-label', T.close);
    $('log-title').textContent = T.logTitle; $('log-hint').textContent = T.logHint;
    $('log-close').textContent = '×'; $('log-close').setAttribute('aria-label', T.logClose);
    $('log-list').innerHTML = exps.map(function (e) {
      return '<li><button type="button" class="log-item" data-id="' + e.id + '" data-n="' + e.n + '">' +
        '<span class="d">' + esc(dateLabel(e)) + ' · ' + esc(t(byDist[e.district].name)) + '</span><span class="n">' + esc(t(e.name)) + '</span><span class="r">' + esc(t(e.role)) + '</span></button></li>';
    }).join('');
    $('chips').innerHTML = '<div class="chip-row" role="group" aria-label="' + esc(T.districtNav) + '"><button type="button" class="chip" data-d="">' + esc(T.allMap) + '</button>' +
      districts.map(function (d) { return '<button type="button" class="chip" data-d="' + d.id + '">' + esc(t(d.name)) + '<b>' + d.items.length + '</b></button>'; }).join('') + '</div>';
  }

  /* ================= 相机:缩放 / 平移 / 聚焦 ================= */
  function measure() {
    var r = $('vp').getBoundingClientRect(); VW = r.width; VH = r.height; padTop = mqMobile.matches ? 34 : 0;
    z0 = Math.min(VW / (g.CW + 40), (VH - padTop) / (g.CH + 40)); zmax = Math.max(z0 * 4, 2.6);
  }
  function axis(pos, V, lo, hi, z) {
    var span = (hi - lo) * z;
    if (span <= V) return V / 2 - (lo + hi) / 2 * z;
    return Math.max(V - hi * z, Math.min(-lo * z, pos));
  }
  function clamp(c) {
    var z = Math.max(z0, Math.min(zmax, c.z)), m = z > z0 * 1.2 ? 0.32 : 0, mx = m * VW / z, my = m * VH / z;   // 放大后允许稍微越过边缘,方便把边上的街区拉到中央
    return { z: z, x: axis(c.x, VW, -80 - mx, g.CW + 80 + mx, z), y: axis(c.y, VH, -60 - my - padTop / z, g.CH + 60 + my, z) };
  }
  function applyCamera() {
    var w = $('world'); w.style.transform = 'translate(' + cam.x.toFixed(2) + 'px,' + cam.y.toFixed(2) + 'px) scale(' + cam.z.toFixed(4) + ')';
    w.style.setProperty('--z', cam.z.toFixed(4));
  }
  function setCamera(c, o) {
    o = o || {}; var w = $('world');
    cam = clamp(c);
    if (o.animate && !mqReduce.matches) { w.classList.add('anim'); clearTimeout(animT); animT = setTimeout(function () { w.classList.remove('anim'); }, 700); }
    else { clearTimeout(animT); w.classList.remove('anim'); }
    applyCamera(); syncFocus();
  }
  function panoramaCam() { return { z: z0, x: (VW - g.CW * z0) / 2, y: padTop + (VH - padTop - g.CH * z0) / 2 }; }
  function zoneCam(id) {
    var z = g.zoneOf[id], pr = mqMobile.matches ? 58 : 0, zz = Math.min((VW - pr) / (z.w * 1.1), (VH - padTop) / (z.h * 1.42), zmax);
    return { z: zz, x: (VW - pr) / 2 - z.cx * zz, y: padTop / 2 + (VH - padTop) / 2 - (z.cy + 6) * zz };
  }
  function focusAt(c, force) {
    if (!force && c.z < z0 * 1.5) return null;
    var wx = (VW / 2 - c.x) / c.z, wy = (VH / 2 - c.y) / c.z, best = null, bd = 1e9;
    g.zones.forEach(function (z) { var d = Math.hypot(wx - z.cx, wy - z.cy); if (d < bd) { bd = d; best = z.d.id; } });
    return best;
  }
  function goPanorama(o) { setCamera(panoramaCam(), o || { animate: true }); }
  function goDistrict(id, o) { if (g.zoneOf[id]) setCamera(zoneCam(id), o || { animate: true }); }
  function zoomBy(f, cx, cy) {
    var px = cx == null ? VW / 2 : cx, py = cy == null ? VH / 2 : cy, nz = Math.max(z0, Math.min(zmax, cam.z * f)), k = nz / cam.z;
    setCamera({ z: nz, x: px - (px - cam.x) * k, y: py - (py - cam.y) * k });
  }
  function zoomIn() {
    if (focus == null) { goDistrict(focusAt(cam, true)); return; }
    var c = zoneCam(focus), target = Math.min(zmax, Math.max(cam.z * 1.4, c.z * 0.999));
    var k = target / cam.z; setCamera({ z: target, x: VW / 2 - (VW / 2 - cam.x) * k, y: VH / 2 - (VH / 2 - cam.y) * k }, { animate: true });
  }
  function zoomOut() {
    var nz = cam.z / 1.4;
    if (nz < z0 * 1.7) { goPanorama(); return; }
    var k = nz / cam.z; setCamera({ z: nz, x: VW / 2 - (VW / 2 - cam.x) * k, y: VH / 2 - (VH / 2 - cam.y) * k }, { animate: true });
  }

  function syncFocus(force) {
    var f = focusAt(cam);
    if (!force && f === focus) { updateControls(); return; }
    var prev = focus; focus = f;
    var w = $('world'), d = f ? byDist[f] : null;
    w.dataset.focus = f || '';
    w.classList.toggle('few', !!d && d.items.length <= 4);
    w.querySelectorAll('.proj').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-d') === f); });
    w.querySelectorAll('.lm').forEach(function (b) { b.classList.toggle('is-focused', b.getAttribute('data-d') === f); b.classList.toggle('dim', !!f && b.getAttribute('data-d') !== f); });
    w.querySelectorAll('.inroad').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-d') === f); });
    w.querySelectorAll('.dsign').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-d') === f); });
    document.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String((c.getAttribute('data-d') || null) === f)); });
    listOpen = !!d && (mqMobile.matches || d.items.length > 4);
    renderList(); updateControls();
    if (!force && prev !== undefined) $('live').textContent = f ? ui().focused + t(d.name) + ' · ' + projCount(d.items.length) : ui().backed;
  }
  function updateControls() {
    $('z-out').disabled = focus == null && cam.z <= z0 * 1.001;
    $('z-in').disabled = cam.z >= zmax * 0.999;
    $('z-home').disabled = focus == null && cam.z <= z0 * 1.001;
  }

  /* 街区清单:项目密集时也能找到每一个 */
  function renderList() {
    var el = $('dlist'), d = focus ? byDist[focus] : null, T = ui();
    if (!d) { el.hidden = true; el.innerHTML = ''; return; }
    el.hidden = false;
    el.innerHTML = '<div class="dl-head"><div><b>' + esc(t(d.name)) + '</b><span>' + esc(projCount(d.items.length)) + '</span></div>' +
      '<button type="button" class="dl-toggle" aria-expanded="' + listOpen + '" aria-controls="dl-items">' + esc(listOpen ? T.listClose : T.listOpen) + '</button></div>' +
      (listOpen ? '<p class="dl-blurb">' + esc(t(d.blurb)) + '</p>' : '') +
      '<ul class="dl-items" id="dl-items"' + (listOpen ? '' : ' hidden') + ' tabindex="-1">' + d.items.map(function (e) {
        return '<li><button type="button" class="dl-item' + (current === e.id ? ' is-selected' : '') + '" data-id="' + e.id + '"><b>' + esc(shortName(e)) + '</b><i>' + esc(dateLabel(e)) + '</i></button></li>';
      }).join('') + '</ul>';
  }

  /* ================= 拖拽 / 双指缩放 / 键盘 ================= */
  function bindCamera() {
    var vp = $('vp'), ptrs = {}, drag = null, pinch = null;
    function pt(e) { var r = vp.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    function count() { return Object.keys(ptrs).length; }
    vp.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      ptrs[e.pointerId] = pt(e);
      if (count() === 1) drag = { sx: e.clientX, sy: e.clientY, cx: cam.x, cy: cam.y, on: false, id: e.pointerId };
      else if (count() === 2) {
        var k = Object.keys(ptrs), a = ptrs[k[0]], b = ptrs[k[1]], mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, z: cam.z, wx: (mid.x - cam.x) / cam.z, wy: (mid.y - cam.y) / cam.z }; drag = null;
      }
    });
    vp.addEventListener('pointermove', function (e) {
      if (!ptrs[e.pointerId]) return;
      ptrs[e.pointerId] = pt(e);
      if (pinch && count() >= 2) {
        var k = Object.keys(ptrs), a = ptrs[k[0]], b = ptrs[k[1]], mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        var nz = Math.max(z0, Math.min(zmax, pinch.z * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.d)));
        setCamera({ z: nz, x: mid.x - pinch.wx * nz, y: mid.y - pinch.wy * nz }); suppressClick = true; return;
      }
      if (!drag || drag.id !== e.pointerId) return;
      var dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
      if (!drag.on && Math.hypot(dx, dy) > 6) {
        drag.on = true; vp.classList.add('dragging');
        try { vp.setPointerCapture(e.pointerId); } catch (x) {}
      }
      if (drag.on) { setCamera({ z: cam.z, x: drag.cx + dx, y: drag.cy + dy }); suppressClick = true; }
    });
    function end(e) {
      if (!ptrs[e.pointerId]) return;
      delete ptrs[e.pointerId];
      if (count() < 2) pinch = null;
      if (count() === 0) { vp.classList.remove('dragging'); drag = null; if (suppressClick) setTimeout(function () { suppressClick = false; }, 0); }
    }
    vp.addEventListener('pointerup', end); vp.addEventListener('pointercancel', end); vp.addEventListener('lostpointercapture', function (e) { end(e); });
    // 拖拽结束的那一下 click 不打开项目
    vp.addEventListener('click', function (e) { if (suppressClick) { e.stopPropagation(); e.preventDefault(); } }, true);
    // 双指时接管手势(阻止页面滚动与浏览器缩放),单指纵向仍是页面滚动
    vp.addEventListener('touchmove', function (e) { if (e.touches.length >= 2 && e.cancelable) e.preventDefault(); }, { passive: false });
    // 触控板双指捏合(ctrl+滚轮)缩放;普通滚轮仍滚动页面
    vp.addEventListener('wheel', function (e) {
      if (!e.ctrlKey) return; e.preventDefault();
      var p = pt(e); zoomBy(Math.exp(-e.deltaY * 0.01), p.x, p.y);
    }, { passive: false });
    vp.addEventListener('dblclick', function (e) { if (e.target.closest('button')) return; var p = pt(e); zoomBy(1.6, p.x, p.y); });
    vp.addEventListener('keydown', function (e) {
      if (e.target !== vp) return;
      var s = 90, k = e.key;
      if (k === 'ArrowLeft') setCamera({ z: cam.z, x: cam.x + s, y: cam.y });
      else if (k === 'ArrowRight') setCamera({ z: cam.z, x: cam.x - s, y: cam.y });
      else if (k === 'ArrowUp') setCamera({ z: cam.z, x: cam.x, y: cam.y + s });
      else if (k === 'ArrowDown') setCamera({ z: cam.z, x: cam.x, y: cam.y - s });
      else if (k === '+' || k === '=') zoomIn();
      else if (k === '-' || k === '_') zoomOut();
      else if (k === '0' || k === 'Home') goPanorama();
      else return;
      e.preventDefault();
    });
    $('z-in').addEventListener('click', zoomIn); $('z-out').addEventListener('click', zoomOut); $('z-home').addEventListener('click', function () { goPanorama(); });
  }

  /* ================= 详情面板 ================= */
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
    var T = ui(), links = (e.links || []).filter(function (l) { return l.url; });
    var tags = (e.tags || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') +
      list(e.pending).map(function (s) { return '<li class="pend">' + esc(T.pending) + ':' + esc(s.replace(/待补|TBD/g, '').trim() || s) + '</li>'; }).join('');
    var shots = (e.images || []).map(function (im) {
      return '<figure class="shot"><img src="' + esc(im.src) + '" alt="' + esc(t(im.alt)) + '" loading="lazy"><figcaption>' + esc(t(im.alt)) + '</figcaption></figure>';
    }).join('');
    $('panel-body').innerHTML =
      '<p class="p-kicker">' + e.n + ' · ' + esc(t(byDist[e.district].name)) + ' · ' + esc(dateLabel(e)) + '</p>' +
      '<h2 id="panel-title" tabindex="-1">' + esc(t(e.name)) + '</h2>' +
      '<p class="p-meta"><b>' + esc(t(e.role)) + '</b>' + esc(e.org) + '</p>' +
      section('background', 1, list(e.background)) + section('mine', 2, list(e.mine)) + section('how', 3, list(e.how)) +
      section('result', 4, list(e.result), tourHtml(e) + shots) +
      (links.length ? '<div class="p-links">' + links.map(function (l) { return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(t(l.label)) + ' ↗</a>'; }).join('') + '</div>' : '') +
      (tags ? '<ul class="chips2" aria-label="' + esc(T.tags) + '">' + tags + '</ul>' : '');
    $('count').textContent = e.n + ' ' + T.of + ' ' + exps.length;
  }

  var panel = $('panel'), scrim = $('scrim');
  function projBtn(id) { return document.querySelector('.proj[data-id="' + id + '"]'); }
  function setSelected() {
    document.querySelectorAll('.proj, .dl-item').forEach(function (b) { b.classList.toggle('is-selected', b.getAttribute('data-id') === current); });
  }
  /* 桌面端:让被选中的建筑停在详情面板左边,不被盖住 */
  function ensureVisible(e) {
    if (mqMobile.matches) return;
    var vr = $('vp').getBoundingClientRect(), limit = window.innerWidth - Math.min(440, window.innerWidth) - 30 - vr.left;
    var sx = cam.x + e.px * cam.z + e.bw * cam.z / 2;
    if (sx > limit) setCamera({ z: cam.z, x: cam.x - (sx - limit), y: cam.y }, { animate: true });
  }

  function openExp(id, opts) {
    opts = opts || {};
    var e = byId[id]; if (!e) return;
    var wasOpen = panel.classList.contains('open');
    if (!wasOpen) restoreCam = { x: cam.x, y: cam.y, z: cam.z };
    current = id; tourIndex = 0;
    if (focus !== e.district) goDistrict(e.district, { animate: !opts.instant });
    renderPanel(); setSelected(); renderList();
    if (focus === e.district) ensureVisible(e);
    panel.removeAttribute('inert'); panel.classList.add('open');
    var mobile = mqMobile.matches;
    panel.setAttribute('aria-modal', mobile ? 'true' : 'false');
    scrim.hidden = !mobile; document.body.classList.toggle('sheet-open', mobile);
    $('panel-body').scrollTop = 0;
    try { history.replaceState(null, '', '#' + id); } catch (x) {}
    $('live').textContent = ui().opened + t(e.name);
    if (opts.keepFocus) return;
    setTimeout(function () { var h = $('panel-title'); h && h.focus({ preventScroll: true }); }, 30);
  }
  function closePanel(returnFocus) {
    if (!panel.classList.contains('open')) return;
    var e = byId[current];
    panel.classList.remove('open'); panel.setAttribute('inert', '');
    scrim.hidden = true; document.body.classList.remove('sheet-open');
    try { history.replaceState(null, '', location.pathname + location.search); } catch (x) {}
    // 回到打开前的位置和缩放;如果那个视角里看不到这个项目,就留在它所在的街区
    if (restoreCam && e && focusAt(clamp(restoreCam)) === e.district) setCamera(restoreCam, { animate: true });
    restoreCam = null;
    if (returnFocus === false) return;
    var b = e && projBtn(current);
    if (b && b.classList.contains('on')) b.focus({ preventScroll: true });
    else if (lastTrigger && document.contains(lastTrigger) && lastTrigger.offsetParent !== null) lastTrigger.focus({ preventScroll: true });
    else { var c = document.querySelector('.chip[aria-pressed="true"]'); c && c.focus({ preventScroll: true }); }
  }
  function step(delta) {
    var i = exps.findIndex(function (x) { return x.id === current; }), next = exps[(i + delta + exps.length) % exps.length];
    var fid = document.activeElement && document.activeElement.id;
    openExp(next.id, { keepFocus: true });
    if (fid === 'prev' || fid === 'next') $(fid).focus();
  }
  function setTour(i, focusTab) {
    var e = byId[current]; if (!e || !e.tour) return;
    var n = e.tour.steps.length; tourIndex = (i + n) % n;
    document.querySelectorAll('.tab').forEach(function (b, k) { var on = k === tourIndex; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; if (on && focusTab) b.focus(); });
    var body = $('tour-body'); body.setAttribute('aria-labelledby', 'tab-' + tourIndex);
    body.innerHTML = tourBody(e); body.classList.remove('swap'); void body.offsetWidth; body.classList.add('swap');
  }

  /* ================= 全部经历 ================= */
  var log = $('log');
  function openLog() { lastTrigger = document.activeElement; if (typeof log.showModal === 'function') log.showModal(); else log.setAttribute('open', ''); }
  function closeLog() { if (log.open) log.close(); }
  function scrollToEl(el) { el.scrollIntoView({ behavior: mqReduce.matches ? 'auto' : 'smooth', block: 'start' }); }

  /* ================= 事件 ================= */
  document.addEventListener('click', function (ev) {
    var tg = ev.target;
    var pr = tg.closest('.proj'); if (pr) { lastTrigger = pr; openExp(pr.getAttribute('data-id')); return; }
    var lm = tg.closest('.lm'); if (lm) { lastTrigger = lm; goDistrict(lm.getAttribute('data-d')); return; }
    var ch = tg.closest('.chip'); if (ch) { var d = ch.getAttribute('data-d'); if (d) goDistrict(d); else goPanorama(); return; }
    var di = tg.closest('.dl-item'); if (di) { lastTrigger = di; openExp(di.getAttribute('data-id')); return; }
    var tg2 = tg.closest('.dl-toggle'); if (tg2) { listOpen = !listOpen; renderList(); var nb = document.querySelector('.dl-toggle'); nb && nb.focus(); return; }
    var li = tg.closest('.log-item');
    if (li) { var id = li.getAttribute('data-id'); closeLog(); lastTrigger = document.querySelector('#btn-all'); openExp(id); return; }
    var tab = tg.closest('.tab'); if (tab) { setTour(+tab.getAttribute('data-i'), false); return; }
    if (tg === scrim) closePanel();
  });
  document.addEventListener('keydown', function (ev) {
    var tab = ev.target.closest && ev.target.closest('.tab');
    if (tab && ['ArrowRight', 'ArrowLeft', 'Home', 'End'].indexOf(ev.key) >= 0) {
      ev.preventDefault(); var i = +tab.getAttribute('data-i'), n = byId[current].tour.steps.length;
      setTour(ev.key === 'Home' ? 0 : ev.key === 'End' ? n - 1 : i + (ev.key === 'ArrowRight' ? 1 : -1), true); return;
    }
    if (ev.key === 'Escape' && !log.open) {
      if (panel.classList.contains('open')) { ev.preventDefault(); closePanel(); return; }
      if (focus != null && ev.target.closest && ev.target.closest('#stage')) { ev.preventDefault(); goPanorama(); return; }
    }
    if (ev.key === 'Tab' && panel.classList.contains('open') && mqMobile.matches) {
      var f = panel.querySelectorAll('button, a[href], [tabindex="0"]'); if (!f.length) return;
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
  ['btn-all', 'vp-all'].forEach(function (id) { $(id).addEventListener('click', openLog); });
  ['btn-contact'].forEach(function (id) { $(id).addEventListener('click', function () { var c = $('contact'); scrollToEl(c); c.focus({ preventScroll: true }); }); });
  $('btn-start').addEventListener('click', function () { lastTrigger = $('btn-start'); scrollToEl($('stage')); openExp(exps[0].id); });
  $('skip').addEventListener('click', function (ev) { ev.preventDefault(); scrollToEl($('stage')); $('vp').focus({ preventScroll: true }); });
  $('lang').addEventListener('click', function () {
    lang = lang === 'zh' ? 'en' : 'zh';
    try { localStorage.setItem('lang', lang); } catch (x) {}
    var had = document.activeElement && document.activeElement.getAttribute && document.activeElement.getAttribute('data-id');
    renderChrome(); renderWorld(); if (current) { renderPanel(); setSelected(); } renderList();
    if (had) { var b = projBtn(had); b && b.focus({ preventScroll: true }); }
  });

  /* 尺寸变化:窗口宽度跨过手机断点时重排整张地图 */
  var rzT = 0;
  function onResize() {
    clearTimeout(rzT);
    rzT = setTimeout(function () {
      var wasMob = g.mob, oldZ0 = z0, atHome = focus == null;
      if (mqMobile.matches !== wasMob) { buildGeometry(); measure(); renderWorld(); goPanorama({}); }
      else { measure(); if (atHome) setCamera(panoramaCam()); else setCamera({ x: cam.x, y: cam.y, z: cam.z * z0 / oldZ0 }); }
      if (current && panel.classList.contains('open')) { var m = mqMobile.matches; panel.setAttribute('aria-modal', m ? 'true' : 'false'); scrim.hidden = !m; document.body.classList.toggle('sheet-open', m); }
    }, 120);
  }
  window.addEventListener('resize', onResize);
  if (window.ResizeObserver) new ResizeObserver(onResize).observe($('vp'));

  /* ================= 初始化 ================= */
  function init() {
    try { var sv = localStorage.getItem('lang'); lang = sv === 'en' || sv === 'zh' ? sv : 'zh'; } catch (x) { lang = 'zh'; }
    buildModel(); buildGeometry(); renderChrome(); measure(); renderWorld(); cam = panoramaCam(); applyCamera(); syncFocus(true);
    bindCamera();
    var h = location.hash.replace('#', '');
    if (byId[h]) openExp(h, { keepFocus: true, instant: true });
  }
  init();

  // 供测试和以后扩展使用:修改 PORTFOLIO 数据后重新生成整张地图
  window.PortfolioMap = {
    rebuild: function () { buildModel(); buildGeometry(); renderChrome(); measure(); renderWorld(); goPanorama({}); },
    state: function () { return { cam: cam, focus: focus, z0: z0, zmax: zmax, VW: VW, VH: VH }; }
  };
})();
