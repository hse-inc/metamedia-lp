/* 案件だけの動き（骨格の swipe.js は直さない）
 * 1. 色の線：.streaks の中に角丸の棒を並べる（左下→右上。ページに入ると順に伸びる＝style.css の .page.is-active .streak）
 * 2. 写真の帯：.reel__track に写真を2周ぶん並べ、止まらず横へ流す
 */
(() => {
  const KINDS = ['streak--purple', 'streak--cyan', 'streak--lilac', 'streak--gray', 'streak--sky', 'streak--violet', 'streak--cyan', 'streak--purple', 'streak--gray'];
  const N = 66;
  document.querySelectorAll('.streaks').forEach((box) => {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < N; i++) {
      const s = document.createElement('span');
      s.className = 'streak ' + KINDS[(i * 4) % KINDS.length];
      const t = ((i * 29) % N) / (N - 1);
      const ang = -(4 + t * 82) + (((i * 7) % 5) - 2) * 0.8;
      const short = i % 5 === 4;
      s.style.setProperty('--a', ang.toFixed(1) + 'deg');
      s.style.setProperty('--x', (-7 + ((i * 17) % 9)) + '%');
      s.style.setProperty('--y', (99 + ((i * 13) % 8)) + '%');
      s.style.setProperty('--len', (short ? 70 + ((i * 23) % 60) : 150 + ((i * 41) % 110)) + '%');
      s.style.setProperty('--w', (6 + ((i * 11) % 26)) + 'px');
      s.style.setProperty('--d', Math.round(40 + (((i * 53) % N) / N) * 650) + 'ms');
      frag.appendChild(s);
    }
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
        img.src = src + '?v=20261016b';
        img.alt = '';
        img.decoding = 'async';
        track.appendChild(img);
      });
    });
  });
})();
