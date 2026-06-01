import Link from 'next/link';
import Wordmark from '@/components/Wordmark';
import CTAButton from '@/components/CTAButton';

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-paper/90 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          aria-label="entity resolution, home"
          className="rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
        >
          <Wordmark compact className="text-xl" />
        </Link>
        <CTAButton className="px-4 py-2" />
      </nav>
    </header>
  );
}
