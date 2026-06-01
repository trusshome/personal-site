'use client';

import { usePathname } from 'next/navigation';
import Nav from '@/components/Nav';

// The hero page runs a full bleed shader background, so it drops the top nav.
// Every other page keeps the fixed Nav plus a spacer that reserves its height.
export default function SiteHeader() {
  const pathname = usePathname();
  if (pathname === '/') return null;
  return (
    <>
      <Nav />
      <div className="h-16" aria-hidden />
    </>
  );
}
