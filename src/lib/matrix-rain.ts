const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01ACWATLE>$_';

export function showMatrixRain(durationMs = 5000): void {
  if (typeof document === 'undefined') return;
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position:fixed;inset:0;z-index:9999;pointer-events:none;
    background:rgba(11,16,24,0.85);
  `;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;
  const dpr = window.devicePixelRatio || 1;

  function resize() {
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
  }
  resize();
  window.addEventListener('resize', resize);

  const fontSize = 16 * dpr;
  const cols = Math.floor(canvas.width / fontSize);
  const drops = new Array(cols).fill(0).map(() => Math.random() * -50);

  ctx.font = `${fontSize}px ui-monospace, monospace`;

  let raf = 0;
  const start = performance.now();
  function frame(t: number) {
    ctx.fillStyle = 'rgba(11,16,24,0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#34d399';
    for (let i = 0; i < cols; i++) {
      const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
      ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
      drops[i] += 1;
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
    }
    if (t - start < durationMs) {
      raf = requestAnimationFrame(frame);
    } else {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.remove();
    }
  }
  raf = requestAnimationFrame(frame);
}
