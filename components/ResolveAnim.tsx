'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useMotionValue, useSpring } from 'motion/react';

type Dot = {
  sx: number; // scattered x offset from the converge point, px
  sy: number;
  fx: number; // final x offset, a tight cluster at the point
  fy: number;
  size: number;
  delay: number;
  opacity: number;
};

// Geometry measured from the live layout. anchor is the Book a call button
// center in section coordinates. spread drives how far the scatter travels.
type Geo = {
  anchorX: number; // converge target, the button center in section coords
  anchorY: number;
  centerX: number; // scatter center, the section center in section coords
  centerY: number;
  spreadX: number; // full section box, so the scatter fills the whole hero
  spreadY: number;
  count: number;
};

const GOLDEN = 2.399963; // golden angle, gives an even scatter without clumping

function buildDots(geo: Geo): Dot[] {
  const { count, spreadX, spreadY, anchorX, anchorY, centerX, centerY } = geo;
  // The dots render relative to the container, which sits at the section center
  // so the collapse can rotate around that pivot. They scatter around the pivot
  // and converge to a tight cluster at the button, offset from it by boxOff.
  const boxOffX = anchorX - centerX;
  const boxOffY = anchorY - centerY;
  return Array.from({ length: count }, (_, i) => {
    const angle = i * GOLDEN;
    // sqrt spreads the dots evenly across the area instead of clumping center.
    const t = Math.sqrt((i + 0.5) / count);
    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);
    // Circular scatter. radius is the section half diagonal, so a round disk of
    // dots still reaches the corners while reading as a circle, not a boxy
    // rectangle. 1.15 adds a small bleed past the corners.
    const radius = Math.hypot(spreadX, spreadY) / 2;
    const r = t * radius * 1.15;
    return {
      sx: dirX * r,
      sy: dirY * r,
      fx: boxOffX + dirX * 6,
      fy: boxOffY + dirY * 6,
      size: 3 + (i % 3) * 2,
      // Continuous stagger by radius, outer dots lead, so the field collapses
      // as one smooth wave instead of the repeating pockets a modulo gave.
      delay: (1 - t) * 0.25,
      opacity: 0.4 + (i % 4) * 0.12,
    };
  });
}

export default function ResolveAnim() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [colors, setColors] = useState<{ scatter: string; resolved: string } | null>(null);

  // Drag follow. The cluster center tracks these spring values, which point at
  // the cursor while dragging and snap back to the button anchor (0,0) on release.
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const x = useSpring(tx, { stiffness: 260, damping: 28, mass: 0.6 });
  const y = useSpring(ty, { stiffness: 260, damping: 28, mass: 0.6 });

  // Read tokens and measure the section plus the Book a call button so the
  // convergence point sits behind the button and the scatter fills the page.
  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    setColors({
      scatter: root.getPropertyValue('--color-cyan-motion').trim(),
      resolved: root.getPropertyValue('--color-signal').trim(),
    });

    const measure = () => {
      const section = ref.current?.parentElement;
      if (!section) return;
      const sr = section.getBoundingClientRect();
      const cta = document.getElementById('hero-cta');
      const cr = cta?.getBoundingClientRect();
      // Fall back to section center if the button is not found.
      const anchorX = cr ? cr.left + cr.width / 2 - sr.left : sr.width / 2;
      const anchorY = cr ? cr.top + cr.height / 2 - sr.top : sr.height / 2;
      // Scatter fills the full section box and is centered on the section
      // center, so it covers the whole hero at any size. It converges to the
      // button anchor. Re-measured on resize, orientation, and font load.
      const wide = window.matchMedia('(min-width: 640px)').matches;
      setGeo({
        anchorX,
        anchorY,
        centerX: sr.width / 2,
        centerY: sr.height / 2,
        spreadX: sr.width,
        spreadY: sr.height,
        count: wide ? 360 : 150,
      });
    };

    // Measure after first paint, and again once web fonts swap in, since the
    // font swap changes the headline height and moves the button anchor.
    let raf = requestAnimationFrame(measure);
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  // Cursor follow: while the pointer moves over the hero, the cluster trails it
  // on a spring. When the pointer leaves the hero it springs back behind the
  // button. Fine pointer only, so touch scroll is never fought, and disabled
  // under reduced motion.
  useEffect(() => {
    if (reduce || !geo) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const section = ref.current?.parentElement;
    if (!section) return;

    const follow = (e: PointerEvent) => {
      const sr = section.getBoundingClientRect();
      tx.set(e.clientX - sr.left - geo.anchorX);
      ty.set(e.clientY - sr.top - geo.anchorY);
    };
    const reset = () => {
      tx.set(0);
      ty.set(0);
    };

    section.addEventListener('pointermove', follow);
    section.addEventListener('pointerleave', reset);
    section.addEventListener('pointercancel', reset);
    return () => {
      section.removeEventListener('pointermove', follow);
      section.removeEventListener('pointerleave', reset);
      section.removeEventListener('pointercancel', reset);
    };
  }, [reduce, geo, tx, ty]);

  // Decorative only. Nothing renders on the server, so the headline is the LCP
  // and never waits on the animation.
  if (!geo || !colors) return <div ref={ref} className="hidden" aria-hidden />;

  const dots = buildDots(geo);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute"
        style={{ left: geo.centerX, top: geo.centerY, x, y }}
        // Spin the whole field as it implodes so the dots spiral into the
        // point. Pivot is the section center. Skipped under reduced motion.
        initial={reduce ? false : { rotate: 140 }}
        animate={reduce ? false : { rotate: 0 }}
        transition={{ type: 'spring', duration: 1.6, bounce: 0 }}
      >
        {/* The resolved point, at the button, offset from the spin pivot. */}
        <span
          className="absolute block rounded-full bg-signal shadow-[0_0_18px_var(--color-signal)]"
          style={{
            left: geo.anchorX - geo.centerX,
            top: geo.anchorY - geo.centerY,
            width: 10,
            height: 10,
            marginLeft: -5,
            marginTop: -5,
            opacity: 0.9,
          }}
        />
        {dots.map((d, i) => {
          const common = {
            width: d.size,
            height: d.size,
            marginLeft: -d.size / 2,
            marginTop: -d.size / 2,
          };

          // Reduced motion: hold a static resolved state, no enter animation.
          if (reduce) {
            return (
              <span
                key={i}
                className="absolute block rounded-full"
                style={{
                  ...common,
                  backgroundColor: colors.resolved,
                  opacity: d.opacity,
                  transform: `translate(${d.fx}px, ${d.fy}px)`,
                }}
              />
            );
          }

          // Scatter in cyan-motion across the full page, converge to the point
          // behind the button fading to signal. backgroundColor is paint-only
          // (no reflow); position is transform only.
          return (
            <motion.span
              key={i}
              className="absolute block rounded-full"
              style={common}
              initial={{ x: d.sx, y: d.sy, opacity: 0, backgroundColor: colors.scatter }}
              animate={{ x: d.fx, y: d.fy, opacity: d.opacity, backgroundColor: colors.resolved }}
              transition={{
                // Position settles on a critically damped spring, smooth decel
                // into the point with no bounce. Opacity fades in quicker so
                // dots never pop, color crossfades over the full travel.
                default: { type: 'spring', duration: 1.3, bounce: 0, delay: d.delay },
                opacity: { duration: 0.5, delay: d.delay, ease: 'easeOut' },
                backgroundColor: { duration: 1.3, delay: d.delay, ease: 'easeInOut' },
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
