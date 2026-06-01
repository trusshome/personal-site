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

// iOS 26 Safari Liquid Glass: at scrollY 0 Safari samples the root CSS
// background-color behind its chrome, not the visible media. We give the
// document a small scroll runway and scroll into it on load so Safari has
// non-zero scroll and composites the real shader pixels behind the bars.
const RUNWAY = 120;

export default function HomePage() {
  const [panel, setPanel] = useState<Panel>('none');
  const toggle = (p: Panel) => setPanel((cur) => (cur === p ? 'none' : p));

  useEffect(() => {
    window.scrollTo(0, RUNWAY);
  }, []);

  return (
    <>
      {/* MEDIA LAYER. The fixed wrapper carries no background-color or
          backdrop-filter itself (iOS 26 would tint the toolbar). The shader
          and tint sit on absolute children, and the shader bleeds above and
          below the visual viewport so Safari's chrome sees real content. */}
      <div
        aria-hidden
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}
      >
        <div style={{ position: 'absolute', top: '-15vh', left: 0, width: '100%', height: '130vh' }}>
          <ShaderAnimation className="h-full w-full" />
        </div>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(20,23,28,0.3)' }} />
      </div>

      {/* Top runway. An explicit spacer (not margin, which would collapse) so the
          document scrolls above the hero and Safari composites the shader behind
          the status bar. Scrolled out of view on load. */}
      <div aria-hidden style={{ height: RUNWAY }} />

      <section
          className="relative flex flex-col items-center justify-center px-4 sm:px-6 text-center"
          style={{
            minHeight: '100dvh',
            zIndex: 1,
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
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
                  <GlassBookingCalendar />
                </motion.div>
              )}
              {panel === 'projects' && (
                <motion.div
                  key="projects"
                  {...PANEL_ANIM}
                  className="mt-6 w-full"
                  style={{ height: 500 }}
                >
                  <CircularGallery
                    items={galleryItems}
                    radius={360}
                    autoRotateSpeed={0.04}
                    className="w-full h-full"
                  />
                </motion.div>
              )}
              {panel === 'data' && (
                <motion.div
                  key="data"
                  {...PANEL_ANIM}
                  className="mt-6 w-full"
                  style={{ height: 500 }}
                >
                  <CircularGallery
                    items={dataItems}
                    radius={360}
                    autoRotateSpeed={0.04}
                    className="w-full h-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Bottom runway. Keeps the document scrollable past the visual viewport
          so Safari composites the shader behind the bottom toolbar too. */}
      <div aria-hidden style={{ height: RUNWAY }} />
    </>
  );
}
