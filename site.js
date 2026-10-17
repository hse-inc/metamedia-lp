/* 案件だけの動き（骨格の swipe.js は直さない）
 * 1. 色の線：.streaks の中に、ほぼ平行な斜めの角丸の棒を並べて画面を埋める（ページに入ると絵ごと左下から広がる）
 * 2. 写真の帯：.reel__track に写真を2周ぶん並べ、止まらず横へ流す
 * 3. PC の左右の帯：流れる輪郭の英字と大きなページ番号
 */
(() => {
  const KINDS = ['streak--purple', 'streak--cyan', 'streak--lilac', 'streak--gray', 'streak--sky', 'streak--cyan', 'streak--purple', 'streak--lilac', 'streak--gray'];
  const NS = 'http://www.w3.org/2000/svg';
  const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  const draw = (box) => {
    const W = box.clientWidth || 390, H = box.clientHeight || 664, D = Math.hypot(W, H);
    box.querySelectorAll('.streaks__layer').forEach((l) => l.remove());
    const layers = [0, 1].map((k) => {
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('class', k ? 'streaks__layer streaks__layer--b' : 'streaks__layer');
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.setAttribute('preserveAspectRatio', 'none');
      return svg;
    });
    const LANES = Math.round(D / 17);
    let n = 0;
    for (let k = 0; k < LANES; k++) {
      const v = k / (LANES - 1);
      const ang = (40 - v * 12 + (hash(k) - 0.5) * 4) * Math.PI / 180;
      const ux = Math.cos(ang), uy = -Math.sin(ang), px = -uy, py = ux;
      const off = (v - 0.5) * D * 1.05;
      const cx = W / 2 + px * off, cy = H / 2 + py * off;
      let t = -D * 0.6 + hash(k + 50) * D * 0.25;
      while (t < D * 0.6) {
        const short = hash(n + 7) < 0.35;
        const len = D * (short ? 0.05 + hash(n + 3) * 0.1 : 0.18 + hash(n + 5) * 0.4);
        const w = 4 + Math.round(hash(n + 11) * 11);
        const line = document.createElementNS(NS, 'line');
        line.setAttribute('class', 'streak ' + KINDS[Math.floor(hash(n + 13) * KINDS.length)]);
        line.setAttribute('x1', (cx + ux * t).toFixed(1)); line.setAttribute('y1', (cy + uy * t).toFixed(1));
        line.setAttribute('x2', (cx + ux * (t + len)).toFixed(1)); line.setAttribute('y2', (cy + uy * (t + len)).toFixed(1));
        line.setAttribute('stroke-width', w);
        layers[hash(n + 17) < 0.35 ? 1 : 0].appendChild(line);
        t += len + D * (0.03 + hash(n + 19) * 0.12);
        n++;
      }
    }
    layers.forEach((l) => box.prepend(l));
  };
  const boxes = [...document.querySelectorAll('.streaks')];
  boxes.forEach(draw);
  let resizeT = 0;
  window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(() => boxes.forEach(draw), 200); });
  boxes.forEach((box) => {
    const frag = document.createDocumentFragment();
    if (box.closest('.page--msg')) {
      const SPARKS = [[78, 14, 14, '--color-purple', 0], [92, 34, 10, '--color-cyan', 600], [58, 6, 9, '--color-cyan', 1200], [86, 56, 12, '--color-lilac', 300], [70, 26, 7, '--color-lilac', 900]];
      SPARKS.forEach(([x, y, size, c, d]) => {
        const k = document.createElement('span');
        k.className = 'spark';
        k.style.setProperty('--x', x + '%'); k.style.setProperty('--y', y + '%');
        k.style.setProperty('--s', size + 'px'); k.style.setProperty('--c', `var(${c})`);
        k.style.setProperty('--d', (2000 + d) + 'ms');
        frag.appendChild(k);
      });
    }
    box.appendChild(frag);
  });

  const PHOTOS = ['assets/photo-2.jpg', 'assets/photo-3.jpg', 'assets/photo-4.jpg', 'assets/photo-1.jpg'];
  document.querySelectorAll('.reel').forEach((reel) => {
    reel.querySelectorAll('.reel__track').forEach((track, row) => {
      const list = [...PHOTOS.slice(row * 2), ...PHOTOS.slice(0, row * 2)];
      [...list, ...list].forEach((src) => {
        const img = document.createElement('img');
        img.className = 'reel__img';
        img.src = src + '?v=20261017l';
        img.alt = '';
        img.width = 640; img.height = 480;
        img.decoding = 'async';
        track.appendChild(img);
      });
      const fit = () => {
        const dist = Math.round((track.scrollWidth - 10) / 2);
        if (dist < 50) return;
        track.style.setProperty('--reel-dist', `-${dist}px`);
        track.style.setProperty('--reel-speed', `${(dist / 30).toFixed(1)}s`);
        track.classList.add('is-ready');
      };
      Promise.all([...track.querySelectorAll('img')].map((im) => (im.decode ? im.decode().catch(() => {}) : Promise.resolve()))).then(fit);
      let rt = 0;
      window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(fit, 300); });
    });
  });

  const WORDS = "DX-CHEFF'S — METAMEDIA RECRUIT — ";
  const ticker = (rail, pos) => {
    const el = document.createElement('div');
    el.className = pos === 'top' ? 'rail-ticker rail-ticker--top' : 'rail-ticker rail-ticker--bottom';
    el.setAttribute('aria-hidden', 'true');
    el.dataset.t = WORDS.repeat(2);
    rail.append(el);
  };
  const left = document.querySelector('.rail--left');
  const right = document.querySelector('.rail--right');
  if (left) { ticker(left, 'top'); ticker(left, 'bottom'); }
  if (right) {
    ticker(right, 'bottom');
    const big = document.createElement('p');
    big.className = 'rail-big';
    big.setAttribute('aria-hidden', 'true');
    right.append(big);
    const now = document.querySelector('.rail-side__now');
    const sync = () => {
      if (!now || big.textContent === now.textContent) return;
      big.textContent = now.textContent;
      big.classList.remove('is-change'); void big.offsetWidth; big.classList.add('is-change');
    };
    sync();
    if (now) new MutationObserver(sync).observe(now, { childList: true, characterData: true, subtree: true });
  }
})();
