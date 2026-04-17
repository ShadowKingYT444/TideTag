import { getStats } from '@/lib/data';
import { CATEGORIES } from '@/lib/types';
import { ObservationCard } from '@/components/ObservationCard';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Dashboard · TideTag' };

export default function DashboardPage() {
  const stats = getStats();

  const catEntries = CATEGORIES.map((c) => ({
    ...c,
    count: stats.byCategory[c.value] ?? 0,
  }));
  const maxCat = Math.max(1, ...catEntries.map((e) => e.count));
  const severityTotal =
    stats.bySeverity.info + stats.bySeverity.watch + stats.bySeverity.alert || 1;

  return (
    <div className="space-y-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-eyebrow">Operations</span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            A live view of the TideTag network — contributors, submissions, and
            alerts across the coast.
          </p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card label="Total observations" value={stats.headline.totalObservations.toLocaleString()} />
        <Card label="Contributors" value={stats.headline.contributors.toLocaleString()} />
        <Card label="Miles of coastline" value={stats.headline.milesOfCoastline.toString()} />
        <Card
          label="Active alerts"
          value={stats.headline.activeAlerts.toString()}
          tone={stats.headline.activeAlerts > 0 ? 'alert' : undefined}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="glass p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight text-slate-900">
              By category
            </h2>
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
              Share
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Distribution of current observations.
          </p>
          <ul className="mt-5 space-y-3.5">
            {catEntries.map((c) => (
              <li key={c.value}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span aria-hidden>{c.emoji}</span>
                    <span className="font-medium">{c.label}</span>
                  </span>
                  <span className="font-mono text-xs text-slate-500">{c.count}</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100/80">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-tide-500 via-tide-400 to-kelp-400"
                    style={{ width: `${(c.count / maxCat) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight text-slate-900">
              Severity mix
            </h2>
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
              Triage
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            How current observations triage across severity levels.
          </p>
          <div className="mt-6 flex h-3 w-full overflow-hidden rounded-full bg-slate-100/80 ring-1 ring-inset ring-slate-200/60">
            <div
              className="bg-tide-500 transition-all"
              style={{ width: `${(stats.bySeverity.info / severityTotal) * 100}%` }}
              title={`Info: ${stats.bySeverity.info}`}
            />
            <div
              className="bg-amber-500 transition-all"
              style={{ width: `${(stats.bySeverity.watch / severityTotal) * 100}%` }}
              title={`Watch: ${stats.bySeverity.watch}`}
            />
            <div
              className="bg-red-600 transition-all"
              style={{ width: `${(stats.bySeverity.alert / severityTotal) * 100}%` }}
              title={`Alert: ${stats.bySeverity.alert}`}
            />
          </div>
          <dl className="mt-6 grid grid-cols-3 gap-4">
            <SeverityStat label="Info" count={stats.bySeverity.info} color="bg-tide-500" />
            <SeverityStat label="Watch" count={stats.bySeverity.watch} color="bg-amber-500" />
            <SeverityStat label="Alert" count={stats.bySeverity.alert} color="bg-red-600" />
          </dl>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Latest submissions</h2>
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            Live feed
          </span>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.recent.map((o) => (
            <ObservationCard key={o.id} obs={o} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Card({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'alert';
}) {
  return (
    <div className="glass p-5">
      <div
        className={
          'text-3xl font-semibold tracking-tight ' +
          (tone === 'alert' ? 'text-red-600' : 'text-slate-900')
        }
      >
        {value}
      </div>
      <div className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
        {label}
      </div>
    </div>
  );
}

function SeverityStat({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${color}`} />
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          {label}
        </span>
      </div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">{count}</div>
    </div>
  );
}
