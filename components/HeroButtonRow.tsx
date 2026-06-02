'use client';

import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import GlowLink from '@/components/GlowLink';
import { site } from '@/lib/site';

// Glow comes from box-shadow (not filter:blur on a child) so iOS Safari
// clips it correctly to the pill border-radius without any overflow issue.
const GLOW_CLS =
  'group relative inline-flex h-10 sm:h-11 items-center justify-center overflow-hidden rounded-[9999px] bg-ink px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-white transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal shadow-[0_0_8px_rgba(47,107,255,0.18),0_0_16px_rgba(31,84,214,0.1),0_0_24px_rgba(17,197,212,0.05)] hover:shadow-[0_0_14px_rgba(47,107,255,0.32),0_0_28px_rgba(31,84,214,0.18),0_0_42px_rgba(17,197,212,0.1)] sm:shadow-[0_0_18px_rgba(47,107,255,0.35),0_0_36px_rgba(31,84,214,0.2),0_0_54px_rgba(17,197,212,0.1)] sm:hover:shadow-[0_0_28px_rgba(47,107,255,0.6),0_0_56px_rgba(31,84,214,0.35),0_0_84px_rgba(17,197,212,0.2)]';

function GlowGradient() {
  return (
    <span
      aria-hidden
      className="absolute inset-0 bg-gradient-to-r from-signal via-signal-dark to-cyan-motion opacity-40 transition-opacity duration-300 group-hover:opacity-60"
    />
  );
}

function DockButton({
  mouseX,
  children,
}: {
  mouseX: MotionValue<number>;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const b = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - b.x - b.width / 2;
  });

  const scaleSync = useTransform(distance, [-220, 0, 220], [1, 1.08, 1]);
  const scale = useSpring(scaleSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div ref={ref} style={{ scale }}>
      {children}
    </motion.div>
  );
}

type Panel = 'none' | 'book' | 'data';

interface HeroButtonRowProps {
  className?: string;
  activePanel: Panel;
  onDataToggle: () => void;
  onBookToggle: () => void;
}

export default function HeroButtonRow({
  className,
  activePanel,
  onDataToggle,
  onBookToggle,
}: HeroButtonRowProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`flex items-center justify-center gap-2 sm:gap-8 ${className ?? ''}`}
    >
      <DockButton mouseX={mouseX}>
        <button
          onClick={onDataToggle}
          aria-expanded={activePanel === 'data'}
          className={GLOW_CLS}
        >
          <GlowGradient />
          <span className="relative flex items-center gap-2">
            Data
            <ArrowUpRight aria-hidden className="h-3.5 w-3.5 text-white/90" />
          </span>
        </button>
      </DockButton>

      <DockButton mouseX={mouseX}>
        <button
          onClick={onBookToggle}
          aria-expanded={activePanel === 'book'}
          aria-controls="booking-calendar"
          className={GLOW_CLS}
        >
          <GlowGradient />
          <span className="relative flex items-center gap-2">
            Book
            <ArrowUpRight aria-hidden className="h-3.5 w-3.5 text-white/90" />
          </span>
        </button>
      </DockButton>

      <DockButton mouseX={mouseX}>
        <GlowLink href={site.linkedin} external className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base">
          Find Me
        </GlowLink>
      </DockButton>
    </motion.div>
  );
}
