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
  'group relative inline-flex h-10 sm:h-11 items-center overflow-hidden rounded-[9999px] bg-ink px-5 text-sm font-medium text-white transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal shadow-[0_0_8px_rgba(47,107,255,0.18),0_0_16px_rgba(31,84,214,0.1),0_0_24px_rgba(17,197,212,0.05)] hover:shadow-[0_0_14px_rgba(47,107,255,0.32),0_0_28px_rgba(31,84,214,0.18),0_0_42px_rgba(17,197,212,0.1)] sm:shadow-[0_0_18px_rgba(47,107,255,0.35),0_0_36px_rgba(31,84,214,0.2),0_0_54px_rgba(17,197,212,0.1)] sm:hover:shadow-[0_0_28px_rgba(47,107,255,0.6),0_0_56px_rgba(31,84,214,0.35),0_0_84px_rgba(17,197,212,0.2)]';

function GlowContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-signal via-signal-dark to-cyan-motion opacity-40 transition-opacity duration-300 group-hover:opacity-60"
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
