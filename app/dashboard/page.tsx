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
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-slate-600">
          A live view of the TideTag network — contributors, submissions, and alerts.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card label="Total observations" value={stats.headline.totalObservations.toLocaleString()} />
        <Card label="Contributors" value={stats.headline.contributors.toLocaleString()} />
        <Card label="Miles of coastline" value={stats.headline.milesOfCoastline.toString()} />
        <Card
          label="Active alerts"
          value={stats.headline.activeAlerts.toString()}
          tone={stats.headline.activeAlerts > 0 ? 'alert' : undefined}
        />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="tide-card p-6">
          <h2 className="text-lg font-semibold">By category</h2>
          <p className="mt-1 text-sm text-slate-500">Share of current observations.</p>
          <ul className="mt-4 space-y-3">
            {catEntries.map((c) => (
              <li key={c.value}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-700">
                    <span aria-hidden>{c.emoji}</span>
                    {c.label}
                  </span>
                  <span className="font-mono text-slate-500">{c.count}</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-tide-500 to-kelp-500"
                    style={{ width: `${(c.count / maxCat) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="tide-card p-6">
          <h2 className="text-lg font-semibold">Severity mix</h2>
          <p className="mt-1 text-sm text-slate-500">
            How current observations triage across severity levels.
          </p>
          <div className="mt-5 flex h-4 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="bg-tide-500"
              style={{ width: `${(stats.bySeverity.info / severityTotal) * 100}%` }}
              title={`info: ${stats.bySeverity.info}`}
            />
            <div
              className="bg-amber-500"
              style={{ width: `${(stats.bySeverity.watch / severityTotal) * 100}%` }}
              title={`watch: ${stats.bySeverity.watch}`}
            />
            <div
              className="bg-red-600"
              style={{ width: `${(stats.bySeverity.alert / severityTotal) * 100}%` }}
              title={`alert: ${stats.bySeverity.alert}`}
            />
          </div>
          <dl className="mt-5 grid grid-cols-3 gap-4 text-center">
            <SeverityStat label="Info" count={stats.bySeverity.info} color="text-tide-700" />
            <SeverityStat label="Watch" count={stats.bySeverity.watch} color="text-amber-700" />
            <SeverityStat label="Alert" count={stats.bySeverity.alert} color="text-red-700" />
          </dl>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Latest submissions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    <div className="tide-card p-5">
      <div
        className={
          'text-3xl font-bold tracking-tight ' +
          (tone === 'alert' ? 'text-red-600' : 'text-slate-900')
        }
      >
        {value}
      </div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  );
}

function SeverityStat({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div>
      <div className={`text-2xl font-bold ${color}`}>{count}</div>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}
