'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

type GlowLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** External links open in a new tab with rel safety. */
  external?: boolean;
  onClick?: () => void;
};

// Shared visual for every glow button. CTAButton wraps this with the cal link
// and analytics, the hero uses it directly for Projects and Find Me.
const base =
  'group relative inline-flex h-11 items-center overflow-hidden rounded-[9999px] bg-ink px-5 text-sm font-medium text-white transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal [transform:translateZ(0)]';

function GlowContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-signal via-signal-dark to-cyan-motion opacity-50 blur transition-opacity duration-500 group-hover:opacity-90"
      />
      <span className="relative flex items-center gap-2">
        {children}
        <ArrowUpRight aria-hidden className="h-3.5 w-3.5 text-white/90" />
      </span>
    </>
  );
}

export default function GlowLink({ href, children, className, external, onClick }: GlowLinkProps) {
  const cls = `${base} ${className ?? ''}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={cls}>
        <GlowContent>{children}</GlowContent>
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick} className={cls}>
      <GlowContent>{children}</GlowContent>
    </Link>
  );
}
