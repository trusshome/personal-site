'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Wordmark from '@/components/Wordmark';
import HeroButtonRow from '@/components/HeroButtonRow';
import GlassBookingCalendar from '@/components/GlassBookingCalendar';
import { ShaderAnimation } from '@/components/ShaderAnimation';
import { CircularGallery, type GalleryItem } from '@/components/ui/circular-gallery';

type Panel = 'none' | 'book' | 'projects' | 'data';

const galleryItems: GalleryItem[] = [
  {
    title: 'Inventory Dashboard',
    subtitle: 'Internal tool · 2025',
    label: 'Full-stack',
    photo: {
      url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=800&auto=format&fit=crop&q=80',
      alt: 'dashboard UI',
    },
  },
  {
    title: 'Route Optimizer',
    subtitle: 'Logistics · 2025',
    label: 'Backend',
    photo: {
      url: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=600&h=800&auto=format&fit=crop&q=80',
      alt: 'route map',
    },
  },
  {
    title: 'Booking Engine',
    subtitle: 'SaaS · 2025',
    label: 'Builder',
    photo: {
      url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=800&auto=format&fit=crop&q=80',
      alt: 'office laptop',
    },
  },
  {
    title: 'Fan Data Enrichment',
    subtitle: 'Sales demo · 2025',
    label: 'Data',
    photo: {
      url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=800&auto=format&fit=crop&q=80',
      alt: 'data chart',
    },
  },
  {
    title: 'Mobile Dispatch',
    subtitle: 'Field ops · 2025',
    label: 'Mobile',
    photo: {
      url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=800&auto=format&fit=crop&q=80',
      alt: 'mobile phone',
    },
  },
];

const dataItems: GalleryItem[] = [
  {
    title: 'Fan Enrichment',
    subtitle: 'Sports & entertainment',
    label: 'PDL use case',
    photo: {
      url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&h=800&auto=format&fit=crop&q=80',
      alt: 'stadium crowd',
    },
  },
  {
    title: 'Lead Intelligence',
    subtitle: 'B2B sales',
    label: 'PDL use case',
    photo: {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=800&auto=format&fit=crop&q=80',
      alt: 'laptop with analytics',
    },
  },
  {
    title: 'Talent Mapping',
    subtitle: 'Recruiting & HR',
    label: 'PDL use case',
    photo: {
      url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=800&auto=format&fit=crop&q=80',
      alt: 'team meeting',
    },
  },
  {
    title: 'Market Sizing',
    subtitle: 'Strategy & research',
    label: 'PDL use case',
    photo: {
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=800&auto=format&fit=crop&q=80',
      alt: 'data dashboard',
    },
  },
  {
    title: 'ICP Builder',
    subtitle: 'Go-to-market',
    label: 'PDL use case',
    photo: {
      url: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=800&auto=format&fit=crop&q=80',
      alt: 'data charts',
    },
  },
  {
    title: 'Network Graph',
    subtitle: 'Account strategy',
    label: 'PDL use case',
    photo: {
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=800&auto=format&fit=crop&q=80',
      alt: 'network connections',
    },
  },
];

const PANEL_ENTER = { type: 'spring', duration: 0.4, bounce: 0.1 } as const;
const PANEL_EXIT  = { duration: 0.15, ease: 'easeOut' } as const;

const PANEL_ANIM = {
  initial: { opacity: 0, y: -12, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: PANEL_ENTER },
  exit:    { opacity: 0, y: -6,  scale: 0.98, transition: PANEL_EXIT },
};

export default function HomePage() {
  const [panel, setPanel] = useState<Panel>('none');
  const [isMobile, setIsMobile] = useState(false);
  const toggle = (p: Panel) => setPanel((cur) => (cur === p ? 'none' : p));

  useEffect(() => {
    const mq = matchMedia('(max-width: 640px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // iOS 26 Liquid Glass: scroll into the runway once so Safari composites real
  // in-flow shader pixels behind its chrome, then block document scroll gestures
  // entirely. The runway must stay (Safari needs scrollY > 0), so rather than
  // letting the page scroll and snapping back (janky), we stop the gesture from
  // ever moving the document. Touches inside a scrollable panel are still
  // allowed, so the booking calendar and galleries scroll normally.
  useEffect(() => {
    const isMobile = matchMedia('(max-width: 760px)').matches;
    const offset = isMobile
      ? Number.parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--safari-scroll-offset'),
        ) || 0
      : 0;

    window.scrollTo({ top: offset, left: 0, behavior: 'instant' as ScrollBehavior });

    // Snap document scrollY back to the runway offset whenever anything moves it.
    // Two things can displace scrollY even with the touchmove lock in place:
    //   1. overscroll chaining when the user hits a scroll boundary inside an
    //      overflow container (handled partially by overscroll-behavior:contain,
    //      but iOS can still slip through on edge cases).
    //   2. iOS scrolling the document to bring a focused input into view when the
    //      virtual keyboard appears — this bypasses all touch event guards.
    const onScroll = () => {
      if (Math.abs(window.scrollY - offset) > 2) {
        window.scrollTo({ top: offset, left: 0, behavior: 'instant' as ScrollBehavior });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Allow the gesture only when it lands inside an element that can actually
    // scroll; block it (and thus the document scroll) otherwise.
    const onTouchMove = (e: TouchEvent) => {
      let el = e.target as HTMLElement | null;
      while (el && el !== document.documentElement) {
        const oy = getComputedStyle(el).overflowY;
        if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight) return;
        el = el.parentElement;
      }
      e.preventDefault();
    };

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      document.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div style={{ position: 'relative', display: 'flow-root' }}>
      {/* MEDIA STAGE. In normal flow (not fixed/absolute) so iOS 26 composites
          its real pixels behind the Safari chrome once scrolled. Bleeds above
          and below the visual viewport into the status bar and toolbar areas. */}
      <div
        aria-hidden
        style={{
          // 100lvh = the LARGEST viewport (bars retracted) so the stage is always
          // at least full screen plus bleed, regardless of bar state. Using 100dvh
          // here left a gap when the bars retracted and the viewport grew.
          height: 'calc(100lvh + var(--safari-top-bleed) + var(--safari-bottom-bleed))',
          marginTop: 'calc(-1 * var(--safari-top-bleed))',
        }}
      >
        <ShaderAnimation className="h-full w-full" />
      </div>

      {/* CONTENT OVERLAY. Fixed to the viewport. overflow:clip means this element
          is NEVER a scroll container — iOS cannot scroll it even if content
          overflows. All scrolling happens inside the calendar wrapper div below,
          which is the sole scroll container on the page. */}
      <section
          className="fixed inset-0 flex flex-col items-center justify-center px-4 sm:px-6 text-center"
          style={{
            zIndex: 1,
            overflowY: 'clip',
            paddingTop: 'calc(env(safe-area-inset-top) + 8px)',
            paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)',
          }}
        >
        <div className="relative z-10 flex flex-col items-center gap-0 w-full">
          <h1 className="font-display text-[1.75rem] font-medium tracking-tight sm:text-5xl lg:text-7xl whitespace-nowrap">
            <Wordmark dark />
          </h1>

          <HeroButtonRow
            className="mt-10"
            activePanel={panel}
            onProjectsToggle={() => toggle('projects')}
            onDataToggle={() => toggle('data')}
            onBookToggle={() => toggle('book')}
          />

          <motion.div
            layout
            transition={{ type: 'spring', duration: 0.35, bounce: 0 }}
            className="w-full"
          >
            <AnimatePresence>
              {panel === 'book' && (
                <motion.div
                  key="book"
                  {...PANEL_ANIM}
                  id="booking-calendar"
                  className="mt-6 w-full flex justify-center"
                >
                  {/* Scroll container scoped to the calendar so the outer fixed
                      section never overflows. If the section scrolled instead,
                      iOS Safari could let document scrollY escape the 62px
                      runway and break the Liquid Glass compositing. */}
                  <div
                    className="w-full overflow-y-auto"
                    style={{
                      maxHeight: 'calc(100dvh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 225px)',
                      overscrollBehavior: 'contain',
                    }}
                  >
                    <GlassBookingCalendar />
                  </div>
                </motion.div>
              )}
              {panel === 'projects' && (
                <motion.div
                  key="projects"
                  {...PANEL_ANIM}
                  className="mt-6 w-full h-[260px] sm:h-[500px]"
                >
                  <CircularGallery
                    items={galleryItems}
                    radius={isMobile ? 180 : 360}
                    cardWidth={isMobile ? 130 : 260}
                    cardHeight={isMobile ? 180 : 360}
                    autoRotateSpeed={0.04}
                    className="w-full h-full"
                  />
                </motion.div>
              )}
              {panel === 'data' && (
                <motion.div
                  key="data"
                  {...PANEL_ANIM}
                  className="mt-6 w-full h-[260px] sm:h-[500px]"
                >
                  <CircularGallery
                    items={dataItems}
                    radius={isMobile ? 180 : 360}
                    cardWidth={isMobile ? 130 : 260}
                    cardHeight={isMobile ? 180 : 360}
                    autoRotateSpeed={0.04}
                    className="w-full h-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
