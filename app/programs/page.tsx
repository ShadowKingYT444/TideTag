import Link from 'next/link';

export const metadata = { title: 'Programs · TideTag' };

const programs = [
  {
    name: 'TideTag in Schools',
    audience: 'Grades 6–12',
    summary:
      'A classroom-ready curriculum that pairs field kits with the TideTag platform — students log observations during field trips and use the dashboard to follow their watershed over the school year.',
  },
  {
    name: 'Coastal Stewards Network',
    audience: 'Community volunteers',
    summary:
      'Monthly coordinated monitoring days with local conservation groups along 120+ miles of coastline. Standardized protocols for water quality, erosion, and marine debris.',
  },
  {
    name: 'Harbor Watch',
    audience: 'Harbor masters & marinas',
    summary:
      'A lightweight reporting workflow for staff to log pollution events and near-miss incidents. Integrates with TideTag’s analysis API for rapid triage.',
  },
  {
    name: 'Intertidal Census',
    audience: 'Researchers & naturalists',
    summary:
      'Seasonal census of intertidal zones contributed directly into the TideTag open dataset. Supports long-term trend analysis across sites.',
  },
  {
    name: 'Bloom Watch',
    audience: 'Public health partners',
    summary:
      'Early-warning channel for harmful algal blooms. Community reports trigger alerts to local health departments and shellfish programs.',
  },
];

export default function ProgramsPage() {
  return (
    <div className="space-y-10">
      <header>
        <span className="section-eyebrow">Partnerships</span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Programs
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          TideTag runs five school- and community-based initiatives that expand
          access to consistent, actionable coastal data.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {programs.map((p) => (
          <article
            key={p.name}
            className="glass group relative overflow-hidden p-6 transition hover:-translate-y-0.5 hover:shadow-glass-lg"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {p.audience}
            </div>
            <h2 className="mt-1.5 text-lg font-semibold tracking-tight text-slate-900">
              {p.name}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.summary}</p>
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-tide-400/30 to-kelp-400/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-60"
            />
          </article>
        ))}
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-tide-600 via-tide-700 to-kelp-600 p-8 text-white shadow-glass-lg">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-kelp-400/30 blur-3xl"
        />
        <div className="relative flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Bring TideTag to your coast
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/85">
              We partner with schools, marinas, and conservation groups to launch
              new monitoring sites. No prior experience required — we provide the
              training and the kit.
            </p>
          </div>
          <Link
            href="/observations/new"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-tide-700 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.4)] transition hover:bg-tide-50"
          >
            Start contributing
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 10h12M11 5l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
