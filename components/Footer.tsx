import Wordmark from '@/components/Wordmark';
import CTAButton from '@/components/CTAButton';
import { site } from '@/lib/site';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-paper" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 py-16 text-center">
        <Wordmark dark className="text-3xl" />
        <CTAButton />
        <p className="font-mono text-xs text-slate">
          © {year} {site.copyright}
        </p>
      </div>
    </footer>
  );
}
