import Link from 'next/link';
import type { CaseStudy } from '@/content/work';

export default function ProjectCard({ study }: { study: CaseStudy }) {
  return (
    <Link
      href={`/work/${study.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-hairline bg-paper p-8 transition-colors duration-150 hover:border-signal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate">{study.client}</p>
        {study.sampleData && (
          <span className="rounded-full bg-signal-tint px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-signal-dark">
            Sample data
          </span>
        )}
      </div>

      <h2 className="mt-4 font-display text-2xl font-medium tracking-tight transition-colors duration-150 group-hover:text-signal">
        {study.title}
      </h2>
      <p className="mt-3 flex-1 text-slate">{study.summary}</p>

      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-signal">
        Read the case study
        <span aria-hidden className="transition-transform duration-150 group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}
