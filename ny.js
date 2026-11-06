/* Новогоднее настроение для визитки: снежок + лёгкая музыка.
   Подключение: перед </body> в index.html добавить одну строку:
   <script src="ny.js" defer></script>
   Файл ny-music.mp3 должен лежать в той же папке, что и ny.js (адрес музыки берётся от места, где лежит ny.js).
   Сам включается с 1 декабря по 10 января. Проверить сейчас: добавить к адресу ?ny=1
   Выключить совсем: удалить эту строку из index.html. */
(function () {
  var START = { m: 12, d: 1 }, END = { m: 1, d: 10 };
  var SCRIPT = document.currentScript && document.currentScript.src;
  var MUSIC = SCRIPT ? new URL('ny-music.mp3', SCRIPT).href : 'ny-music.mp3';

  var now = new Date(), m = now.getMonth() + 1, d = now.getDate();
  var inWindow = (m === 12 && d >= START.d) || (m === 1 && d <= END.d);
  var forced = /[?&]ny=1\b/.test(location.search);
  if (!inWindow && !forced) return;

  function isDark() {
    var r = document.documentElement.getAttribute('data-theme');
    if (r) return r === 'dark';
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /* ---------- снег ---------- */
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
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



  /* ---------- снеговичок с метёлкой ---------- */
  if (!reduce) {
    var st = document.createElement('style');
    st.textContent =
      '@keyframes ny-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}' +
      '@keyframes ny-sweep{0%,100%{transform:rotate(-14deg)}50%{transform:rotate(12deg)}}' +
      '@keyframes ny-puff{0%{opacity:0;transform:translate(0,0) scale(.5)}30%{opacity:.9}100%{opacity:0;transform:translate(-9px,-7px) scale(1.2)}}' +
      '.ny-man{position:fixed;left:0;bottom:calc(4px + env(safe-area-inset-bottom,0px));width:56px;height:63px;z-index:45;pointer-events:none;will-change:transform}' +
      '.ny-man .flip{width:100%;height:100%}' +
      '.ny-man svg{display:block;width:100%;height:100%;animation:ny-bob .55s ease-in-out infinite}' +
      '.ny-man .broom{transform-origin:42px 38px;transform-box:view-box;animation:ny-sweep 1.1s ease-in-out infinite}' +
      '.ny-man .puff{transform-box:fill-box;transform-origin:center;animation:ny-puff 1.1s ease-out infinite}';
    document.head.appendChild(st);
    var man = document.createElement('div');
    man.className = 'ny-man';
    man.setAttribute('aria-hidden', 'true');
    man.innerHTML =
      '<div class="flip"><svg viewBox="0 0 64 72" xmlns="http://www.w3.org/2000/svg">' +
      '<g stroke="#9DB4CE" stroke-width="1.2">' +
      '<circle cx="30" cy="57" r="14" fill="#fff"/><circle cx="30" cy="37" r="10.5" fill="#fff"/><circle cx="30" cy="21" r="8.5" fill="#fff"/></g>' +
      '<rect x="22" y="9" width="16" height="3" rx="1" fill="#4A3A33"/><rect x="25" y="1" width="10" height="9" rx="1.5" fill="#4A3A33"/>' +
      '<circle cx="27" cy="20" r="1.1" fill="#4A3A33"/><circle cx="33.5" cy="20" r="1.1" fill="#4A3A33"/>' +
      '<path d="M30 23l9 2.2-9 1.4z" fill="#E8833A"/>' +
      '<path d="M22 28q8 4 16 0" stroke="#B8553A" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
      '<circle cx="30" cy="38" r="1.2" fill="#4A3A33"/><circle cx="30" cy="44" r="1.2" fill="#4A3A33"/>' +
      '<path d="M20 36L10 30M20 33l-3-5M20 33l-1-6" stroke="#6B4A33" stroke-width="1.6" stroke-linecap="round" fill="none"/>' +
      '<g class="broom"><path d="M42 38L53 64" stroke="#8A5A33" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M49 59l9 4-3 7-9-3z" fill="#D9A441" stroke="#A97A25" stroke-width=".8"/>' +
      '<path d="M40 38l2 0" stroke="#6B4A33" stroke-width="1.6" stroke-linecap="round"/></g>' +
      '<g fill="#fff" stroke="#C6D4E6" stroke-width=".6"><circle class="puff" cx="58" cy="67" r="2"/>' +
      '<circle class="puff" cx="56" cy="69" r="1.5" style="animation-delay:.35s"/><circle class="puff" cx="60" cy="69" r="1.7" style="animation-delay:.7s"/></g>' +
      '</svg></div>';
    document.body.appendChild(man);
    var flip = man.firstChild, mx = 8, dir = 1, last = 0, SPEED = 26;
    function walk(ts) {
      if (document.hidden) { last = 0; return; }
      if (!last) last = ts;
      var dt = Math.min((ts - last) / 1000, 0.1); last = ts;
      var maxX = Math.max(20, innerWidth - 64);
      mx += dir * SPEED * dt;
      if (mx >= maxX) { mx = maxX; dir = -1; }
      if (mx <= 4) { mx = 4; dir = 1; }
      man.style.transform = 'translateX(' + mx.toFixed(1) + 'px)';
      flip.style.transform = dir === 1 ? 'none' : 'scaleX(-1)';
      requestAnimationFrame(walk);
    }
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) { last = 0; requestAnimationFrame(walk); }
    });
    requestAnimationFrame(walk);
  }

  /* ---------- надпись сверху ---------- */
  var home = document.getElementById('home');
  if (home) {
    var txt = (m === 12) ? 'С наступающим Новым годом!' : 'С Новым годом!';
    var hi = document.createElement('div');
    hi.textContent = '\u2744 ' + txt + ' \u2744';
    hi.setAttribute('aria-hidden', 'true');
    hi.style.cssText = 'position:absolute;top:10px;left:0;right:0;text-align:center;font-size:13px;font-weight:600;letter-spacing:.02em;color:var(--terra-deep,#8A3F29);pointer-events:none';
    if (getComputedStyle(home).position === 'static') home.style.position = 'relative';
    home.insertBefore(hi, home.firstChild);
  }

  /* ---------- музыка ---------- */
  var audio = new Audio(MUSIC);
  audio.loop = true; audio.volume = 0.6; audio.preload = 'auto';
  var wantOn = true, started = false;
  try { if (localStorage.getItem('ny-music') === 'off') wantOn = false; } catch (e) {}

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.style.cssText = 'position:fixed;right:14px;bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:60;width:44px;height:44px;border-radius:50%;border:1px solid var(--line,#E3D2BF);background:var(--sand,#EFE2D2);color:var(--terra-deep,#8A3F29);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;-webkit-tap-highlight-color:transparent';
  var on = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>';
  var off = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/><path d="M3 3l18 18"/></svg>';
  function paint() {
    var playing = wantOn;
    btn.innerHTML = playing ? on : off;
    btn.setAttribute('aria-label', playing ? 'Выключить музыку' : 'Включить музыку');
  }
  function play() {
    var p = audio.play();
    if (p && p.then) p.then(function () { started = true; }, function () {});
  }
  paint();
  document.body.appendChild(btn);

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    wantOn = !wantOn;
    try { localStorage.setItem('ny-music', wantOn ? 'on' : 'off'); } catch (er) {}
    if (wantOn) play(); else audio.pause();
    paint();
  });

  if (wantOn) {
    play(); /* сработает, если браузер разрешит; иначе — при первом касании */
    var first = function () {
      if (wantOn && audio.paused) play();
      ['pointerdown', 'touchend', 'click', 'keydown'].forEach(function (ev) {
        document.removeEventListener(ev, first, true);
      });
    };
    ['pointerdown', 'touchend', 'click', 'keydown'].forEach(function (ev) {
      document.addEventListener(ev, first, true);
    });
  }
})();
