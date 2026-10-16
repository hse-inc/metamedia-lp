/* 案件だけの動き（骨格の swipe.js は直さない）
 * 1. 色の線：.streaks の中に角丸の棒を並べる（左下→右上。ページに入ると順に伸びる＝style.css の .page.is-active .streak）
 * 2. 写真の帯：.reel__track に写真を2周ぶん並べ、止まらず横へ流す
 */
(() => {
  const KINDS = ['streak--purple', 'streak--cyan', 'streak--lilac', 'streak--gray', 'streak--sky', 'streak--violet', 'streak--cyan', 'streak--purple', 'streak--gray'];
  const N = 66, NS = 'http://www.w3.org/2000/svg';
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
    for (let i = 0; i < N; i++) {
      const t = ((i * 29) % N) / (N - 1);
      const ang = (4 + t * 82 - (((i * 7) % 5) - 2) * 0.8) * Math.PI / 180;
      const short = i % 5 === 4;
      const ox = W * (-7 + ((i * 17) % 9)) / 100, oy = H * (99 + ((i * 13) % 8)) / 100;
      const len = D * (short ? 0.35 + ((i * 23) % 60) / 200 : 0.75 + ((i * 41) % 110) / 200);
      const w = 6 + ((i * 11) % 26), w0 = w * 0.08;
      const ux = Math.cos(ang), uy = -Math.sin(ang), px = -uy, py = ux;
      const tx = ox + ux * len, ty = oy + uy * len;
      const pts = [[ox + px * w0 / 2, oy + py * w0 / 2], [tx + px * w / 2, ty + py * w / 2], [tx - px * w / 2, ty - py * w / 2], [ox - px * w0 / 2, oy - py * w0 / 2]];
      const poly = document.createElementNS(NS, 'polygon');
      poly.setAttribute('class', 'streak ' + KINDS[(i * 4) % KINDS.length]);
      poly.setAttribute('points', pts.map((q) => q.map((n) => n.toFixed(1)).join(',')).join(' '));
      layers[short || i % 3 === 0 ? 1 : 0].appendChild(poly);
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
      const SPARKS = [[78, 14, 14, '--color-purple', 0], [92, 34, 10, '--color-cyan', 600], [58, 6, 9, '--color-cyan', 1200], [86, 56, 12, '--color-lilac', 300], [70, 26, 7, '--color-violet', 900]];
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
        img.src = src + '?v=20261016d';
        img.alt = '';
        img.decoding = 'async';
        track.appendChild(img);
      });
    });
  });
})();
