/* 手绘风格的地点图标和地图装饰(内联 SVG,无外部资源) */
(function () {
  var INK = '#2b2a33';
  var G = 'stroke="' + INK + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
  function wrap(inner) {
    return '<svg viewBox="0 0 140 110" aria-hidden="true" focusable="false"><g ' + G + '>' + inner + '</g></svg>';
  }

  var places = {
    /* Frog:办公楼,屋顶上有一只青蛙招牌 */
    office: wrap(
      '<rect x="25" y="42" width="90" height="62" fill="#f6ecd2"/>' +
      '<rect x="19" y="36" width="102" height="10" fill="#d9cfb2"/>' +
      '<rect x="36" y="54" width="18" height="14" fill="#cfe3e6"/><rect x="86" y="54" width="18" height="14" fill="#cfe3e6"/>' +
      '<rect x="36" y="76" width="18" height="14" fill="#cfe3e6"/><rect x="86" y="76" width="18" height="14" fill="#cfe3e6"/>' +
      '<rect x="62" y="78" width="16" height="26" fill="#9a7b58"/>' +
      '<ellipse cx="70" cy="22" rx="24" ry="14" fill="#8fb08a"/>' +
      '<circle cx="59" cy="12" r="7" fill="#fff"/><circle cx="81" cy="12" r="7" fill="#fff"/>' +
      '<circle cx="60" cy="13" r="2.6" fill="' + INK + '"/><circle cx="80" cy="13" r="2.6" fill="' + INK + '"/>' +
      '<path d="M60 26 Q70 33 80 26" fill="none"/>'
    ),
    /* 百融:高楼 + 信号天线(语音/营销) */
    tower: wrap(
      '<rect x="14" y="66" width="32" height="38" fill="#f6ecd2"/><rect x="96" y="72" width="30" height="32" fill="#f6ecd2"/>' +
      '<rect x="22" y="76" width="10" height="9" fill="#cfe3e6"/><rect x="104" y="82" width="10" height="9" fill="#cfe3e6"/>' +
      '<rect x="46" y="26" width="50" height="78" fill="#e4ecd8"/>' +
      '<rect x="55" y="36" width="10" height="10" fill="#cfe3e6"/><rect x="77" y="36" width="10" height="10" fill="#cfe3e6"/>' +
      '<rect x="55" y="54" width="10" height="10" fill="#cfe3e6"/><rect x="77" y="54" width="10" height="10" fill="#cfe3e6"/>' +
      '<rect x="55" y="72" width="10" height="10" fill="#cfe3e6"/><rect x="77" y="72" width="10" height="10" fill="#cfe3e6"/>' +
      '<rect x="62" y="88" width="16" height="16" fill="#9a7b58"/>' +
      '<path d="M71 26 L71 12" fill="none"/><circle cx="71" cy="10" r="3.5" fill="#8fb08a"/>' +
      '<path d="M60 14 Q71 2 82 14" fill="none"/>'
    ),
    /* 信用卡违约:风控实验室,大仪表盘 + 烧瓶烟囱 */
    lab: wrap(
      '<rect x="20" y="52" width="100" height="52" fill="#f6ecd2"/>' +
      '<rect x="20" y="46" width="100" height="9" fill="#d9cfb2"/>' +
      '<rect x="92" y="24" width="16" height="24" fill="#d9cfb2"/>' +
      '<circle cx="100" cy="14" r="5" fill="#fff"/><circle cx="108" cy="6" r="3" fill="#fff"/>' +
      '<circle cx="58" cy="80" r="22" fill="#fff"/>' +
      '<path d="M40 82 A18 18 0 0 1 76 82" fill="none" stroke="#8fb08a" stroke-width="6"/>' +
      '<path d="M58 82 L69 66" stroke="#e8833a" stroke-width="4" fill="none"/><circle cx="58" cy="82" r="3.5" fill="' + INK + '"/>' +
      '<rect x="94" y="76" width="16" height="28" fill="#9a7b58"/>'
    ),
    /* 新闻档案馆:带柱子的图书馆 + 时钟 */
    library: wrap(
      '<path d="M18 52 L70 18 L122 52 Z" fill="#f6ecd2"/>' +
      '<circle cx="70" cy="38" r="9" fill="#fff"/><path d="M70 32 L70 38 L75 40" fill="none" stroke-width="2.4"/>' +
      '<rect x="18" y="52" width="104" height="8" fill="#d9cfb2"/>' +
      '<rect x="28" y="60" width="11" height="36" fill="#fff"/><rect x="51" y="60" width="11" height="36" fill="#fff"/>' +
      '<rect x="78" y="60" width="11" height="36" fill="#fff"/><rect x="101" y="60" width="11" height="36" fill="#fff"/>' +
      '<rect x="12" y="96" width="116" height="9" fill="#d9cfb2"/>' +
      '<path d="M70 18 L70 6 L84 10 L70 14" fill="#e8833a" stroke-width="2.4"/>'
    ),
    /* HERE:桥 + 路牌 + 净高标尺 */
    bridge: wrap(
      '<path d="M4 98 Q22 90 40 98 T76 98 T112 98 T136 98 L136 106 L4 106 Z" fill="#cfe3e6"/>' +
      '<rect x="28" y="62" width="14" height="40" fill="#d9cfb2"/><rect x="98" y="62" width="14" height="40" fill="#d9cfb2"/>' +
      '<rect x="8" y="50" width="124" height="14" fill="#f6ecd2"/>' +
      '<path d="M42 100 Q70 66 98 100" fill="none"/>' +
      '<path d="M70 66 L70 98 M65 71 L70 65 L75 71 M65 93 L70 99 L75 93" fill="none" stroke="#e8833a" stroke-width="3.4"/>' +
      '<path d="M16 50 L16 18" fill="none"/><path d="M16 6 L28 18 L16 30 L4 18 Z" fill="#f0d58a"/>' +
      '<path d="M122 50 L122 30" fill="none"/><rect x="112" y="16" width="20" height="14" fill="#fff"/>'
    ),
    /* Olist:数据观测站,圆顶 + 望远镜 + 柱状图窗 */
    observatory: wrap(
      '<rect x="32" y="62" width="76" height="42" fill="#f6ecd2"/>' +
      '<path d="M38 62 A32 32 0 0 1 102 62 Z" fill="#cfe3e6"/>' +
      '<polygon points="66,40 96,12 106,22 76,50" fill="#8fb08a"/>' +
      '<rect x="46" y="84" width="9" height="14" fill="#8fb08a"/><rect x="62" y="76" width="9" height="22" fill="#8fb08a"/><rect x="78" y="68" width="9" height="30" fill="#e8833a"/>' +
      '<circle cx="24" cy="30" r="2" fill="' + INK + '"/><circle cx="118" cy="44" r="2" fill="' + INK + '"/><circle cx="40" cy="12" r="2" fill="' + INK + '"/>'
    )
  };

  function deco(inner, vb) {
    return '<svg viewBox="' + vb + '" aria-hidden="true" focusable="false"><g ' + G + '>' + inner + '</g></svg>';
  }
  var decor = {
    tree: deco('<rect x="25" y="52" width="10" height="24" fill="#9a7b58"/><circle cx="30" cy="34" r="22" fill="#8fb08a"/><circle cx="18" cy="44" r="13" fill="#8fb08a" stroke="none"/><path d="M20 30 Q26 24 32 28" fill="none" stroke-width="2"/>', '0 0 60 80'),
    pine: deco('<rect x="26" y="62" width="8" height="14" fill="#9a7b58"/><path d="M30 6 L48 34 L38 34 L52 58 L8 58 L22 34 L12 34 Z" fill="#7ea17d"/>', '0 0 60 80'),
    cloud: deco('<path d="M22 40 Q8 40 10 28 Q12 18 26 20 Q30 6 46 8 Q60 6 66 18 Q84 14 90 28 Q100 32 96 40 Z" fill="#fffdf6"/>', '0 0 108 50')
  };
  function sign(text) {
    return deco('<rect x="42" y="30" width="7" height="36" fill="#9a7b58"/>' +
      '<path d="M6 8 L70 8 L84 20 L70 32 L6 32 Z" fill="#fff6dc"/>' +
      '<text x="38" y="26" text-anchor="middle" font-size="15" font-weight="700" fill="' + INK + '" stroke="none" font-family="KaiTi,STKaiti,serif">' + text + '</text>', '0 0 90 70');
  }

  window.ICONS = { places: places, decor: decor, sign: sign };
})();
