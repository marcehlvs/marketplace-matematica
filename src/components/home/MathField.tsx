import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

interface Curve {
  fn: (x: number, t: number, m: number) => number;
  color: string;
}

const SPAN = 14; // unidades de x visibles en pantalla

const curves: Curve[] = [
  { fn: (x, t, m) => Math.sin(x * 0.9 + t * 0.6) * (1.1 + m * 1.3), color: '#d4d4d8' },
  { fn: (x, t) => 0.16 * x * x - 2.8 + Math.sin(t * 0.4) * 0.6, color: '#737373' },
  { fn: (x, t, m) => (m - 0.5) * 1.8 * x + Math.cos(t * 0.5) * 0.5, color: '#a3a3a3' },
];

/**
 * Fondo animado: cuadrícula, ejes y funciones que se mueven. Reacciona al mouse.
 * Se pausa fuera de pantalla y con "reducir movimiento" dibuja un solo cuadro.
 */
export function MathField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let onScreen = true;
    const pointer = { x: 0.5, tx: 0.5 };

    const draw = (time: number) => {
      const t = time / 1000;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      ctx.clearRect(0, 0, w, h);

      const unit = w / SPAN;
      const cx = w / 2;
      const cy = h * 0.56;

      // Cuadrícula
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.beginPath();
      for (let gx = cx % unit; gx <= w; gx += unit) {
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
      }
      for (let gy = cy % unit; gy <= h; gy += unit) {
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
      }
      ctx.stroke();

      // Ejes
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, h);
      ctx.stroke();

      // Funciones con brillo y un punto que las recorre
      curves.forEach((c, i) => {
        ctx.save();
        ctx.strokeStyle = c.color;
        ctx.shadowColor = c.color;
        ctx.shadowBlur = 16;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const steps = Math.ceil(w / 6);
        for (let s = 0; s <= steps; s++) {
          const px = (s / steps) * w;
          const y = c.fn((px - cx) / unit, t, pointer.x);
          const py = cy - y * unit;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        const dx = Math.sin(t * 0.35 + i * 2.1) * SPAN * 0.4;
        const dy = c.fn(dx, t, pointer.x);
        ctx.shadowBlur = 24;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx + dx * unit, cy - dy * unit, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) draw(2500);
    };

    const loop = (time: number) => {
      if (onScreen && !document.hidden) draw(time);
      raf = requestAnimationFrame(loop);
    };

    const onPointer = (e: PointerEvent) => {
      pointer.tx = e.clientX / window.innerWidth;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    visibility.observe(canvas);
    resize();

    if (!reduce) {
      window.addEventListener('pointermove', onPointer, { passive: true });
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      resizeObserver.disconnect();
      visibility.disconnect();
    };
  }, [reduce]);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
