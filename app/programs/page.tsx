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
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Programs</h1>
        <p className="mt-1 max-w-2xl text-slate-600">
          TideTag runs five school- and community-based initiatives that expand access
          to consistent, actionable coastal data.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {programs.map((p) => (
          <article key={p.name} className="tide-card p-6">
            <div className="text-xs uppercase tracking-wide text-slate-500">{p.audience}</div>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">{p.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{p.summary}</p>
          </article>
        ))}
      </div>

      <section className="tide-card flex flex-col items-start gap-4 bg-gradient-to-br from-tide-600 to-kelp-600 p-8 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Bring TideTag to your coast</h2>
          <p className="mt-1 max-w-xl text-sm text-white/85">
            We partner with schools, marinas, and conservation groups to launch new
            monitoring sites. No prior experience required — we provide the training
            and the kit.
          </p>
        </div>
        <Link
          href="/observations/new"
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-tide-700 shadow-sm hover:bg-tide-50"
        >
          Start contributing →
        </Link>
      </section>
    </div>
  );
}
