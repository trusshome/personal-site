import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { site } from '@/lib/site';

const description =
  'I take messy problems and resolve them into one clear, shipped answer. Founder of Truss Home. Book a call.';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#14171C',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  // Sourced from lib/site.ts so the resoloution spelling never drifts. This makes
  // every canonical and OG URL resolve absolute against the correct domain.
  metadataBase: new URL(site.url),
  title: {
    default: 'entity resoLOUtion',
    template: '%s | entity resoLOUtion',
  },
  description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: site.url,
    siteName: 'entity resoLOUtion',
    title: 'entity resoLOUtion',
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'entity resoLOUtion',
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} bg-ink`}
      // A browser extension injects data-theme and theme CSS vars onto <html>
      // before hydration. Suppress the resulting attribute diff on this element
      // only; it does not hide mismatches in our own markup.
      suppressHydrationWarning
    >
      <body className="bg-ink font-sans text-ink antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
