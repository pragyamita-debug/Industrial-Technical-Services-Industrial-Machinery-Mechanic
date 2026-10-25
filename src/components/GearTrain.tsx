import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Involute-ish spur gear outline centred on 0,0. All gears share one module (tooth size), so any two whose
 * centres sit (rA + rB) apart mesh properly.
 */
function gearPath(teeth: number, module: number) {
  const r = (teeth * module) / 2; // pitch radius
  const ra = r + module; // tip
  const rf = r - 1.25 * module; // root
  const step = (Math.PI * 2) / teeth;
  const pts: string[] = [];
  const P = (rad: number, ang: number) => `${(rad * Math.cos(ang)).toFixed(2)},${(rad * Math.sin(ang)).toFixed(2)}`;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    // root → flank up → flat tip → flank down → root, with the tip narrower than the base
    // chunky industrial teeth: wide base, slightly narrower flat top, with a step at the pitch line for a chamfered look
    pts.push(P(rf, a - step * 0.5), P(rf, a - step * 0.29), P(r, a - step * 0.24), P(ra, a - step * 0.17), P(ra, a + step * 0.17), P(r, a + step * 0.24), P(rf, a + step * 0.29));
  }
  return `M${pts.join(' L')} Z`;
}

interface Gear {
  teeth: number;
  x: number;
  y: number;
  /** spokes cut out of the web */
  spokes: number;
}

const MODULE = 20;
const radius = (g: Gear) => (g.teeth * MODULE) / 2;

/** Three gears in a meshing train; positions are computed so every pair is exactly in mesh. */
function layout(): (Gear & { dir: number; ratio: number; phase: number })[] {
  const a: Gear = { teeth: 24, x: 0, y: 0, spokes: 5 };
  const b: Gear = { teeth: 13, x: 0, y: 0, spokes: 4 };
  const c: Gear = { teeth: 17, x: 0, y: 0, spokes: 5 };
  const angAB = (205 * Math.PI) / 180;
  b.x = a.x + (radius(a) + radius(b)) * Math.cos(angAB);
  b.y = a.y + (radius(a) + radius(b)) * Math.sin(angAB);
  const angBC = (128 * Math.PI) / 180;
  c.x = b.x + (radius(b) + radius(c)) * Math.cos(angBC);
  c.y = b.y + (radius(b) + radius(c)) * Math.sin(angBC);
  // Neighbours turn the opposite way at the inverse tooth ratio. Phase: when the driver has a tooth on the line
  // of centres (angle φ), the driven gear must show a gap there (φ + 180° in its own frame, half a tooth off).
  const phiAB = 205;
  const phiBC = 128;
  const pB = phiAB + 180 - 180 / b.teeth + (a.teeth / b.teeth) * phiAB;
  const pC = phiBC + 180 - 180 / c.teeth + (b.teeth / c.teeth) * (phiBC - pB);
  return [
    { ...a, dir: 1, ratio: 1, phase: 0 },
    { ...b, dir: -1, ratio: a.teeth / b.teeth, phase: pB },
    { ...c, dir: 1, ratio: a.teeth / c.teeth, phase: pC },
  ];
}

const GEARS = layout();

/**
 * Brushed-steel gears with an orange rim light, meshing and turning. The drive speeds up briefly while the page
 * scrolls, like the machine is being driven by it. Pauses off-screen; still under reduced motion.
 */
export function GearTrain() {
  const svg = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const groups = Array.from(el.querySelectorAll<SVGGElement>('[data-gear]'));
    let angle = 0;
    let boost = 0;
    let lastY = window.scrollY;
    let raf = 0;
    let last = 0;
    let running = false;
    const lights = Array.from(el.querySelectorAll<SVGGElement>('[data-light]'));
    const apply = () =>
      groups.forEach((g, i) => {
        const d = GEARS[i];
        const rot = (d.phase + angle * d.ratio * d.dir) % 360;
        g.setAttribute('transform', `translate(${d.x} ${d.y}) rotate(${rot.toFixed(3)})`);
        // the rim light counter-rotates, so it stays fixed in the room while the steel turns under it
        lights[i]?.setAttribute('transform', `rotate(${(-rot).toFixed(3)})`);
      });
    apply();
    if (reduced) return;
    const loop = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      const y = window.scrollY;
      boost = Math.min(160, boost + Math.abs(y - lastY) * 0.6);
      lastY = y;
      boost *= 0.94;
      angle += dt * (9 + boost);
      apply();
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        last = 0;
        raf = requestAnimationFrame(loop);
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const pad = 40;
  const xs = GEARS.flatMap((g) => [g.x - radius(g) - MODULE - pad, g.x + radius(g) + MODULE + pad]);
  const ys = GEARS.flatMap((g) => [g.y - radius(g) - MODULE - pad, g.y + radius(g) + MODULE + pad]);
  const vb = `${Math.min(...xs)} ${Math.min(...ys)} ${Math.max(...xs) - Math.min(...xs)} ${Math.max(...ys) - Math.min(...ys)}`;

  return (
    <svg ref={svg} className="geartrain" viewBox={vb} aria-hidden>
      <defs>
        {/* brushed steel: a cool metal ramp plus fine concentric-ish streaks */}
        <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d4d6da" />
          <stop offset="0.2" stopColor="#7a7d83" />
          <stop offset="0.42" stopColor="#2f3135" />
          <stop offset="0.58" stopColor="#9a9da3" />
          <stop offset="0.76" stopColor="#26272b" />
          <stop offset="1" stopColor="#0f1012" />
        </linearGradient>
        <pattern id="brush" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <rect width="6" height="6" fill="transparent" />
          <rect width="6" height="0.8" fill="rgba(255,255,255,0.08)" />
        </pattern>
        {/* fixed light coming from the lower right — it stays put while the gears turn under it */}
        <radialGradient id="rim" cx="0.82" cy="0.78" r="0.7">
          <stop offset="0" stopColor="#ffb27a" stopOpacity="0.95" />
          <stop offset="0.3" stopColor="#ff5a1f" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ff5a1f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0.3" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.42" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="gear-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#000" floodOpacity="0.75" />
        </filter>
        {GEARS.map((g, i) => (
          <mask id={`gm-${i}`} key={i}>
            <path d={gearPath(g.teeth, MODULE)} fill="#fff" />
            {/* web cut-outs between the spokes, and the bore */}
            {Array.from({ length: g.spokes }, (_, k) => {
              const r0 = radius(g) * 0.34;
              const r1 = radius(g) * 0.72;
              const a0 = (k / g.spokes) * Math.PI * 2 + 0.16;
              const a1 = ((k + 1) / g.spokes) * Math.PI * 2 - 0.16;
              const p = (r: number, a: number) => `${r * Math.cos(a)},${r * Math.sin(a)}`;
              return <path key={k} d={`M${p(r0, a0)} L${p(r1, a0)} A${r1},${r1} 0 0 1 ${p(r1, a1)} L${p(r0, a1)} A${r0},${r0} 0 0 0 ${p(r0, a0)} Z`} fill="#000" />;
            })}
            <circle r={radius(g) * 0.13} fill="#000" />
          </mask>
        ))}
      </defs>
      {GEARS.map((g, i) => (
        <g key={i} data-gear filter="url(#gear-shadow)">
          <g mask={`url(#gm-${i})`}>
            <circle r={radius(g) + MODULE * 1.2} fill="url(#steel)" />
            <circle r={radius(g) + MODULE * 1.2} fill="url(#brush)" />
            {/* raised rim and hub */}
            {/* bevelled rim: dark groove, then a bright chamfer edge */}
            <circle r={radius(g) * 0.8} fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth={MODULE * 1.1} />
            <circle r={radius(g) * 0.8 + MODULE * 0.55} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
            <circle r={radius(g) * 0.34} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth={MODULE * 0.7} />
            <circle r={radius(g) * 0.26} fill="#1c1d20" stroke="#9a9da3" strokeWidth="2.5" />
            <circle r={radius(g) * 0.13 + 3} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
            <g data-light>
              <circle r={radius(g) + MODULE * 1.2} fill="url(#rim)" style={{ mixBlendMode: 'screen' }} />
              <circle r={radius(g) + MODULE * 1.2} fill="url(#sheen)" style={{ mixBlendMode: 'screen' }} />
            </g>
          </g>
          <path d={gearPath(g.teeth, MODULE)} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />
        </g>
      ))}
    </svg>
  );
}
