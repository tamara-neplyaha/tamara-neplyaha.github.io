/* Сезонное настроение для визитки.
   • с 1 декабря по 10 января — Новый год: снежок, Дед Мороз, надпись сверху + новогодняя музыка (ny-music.mp3);
   • с 1 сентября по 30 ноября — осень: падают жёлтые кленовые листья + спокойная музыка;
   • всё остальное время (с 11 января по 31 августа) — никаких картинок, играет только спокойная музыка.
   Подключение: перед </body> в index.html одна строка:
   <script src="ny.js" defer></script>
   Файлы с музыкой лежат в той же папке, что и ny.js:
   • спокойная (осень и остальное время) — absolutesound-relaxing-background-music-562025.mp3
   • Новый год — ny-music.mp3
   Проверить вне сезона: добавить к адресу ?autumn=1 или ?ny=1
   Выключить совсем: удалить эту строку из index.html. */
(function () {
  var START = { m: 12, d: 1 }, END = { m: 1, d: 10 };
  var SCRIPT = document.currentScript && document.currentScript.src;
  function file(name) { return SCRIPT ? new URL(name, SCRIPT).href : name; }

  var now = new Date(), m = now.getMonth() + 1, d = now.getDate();
  var inNY = (m === 12 && d >= START.d) || (m === 1 && d <= END.d);
  var inAutumn = m >= 9 && m <= 11;
  var mode = 'plain'; /* plain = только музыка, без картинок */
  if (/[?&]ny=1\b/.test(location.search)) mode = 'ny';
  else if (/[?&]autumn=1\b/.test(location.search)) mode = 'autumn';
  else if (inNY) mode = 'ny';
  else if (inAutumn) mode = 'autumn';

  var MUSIC = file(mode === 'ny' ? 'ny-music.mp3' : 'absolutesound-relaxing-background-music-562025.mp3');

  function isDark() {
    var r = document.documentElement.getAttribute('data-theme');
    if (r) return r === 'dark';
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /* ---------- снег ---------- */
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (mode === 'ny' && !reduce) {
    var cv = document.createElement('canvas');
    cv.setAttribute('aria-hidden', 'true');
    cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:40';
    document.body.appendChild(cv);
    var ctx = cv.getContext('2d'), W, H, dpr = Math.min(window.devicePixelRatio || 1, 2), flakes = [];
    function size() {
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function make(top) {
      return { x: Math.random() * W, y: top ? -10 : Math.random() * H, r: 1 + Math.random() * 2.4,
               v: 0.25 + Math.random() * 0.6, s: Math.random() * Math.PI * 2, a: 0.4 + Math.random() * 0.45 };
    }
    size();
    var count = Math.round(Math.min(60, Math.max(28, W / 9)));
    for (var i = 0; i < count; i++) flakes.push(make(false));
    addEventListener('resize', size);
    var running = true;
    document.addEventListener('visibilitychange', function () {
      running = !document.hidden; if (running) requestAnimationFrame(tick);
    });
    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      var col = isDark() ? '255,255,255' : '150,176,208';
      for (var i = 0; i < flakes.length; i++) {
        var f = flakes[i];
        f.y += f.v; f.s += 0.012; f.x += Math.sin(f.s) * 0.35;
        if (f.y > H + 10) flakes[i] = make(true);
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.2832);
        ctx.fillStyle = 'rgba(' + col + ',' + f.a + ')'; ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }



  /* ---------- осенние кленовые листья (только на первой страничке) ---------- */
  if (mode === 'autumn' && !reduce) {
    var lv = document.createElement('canvas');
    lv.setAttribute('aria-hidden', 'true');
    lv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:40';
    document.body.appendChild(lv);
    var lx = lv.getContext('2d'), LW, LH, ldpr = Math.min(window.devicePixelRatio || 1, 2), leaves = [];
    var half = [[0,-1],[.17,-.68],[.30,-.76],[.27,-.38],[.62,-.55],[.56,-.28],[.95,-.10],[.62,.14],[.70,.32],[.30,.28],[.12,.42],[.04,.40],[.04,.85]];
    var shape = half.concat(half.slice(1).reverse().map(function (p) { return [-p[0], p[1]]; }));
    var COLORS = ['#F2C230', '#F5D04C', '#E8A92A', '#EDB92E', '#D99A1E'];
    function lsize() {
      LW = innerWidth; LH = innerHeight;
      lv.width = LW * ldpr; lv.height = LH * ldpr;
      lx.setTransform(ldpr, 0, 0, ldpr, 0, 0);
    }
    function lmake(top) {
      return { x: Math.random() * LW, y: top ? -20 : Math.random() * LH, r: 7 + Math.random() * 8,
               v: 0.32 + Math.random() * 0.5, s: Math.random() * 6.28, sw: 0.012 + Math.random() * 0.012,
               rot: Math.random() * 6.28, rs: (Math.random() - 0.5) * 0.022,
               c: COLORS[Math.floor(Math.random() * COLORS.length)], a: 0.8 + Math.random() * 0.2 };
    }
    lsize();
    var lcount = Math.round(Math.min(19, Math.max(10, LW / 22)));
    for (var li = 0; li < lcount; li++) leaves.push(lmake(false));
    addEventListener('resize', lsize);
    var lrun = true;
    document.addEventListener('visibilitychange', function () {
      lrun = !document.hidden; if (lrun) requestAnimationFrame(ltick);
    });
    var revToggle = document.getElementById('t-rev');
    function ltick() {
      if (!lrun) return;
      lx.clearRect(0, 0, LW, LH);
      if (revToggle && revToggle.checked) { requestAnimationFrame(ltick); return; } /* на странице отзывов листьев нет */
      for (var i = 0; i < leaves.length; i++) {
        var f = leaves[i];
        f.y += f.v; f.s += f.sw; f.rot += f.rs; f.x += Math.sin(f.s) * 0.7;
        if (f.y > LH + 20) leaves[i] = lmake(true);
        lx.save();
        lx.translate(f.x, f.y); lx.rotate(f.rot + Math.sin(f.s) * 0.5); lx.scale(f.r, f.r * (0.75 + 0.25 * Math.cos(f.s * 1.3)));
        lx.globalAlpha = f.a; lx.fillStyle = f.c; lx.beginPath();
        for (var k = 0; k < shape.length; k++) lx[k ? 'lineTo' : 'moveTo'](shape[k][0], shape[k][1]);
        lx.closePath(); lx.fill();
        lx.globalAlpha = 0.35; lx.strokeStyle = '#8A5A12'; lx.lineWidth = 0.08;
        lx.beginPath(); lx.moveTo(0, -0.8); lx.lineTo(0, 0.85); lx.stroke();
        lx.restore();
      }
      requestAnimationFrame(ltick);
    }
    requestAnimationFrame(ltick);
  }


  /* ---------- Дед Мороз на ключике ---------- */
  var arch = document.querySelector('#home .arch');
  if (mode === 'ny' && arch) {
    var ss = document.createElement('style');
    ss.textContent =
      '.ny-santa{position:absolute;right:1px;bottom:51px;width:44px;height:56px;z-index:3;pointer-events:none}' +
      '.ny-santa svg{display:block;width:100%;height:100%;overflow:visible}' +
      '.ny-santa .wave,.ny-santa .legL,.ny-santa .legR,.ny-santa .head{transform-box:view-box}' +
      (reduce ? '' :
      '@keyframes ny-wave{0%,100%{transform:rotate(-14deg)}50%{transform:rotate(16deg)}}' +
      '@keyframes ny-legL{0%,100%{transform:rotate(10deg)}50%{transform:rotate(-12deg)}}' +
      '@keyframes ny-legR{0%,100%{transform:rotate(-12deg)}50%{transform:rotate(10deg)}}' +
      '@keyframes ny-nod{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}' +
      '.ny-santa .wave{transform-origin:33px 29px;animation:ny-wave .7s ease-in-out infinite}' +
      '.ny-santa .legL{transform-origin:17px 41px;animation:ny-legL 1.2s ease-in-out infinite}' +
      '.ny-santa .legR{transform-origin:27px 41px;animation:ny-legR 1.2s ease-in-out infinite}' +
      '.ny-santa .head{transform-origin:22px 25px;animation:ny-nod 1.4s ease-in-out infinite}');
    document.head.appendChild(ss);
    var santa = document.createElement('div');
    santa.className = 'ny-santa';
    santa.setAttribute('aria-hidden', 'true');
    santa.innerHTML =
      '<svg viewBox="0 0 44 56" xmlns="http://www.w3.org/2000/svg">' +
      '<g class="legL"><rect x="14" y="40" width="6" height="9" rx="2.5" fill="#B42B25"/><rect x="12.5" y="46.5" width="9" height="5" rx="2.4" fill="#2B2220"/></g>' +
      '<g class="legR"><rect x="24" y="40" width="6" height="9" rx="2.5" fill="#B42B25"/><rect x="22.5" y="46.5" width="9" height="5" rx="2.4" fill="#2B2220"/></g>' +
      '<rect x="10" y="22" width="24" height="19" rx="8" fill="#C8372D"/>' +
      '<rect x="10" y="35" width="24" height="3" fill="#3B2A24"/><rect x="19.5" y="34.4" width="5" height="4.2" rx=".8" fill="#E8C14A"/>' +
      '<rect x="9" y="38.5" width="26" height="4" rx="2" fill="#fff"/>' +
      '<path d="M8 28q-2 6 2 10" stroke="#C8372D" stroke-width="5.5" stroke-linecap="round" fill="none"/><circle cx="10.5" cy="38.5" r="2.8" fill="#fff"/>' +
      '<g class="wave"><path d="M33 29L39.5 17" stroke="#C8372D" stroke-width="5.5" stroke-linecap="round" fill="none"/><circle cx="40.3" cy="15" r="3.2" fill="#fff"/></g>' +
      '<g class="head"><circle cx="22" cy="17" r="8.2" fill="#F6D2B8"/>' +
      '<path d="M13.6 17.5c1 9 5 13.5 8.4 13.5s7.4-4.500 8.400-13.500c-2.400 3.500-5 4.500-8.400 4.500s-6-1-8.400-4.500z" fill="#fff"/>' +
      '<circle cx="22" cy="19.4" r="1.7" fill="#E8A090"/>' +
      '<circle cx="18.7" cy="16.8" r="1" fill="#3B2A24"/><circle cx="25.3" cy="16.8" r="1" fill="#3B2A24"/>' +
      '<path d="M13 13.500Q13 2.500 23.500 2.500Q31 2.500 34 9.500L31 13.500Z" fill="#C8372D"/>' +
      '<rect x="12" y="10.500" width="20" height="4" rx="2" fill="#fff"/><circle cx="34.500" cy="9.500" r="3" fill="#fff"/></g>' +
      '</svg>';
    arch.appendChild(santa);
  }

  /* ---------- надпись сверху ---------- */
  var home = document.getElementById('home');
  if (mode === 'ny' && home) {
    var txt = (m === 12) ? 'С наступающим Новым годом!' : 'С Новым годом!';
    var hi = document.createElement('div');
    hi.textContent = '\u2744 ' + txt + ' \u2744';
    hi.setAttribute('aria-hidden', 'true');
    hi.style.cssText = 'position:absolute;top:40px;left:0;right:0;text-align:center;font-size:13px;line-height:1.2;font-weight:600;letter-spacing:.02em;color:var(--terra-deep,#8A3F29);pointer-events:none';
    if (getComputedStyle(home).position === 'static') home.style.position = 'relative';
    home.insertBefore(hi, home.firstChild);
  }

  /* ---------- музыка ---------- */
  /* плавное начало и затухание: через Web Audio (работает и на iPhone), запасной вариант — обычная громкость */
  var VOL = 0.6, ctxA = null, gain = null, vt = null;
  var audio = new Audio(MUSIC);
  audio.loop = true; audio.preload = 'auto';
  if (location.protocol !== 'file:') {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        ctxA = new AC();
        var srcN = ctxA.createMediaElementSource(audio);
        gain = ctxA.createGain(); gain.gain.value = 0;
        srcN.connect(gain); gain.connect(ctxA.destination);
      }
    } catch (e) { ctxA = null; gain = null; }
  }
  if (!gain) audio.volume = 0;
  function wake() { if (ctxA && ctxA.state === 'suspended') { try { var r = ctxA.resume(); if (r && r.catch) r.catch(function () {}); } catch (e) {} } }
  function fade(to, sec) {
    if (gain) {
      var t = ctxA.currentTime;
      gain.gain.cancelScheduledValues(t);
      gain.gain.setValueAtTime(gain.gain.value, t);
      gain.gain.linearRampToValueAtTime(to, t + sec);
    } else {
      clearInterval(vt);
      var from = audio.volume, n = Math.max(1, Math.round(sec * 20)), i = 0;
      vt = setInterval(function () {
        i++; audio.volume = Math.min(1, Math.max(0, from + (to - from) * i / n));
        if (i >= n) clearInterval(vt);
      }, 50);
    }
  }
  var wantOn = true, started = false;
  try { if (localStorage.getItem('ny-music') === 'off') wantOn = false; } catch (e) {}

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'ny-music';
  var ms = document.createElement('style');
  ms.textContent = '#t-rev:checked ~ .ny-music{display:none!important}'; /* на странице «Отзывы» музыки нет, кнопку прячем, чтобы не перекрывала кнопки */
  document.head.appendChild(ms);
  btn.style.cssText = 'position:fixed;right:14px;bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:60;width:44px;height:44px;border-radius:50%;border:1px solid var(--line,#E3D2BF);background:var(--sand,#EFE2D2);color:var(--terra-deep,#8A3F29);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;-webkit-tap-highlight-color:transparent';
  var on = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>';
  var off = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/><path d="M3 3l18 18"/></svg>';
  function paint() {
    var playing = wantOn;
    btn.innerHTML = playing ? on : off;
    btn.setAttribute('aria-label', playing ? 'Выключить музыку' : 'Включить музыку');
  }
  function play() {
    wake();
    var p = audio.play();
    if (p && p.then) p.then(function () { started = true; fade(VOL, 3); }, function () {});
  }
  paint();
  document.body.appendChild(btn);

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    wantOn = !wantOn;
    try { localStorage.setItem('ny-music', wantOn ? 'on' : 'off'); } catch (er) {}
    if (wantOn) { sync(); arm(); } else { fade(0, 0.8); setTimeout(function () { if (!wantOn) audio.pause(); }, 850); }
    paint();
  });

  /* первое касание: пробуем включить, пока музыка реально не заиграет (браузер мог не засчитать первое событие) */
  var EVS = ['pointerdown', 'pointerup', 'touchstart', 'touchend', 'mousedown', 'click', 'keydown', 'wheel', 'scroll'];
  var lastTry = 0, armed = false;
  function running() { return !audio.paused && (!ctxA || ctxA.state === 'running'); }
  function stopWaiting() {
    armed = false;
    EVS.forEach(function (ev) { document.removeEventListener(ev, first, true); window.removeEventListener(ev, first, true); });
  }
  function first() {
    if (!wantOn) { stopWaiting(); return; }
    if (!allowed()) return;
    if (running()) { stopWaiting(); return; }
    var t = Date.now(); if (t - lastTry < 250) return; lastTry = t;
    wake();
    if (audio.paused) play();
    setTimeout(function () { if (running()) stopWaiting(); }, 400);
  }
  function arm() {
    if (armed) return; armed = true;
    EVS.forEach(function (ev) {
      document.addEventListener(ev, first, { capture: true, passive: true });
      window.addEventListener(ev, first, { capture: true, passive: true });
    });
  }

  /* музыка только на главной страничке и только пока вкладка на экране:
     уход на другую страницу или вкладку и страница «Отзывы» — музыка гаснет, возвращение — плавно включается */
  var revBox = document.getElementById('t-rev'), offTimer = null;
  function allowed() { return wantOn && !document.hidden && !(revBox && revBox.checked); }
  function hush(instant) {
    clearTimeout(offTimer);
    if (audio.paused) return;
    if (instant) {
      if (gain) { gain.gain.cancelScheduledValues(0); gain.gain.value = 0; } else { clearInterval(vt); audio.volume = 0; }
      audio.pause();
    } else {
      fade(0, 0.5);
      offTimer = setTimeout(function () { if (!allowed()) audio.pause(); }, 550);
    }
  }
  function sync() {
    if (allowed()) {
      clearTimeout(offTimer);
      if (audio.paused) { play(); setTimeout(function () { if (allowed() && !running()) arm(); }, 600); }
      else fade(VOL, 1.5);
    } else hush(document.hidden);
  }
  document.addEventListener('visibilitychange', sync);
  addEventListener('pagehide', function () { hush(true); });
  addEventListener('pageshow', function (e) { if (e.persisted) sync(); });
  if (revBox) revBox.addEventListener('change', sync);

  if (wantOn) { play(); arm(); } /* сработает, если браузер разрешит; иначе — при первом касании */
})();
