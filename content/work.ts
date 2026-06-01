export type WorkStatus = 'published' | 'draft';

export interface Metric {
  value: string;
  label: string;
}

export interface CaseStudy {
  slug: string;
  status: WorkStatus;
  title: string;
  client: string;
  summary: string;
  year: string;
  role: string;
  stack: string[];
  imageSrc: string;
  sampleData?: boolean;
  problem: string;
  approach: string;
  outcome: string;
  metrics?: Metric[];
}

const caseStudies: CaseStudy[] = [
  {
    slug: 'truss-home',
    status: 'published',
    title: 'Truss Home',
    client: 'Founder build',
    summary:
      'An AI coordinated home services marketplace that books a job, dispatches a contractor, and takes payment in one flow.',
    year: '2026',
    role: 'Founder and builder',
    stack: ['Next.js', 'Vercel', 'Stripe', 'Airtable'],
    imageSrc:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&auto=format&fit=crop&q=80',
    problem:
      'Booking a home service means scattered calls, missed messages, and no clear price. The work and the customer fall out of sync before anyone shows up.',
    approach:
      'I built one path that takes a booking, routes it to the right contractor, and runs payment in the same step. Four booking chats handle the back and forth so nothing drops.',
    outcome:
      'Truss Home runs live on Vercel with payments, dispatch, and the four booking chats working end to end.',
    metrics: [
      { value: '4', label: 'booking chats live' },
      { value: 'Live', label: 'payments and dispatch' },
    ],
  },
  {
    slug: 'esp-development',
    status: 'published',
    title: 'ESP Development and Construction',
    client: 'Client site',
    summary: 'A live site for a North Jersey design build firm.',
    year: '2026',
    role: 'Designer and builder',
    stack: ['Next.js', 'Tailwind', 'Vercel'],
    imageSrc:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=800&auto=format&fit=crop&q=80',
    problem:
      'The firm ran on an old template that buried the work and read like every other contractor page.',
    approach:
      'I rebuilt the site around the projects, with a calm editorial layout that puts the photography first.',
    outcome:
      'The site is live on Vercel with a champagne gold rebrand, real project photography, and a clean page for each service.',
  },
];

export const allStudies = caseStudies;

export function publishedStudies(): CaseStudy[] {
  return caseStudies.filter((s) => s.status === 'published');
}

export function getStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((s) => s.slug === slug);
}
