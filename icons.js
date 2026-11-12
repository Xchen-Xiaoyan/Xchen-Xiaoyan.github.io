/* 统一画风的建筑与装饰:同一视角(正面 + 右侧面)、同一光源(左上)、同一线宽。
   新增图标:在 places 里加一个函数即可,名字就是经历里的 icon 字段。 */
(function () {
  var INK = '#3d3a47';
  var WALL = '#f8efdc', SHADE = '#e1d1b1', TOP = '#fcf6e8';
  var SAGE = '#a8c1a1', SAGE_D = '#8da988', MIST = '#b7d0d9', MIST_D = '#9bb7c3';
  var GLASS = '#c6dde5', WOOD = '#a98a68', DUST = '#ebd48f';

  function svg(inner, vb) {
    return '<svg viewBox="' + vb + '" aria-hidden="true" focusable="false"><g stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">' + inner + '</g></svg>';
  }
  function poly(pts, fill, sw) { return '<polygon points="' + pts + '" fill="' + fill + '"' + (sw ? ' stroke-width="' + sw + '"' : '') + '/>'; }
  function rect(x, y, w, h, fill, sw) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '"' + (sw ? ' stroke-width="' + sw + '"' : '') + '/>'; }
  function line(x1, y1, x2, y2, sw) { return '<path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '" fill="none"' + (sw ? ' stroke-width="' + sw + '"' : '') + '/>'; }
  function circ(cx, cy, r, fill, sw) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '"' + (sw ? ' stroke-width="' + sw + '"' : '') + '/>'; }
  /* 立方体:右侧面和顶面向右上方挤出 d,光源在左上,所以右侧面更暗 */
  function box(x, y, w, h, o) {
    o = o || {}; var d = o.d == null ? 12 : o.d, k = d * 0.55;
    return poly([x + w, y, x + w + d, y - k, x + w + d, y + h - k, x + w, y + h].join(' '), o.side || SHADE) +
      poly([x, y, x + d, y - k, x + w + d, y - k, x + w, y].join(' '), o.top || TOP) +
      rect(x, y, w, h, o.front || WALL);
  }
  function win(x, y, w, h) { return rect(x, y, w, h, GLASS, 1.6) + line(x + 2, y + h - 2, x + w - 2, y + 2, 1.2).replace('fill="none"', 'fill="none" stroke="#fff" opacity=".7"'); }
  function shadow(cx, rx, y) { return '<ellipse cx="' + (cx + 8) + '" cy="' + (y || 101) + '" rx="' + rx + '" ry="5" fill="rgba(61,58,71,.16)" stroke="none"/>'; }
  var VB = '0 0 140 110', LB = '0 0 200 150';

  var places = {
    /* Frog:办公楼 + 屋顶青蛙 */
    office: function () {
      return svg(shadow(62, 56) + box(22, 44, 66, 56, { d: 14 }) + box(18, 38, 74, 8, { d: 14, front: SAGE, side: SAGE_D, top: '#c8dac2' }) +
        win(32, 54, 16, 14) + win(60, 54, 16, 14) + win(32, 76, 16, 14) + rect(62, 78, 14, 22, WOOD) +
        poly('92,56 99,52 99,66 92,70', GLASS, 1.4) + poly('92,76 99,72 99,86 92,90', GLASS, 1.4) +
        '<ellipse cx="55" cy="28" rx="18" ry="10" fill="#9cbf8f"/>' + circ(47, 20, 5.5, '#fff', 1.8) + circ(63, 20, 5.5, '#fff', 1.8) +
        circ(47.5, 20.5, 2, INK, 0) + circ(62.5, 20.5, 2, INK, 0) + '<path d="M48 32 Q55 37 62 32" fill="none" stroke-width="1.8"/>', VB);
    },
    /* 百融:高楼 + 信号天线 */
    tower: function () {
      var w = '';
      [[50, 30], [66, 30], [50, 48], [66, 48], [50, 66], [66, 66]].forEach(function (p) { w += win(p[0], p[1], 10, 10); });
      return svg(shadow(62, 56) + box(10, 66, 28, 34, { d: 8 }) + win(17, 76, 9, 9) + box(42, 20, 40, 80, { d: 14 }) + w + rect(55, 86, 14, 14, WOOD) +
        line(62, 20, 62, 6) + circ(62, 5, 3.4, SAGE) + '<path d="M52 10 Q62 -1 72 10" fill="none" stroke-width="1.8"/>' + poly('96,62 99,60.5 99,100 96,100', SHADE, 0), VB);
    },
    /* 信用卡违约预测:实验室 + 仪表盘 */
    lab: function () {
      return svg(shadow(60, 56) + box(18, 50, 72, 50, { d: 16, top: MIST }) + box(68, 26, 12, 26, { d: 6, front: SHADE, side: MIST_D, top: TOP }) +
        circ(76, 16, 4.5, '#fff', 1.8) + circ(84, 8, 3, '#fff', 1.8) +
        circ(44, 76, 16, '#fff') + '<path d="M30 78 A14 14 0 0 1 58 78" fill="none" stroke="' + SAGE_D + '" stroke-width="5"/>' + line(44, 78, 53, 66, 2.6) + circ(44, 78, 2.6, INK, 0) +
        rect(70, 78, 14, 22, WOOD), VB);
    },
    /* AI 新闻:图书馆 */
    library: function () {
      var c = ''; [32, 50, 68, 86].forEach(function (x) { c += rect(x, 60, 8, 36, '#fff', 1.6); });
      return svg(shadow(62, 58) + box(22, 56, 84, 44, { d: 12 }) + c + poly('64,24 76,17.4 122,49.4 110,56', SAGE_D) + poly('18,56 64,24 110,56', SAGE) + circ(64, 42, 6.5, '#fff', 1.8) + line(64, 37.5, 64, 42, 1.6) + line(64, 42, 68, 44, 1.6) +
        box(14, 96, 98, 6, { d: 10, front: SHADE }), VB);
    },
    /* HERE:桥 + 路牌 + 净高标尺 */
    bridge: function () {
      return svg('<path d="M0 94 Q18 88 36 94 T72 94 T108 94 T140 94 L140 106 L0 106 Z" fill="' + MIST + '" stroke="none"/>' +
        '<path d="M8 99 q8 -3 16 0 M60 101 q8 -3 16 0 M104 99 q8 -3 16 0" fill="none" stroke="#fff" stroke-width="1.6" opacity=".8"/>' +
        box(24, 62, 14, 38, { d: 8, front: SHADE }) + box(94, 62, 14, 38, { d: 8, front: SHADE }) + box(6, 46, 116, 16, { d: 12 }) +
        '<path d="M38 100 Q66 66 94 100" fill="none"/>' + '<path d="M66 66 L66 98 M61 71 L66 65 L71 71 M61 93 L66 99 L71 93" fill="none" stroke-width="2" stroke-dasharray="0"/>' +
        line(18, 46, 18, 20) + poly('18,5 30,17 18,29 6,17', DUST, 1.8) + line(116, 46, 116, 30) + rect(106, 16, 20, 14, '#fff', 1.8), VB);
    },
    /* Olist:数据观测站,圆顶 + 望远镜 + 柱状图 */
    observatory: function () {
      return svg(shadow(62, 56) + box(28, 64, 66, 36, { d: 14 }) + '<path d="M32 64 A30 30 0 0 1 92 64 Z" fill="' + MIST + '"/>' +
        poly('58,40 82,14 90,21 66,47', SAGE) + rect(38, 82, 9, 12, SAGE, 1.6) + rect(52, 76, 9, 18, SAGE, 1.6) + rect(66, 70, 9, 24, SAGE, 1.6) +
        line(112, 100, 112, 44) + '<path d="M104 46 Q112 36 120 46" fill="none" stroke-width="1.8"/>' + circ(112, 43, 3, SAGE), VB);
    },
    house: function () {
      return svg(shadow(62, 50) + box(30, 58, 60, 42, { d: 12 }) + poly('72,32 84,25.4 108,52 96,58', SAGE_D) + poly('24,58 60,30 96,58', SAGE) + win(40, 70, 14, 12) + rect(64, 76, 14, 24, WOOD), VB);
    },
    workshop: function () {
      return svg(shadow(60, 56) + box(18, 54, 80, 46, { d: 14 }) + poly('18,54 18,38 40,54', SAGE) + poly('40,54 40,38 62,54', SAGE) + poly('62,54 62,38 84,54', SAGE) + rect(30, 70, 30, 30, WOOD) + win(70, 68, 16, 14), VB);
    }
  };
  Object.keys(places).forEach(function (k) { var f = places[k]; var html = f(); places[k] = html; });

  /* 街区代表建筑(全景里使用) */
  var landmarks = {
    internships: function () {
      var w = ''; for (var r = 0; r < 5; r++) { w += win(82, 44 + r * 18, 12, 11) + win(100, 44 + r * 18, 12, 11); }
      return svg(shadow(96, 92, 139) + box(8, 84, 52, 56, { d: 10 }) + win(18, 94, 12, 11) + win(38, 94, 12, 11) + win(18, 114, 12, 11) + rect(36, 118, 12, 22, WOOD) +
        box(70, 30, 48, 110, { d: 16 }) + w + rect(88, 122, 14, 18, WOOD) + line(94, 30, 94, 12) + circ(94, 10, 3.5, SAGE) + poly('94,12 110,17 94,22', DUST, 1.8) +
        box(132, 90, 46, 50, { d: 10 }) + win(140, 100, 12, 11) + win(158, 100, 12, 11) + win(140, 118, 12, 11) + rect(158, 118, 12, 22, WOOD) +
        box(128, 84, 54, 7, { d: 10, front: SAGE, side: SAGE_D, top: '#c8dac2' }), LB);
    },
    observatory: function () {
      return svg(shadow(100, 92, 139) + box(56, 84, 84, 55, { d: 18 }) + '<path d="M64 84 A36 36 0 0 1 136 84 Z" fill="' + MIST + '"/>' + poly('92,56 124,22 134,31 102,65', SAGE) +
        rect(70, 108, 10, 20, SAGE, 1.6) + rect(86, 98, 10, 30, SAGE, 1.6) + rect(102, 90, 10, 38, SAGE, 1.6) + rect(118, 104, 10, 24, SAGE, 1.6) +
        line(26, 139, 26, 104) + rect(8, 66, 44, 36, '#fff', 2) + '<path d="M13 94 L22 84 L30 90 L46 74" fill="none" stroke="' + SAGE_D + '" stroke-width="2.4"/>' + rect(14, 96, 6, 4, SAGE, 1) + rect(26, 94, 6, 6, SAGE, 1) + rect(38, 92, 6, 8, SAGE, 1) +
        line(178, 139, 178, 46) + '<path d="M166 52 Q178 36 190 52" fill="none"/><path d="M170 62 Q178 52 186 62" fill="none" stroke-width="1.8"/>' + circ(178, 44, 4, SAGE), LB);
    },
    archive: function () {
      var c = ''; [46, 66, 86, 106, 126].forEach(function (x) { c += rect(x, 86, 10, 46, '#fff', 1.8); });
      return svg(shadow(96, 96, 139) + box(34, 80, 124, 58, { d: 18 }) + c + poly('96,36 110,28 176,72 164,80', SAGE_D) + poly('28,80 96,36 164,80', SAGE) +
        circ(96, 60, 9, '#fff', 2) + line(96, 53, 96, 60, 1.8) + line(96, 60, 102, 63, 1.8) + box(12, 130, 22, 8, { d: 6, front: '#fff' }) + box(14, 122, 20, 8, { d: 6, front: '#f3e6c9' }) +
        box(166, 100, 26, 38, { d: 6 }) + rect(170, 108, 18, 16, '#fff', 1.6) + line(173, 113, 185, 113, 1.4) + line(173, 118, 185, 118, 1.4), LB);
    },
    lab: function () {
      var truss = ''; for (var y = 52; y < 136; y += 14) { truss += '<path d="M152 ' + y + ' L162 ' + (y + 14) + ' M162 ' + y + ' L152 ' + (y + 14) + '" fill="none" stroke-width="1.4"/>'; }
      return svg(shadow(84, 94, 139) + box(18, 84, 100, 55, { d: 20, top: MIST }) + box(84, 52, 15, 34, { d: 7, front: SHADE, side: MIST_D, top: TOP }) + circ(92, 42, 6, '#fff', 1.8) + circ(102, 32, 4, '#fff', 1.8) +
        win(30, 96, 16, 14) + win(52, 96, 16, 14) + rect(88, 112, 16, 27, WOOD) + circ(52, 128, 0.1, WOOD) +
        line(152, 139, 152, 40) + line(162, 139, 162, 40) + truss + line(116, 40, 192, 40, 3) + line(180, 40, 180, 66) + rect(174, 66, 12, 10, SAGE, 1.8) + poly('152,40 152,28 162,28 162,40', DUST, 1.8) +
        circ(34, 130, 0.1, WOOD), LB);
    }
  };
  Object.keys(landmarks).forEach(function (k) { landmarks[k] = landmarks[k](); });

  function deco(inner, vb) { return svg(inner, vb); }
  var decor = {
    tree: deco('<ellipse cx="34" cy="76" rx="14" ry="3.5" fill="rgba(61,58,71,.14)" stroke="none"/><rect x="25" y="50" width="8" height="26" fill="' + WOOD + '"/><circle cx="30" cy="34" r="22" fill="#a8c1a1"/><path d="M42 24 A22 22 0 0 1 36 56 A26 26 0 0 0 42 24Z" fill="#8da988" stroke="none"/><path d="M18 30 Q24 22 32 26" fill="none" stroke-width="1.6" stroke="#fff" opacity=".6"/>', '0 0 60 80'),
    pine: deco('<ellipse cx="34" cy="76" rx="12" ry="3" fill="rgba(61,58,71,.14)" stroke="none"/><rect x="26" y="62" width="7" height="14" fill="' + WOOD + '"/><path d="M30 6 L47 34 L38 34 L51 58 L9 58 L22 34 L13 34 Z" fill="#9dba97"/><path d="M30 6 L47 34 L38 34 L51 58 L36 58 Z" fill="#82a07e" stroke="none"/>', '0 0 60 80'),
    bush: deco('<ellipse cx="34" cy="34" rx="22" ry="4" fill="rgba(61,58,71,.14)" stroke="none"/><path d="M8 32 Q6 14 22 16 Q28 6 40 14 Q54 12 52 32 Z" fill="#a8c1a1"/><path d="M40 14 Q54 12 52 32 L40 32 Q46 22 40 14Z" fill="#8da988" stroke="none"/>', '0 0 60 40'),
    rock: deco('<ellipse cx="22" cy="22" rx="16" ry="3" fill="rgba(61,58,71,.14)" stroke="none"/><path d="M5 22 Q4 8 16 7 Q30 6 36 22 Z" fill="#e1d6c0"/>', '0 0 44 28'),
    cloud: deco('<path d="M22 40 Q8 40 10 28 Q12 18 26 20 Q30 6 46 8 Q60 6 66 18 Q84 14 90 28 Q100 32 96 40 Z" fill="#fffdf6" stroke-width="1.8"/>', '0 0 108 50')
  };

  window.ICONS = { places: places, landmarks: landmarks, decor: decor };
})();
