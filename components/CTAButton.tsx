'use client';

import GlowLink from '@/components/GlowLink';
import { site } from '@/lib/site';
import { trackBookACall } from '@/lib/analytics';

type CTAButtonProps = {
  className?: string;
  children?: React.ReactNode;
  /** Where this CTA sits, so the conversion event records which one converted. */
  location?: string;
};

// The one Book a call. Delegates the glow visual to GlowLink, keeps the cal link
// and the conversion event here so the funnel stays single-sourced.
export default function CTAButton({ className, children = 'Book', location }: CTAButtonProps) {
  return (
    <GlowLink href={site.cal} external className={className} onClick={() => trackBookACall(location)}>
      {children}
    </GlowLink>
  );
}
