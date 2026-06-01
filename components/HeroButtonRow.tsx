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

const GLOW_CLS =
  'group relative inline-flex h-10 sm:h-11 w-full items-center justify-center overflow-hidden rounded-[9999px] bg-ink px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-white transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal [transform:translateZ(0)]';

function GlowGradient() {
  return (
    <span
      aria-hidden
      className="absolute inset-0 bg-gradient-to-r from-signal via-signal-dark to-cyan-motion opacity-50 blur transition-opacity duration-500 group-hover:opacity-90"
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
    <motion.div ref={ref} style={{ scale }} className="w-full sm:w-auto">
      {children}
    </motion.div>
  );
}

type Panel = 'none' | 'book' | 'projects' | 'data';

interface HeroButtonRowProps {
  className?: string;
  activePanel: Panel;
  onProjectsToggle: () => void;
  onDataToggle: () => void;
  onBookToggle: () => void;
}

export default function HeroButtonRow({
  className,
  activePanel,
  onProjectsToggle,
  onDataToggle,
  onBookToggle,
}: HeroButtonRowProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-8 ${className ?? ''}`}
    >
      <DockButton mouseX={mouseX}>
        <button
          onClick={onProjectsToggle}
          aria-expanded={activePanel === 'projects'}
          className={GLOW_CLS}
        >
          <GlowGradient />
          <span className="relative flex items-center gap-2">
            Projects
            <ArrowUpRight aria-hidden className="h-3.5 w-3.5 text-white/90" />
          </span>
        </button>
      </DockButton>

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
        <GlowLink href={site.linkedin} external className="px-6 py-3 text-base">
          Find Me
        </GlowLink>
      </DockButton>
    </motion.div>
  );
}
