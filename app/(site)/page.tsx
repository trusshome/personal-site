'use client';

import { useState } from 'react';
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
  const toggle = (p: Panel) => setPanel((cur) => (cur === p ? 'none' : p));

  return (
    <>
      <section
          className="relative isolate flex flex-col items-center justify-center px-4 sm:px-6 text-center"
          style={{
            minHeight: '100vh',
            height: '100dvh',
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
        {/* On iOS Safari, 100vh equals the LARGE viewport (full screen, behind
            both bars) and is universally supported, unlike lvh which collapses
            to height 0 on older iOS. This is what makes the shader bleed behind
            the status bar and the Safari bottom toolbar. */}
        <div
          className="fixed left-0 top-0"
          style={{ zIndex: 0, width: '100vw', height: '100vh' }}
        >
          <ShaderAnimation className="h-full w-full" />
        </div>
        <div
          className="fixed left-0 top-0"
          style={{ zIndex: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(20,23,28,0.3)' }}
          aria-hidden
        />

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
    </>
  );
}
