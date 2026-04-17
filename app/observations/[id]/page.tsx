import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getObservation, listObservations } from '@/lib/data';
import { CATEGORIES, SEVERITY_COLORS } from '@/lib/types';
import { SeverityBadge } from '@/components/SeverityBadge';

export const dynamic = 'force-dynamic';

const catMap = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]));

export function generateMetadata({ params }: { params: { id: string } }) {
  const obs = getObservation(params.id);
  if (!obs) return { title: 'Not found · TideTag' };
  return { title: `${obs.locationName} · TideTag` };
}

export default function ObservationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const obs = getObservation(params.id);
  if (!obs) notFound();

  const cat = catMap[obs.category];
  const date = new Date(obs.createdAt);

  const nearby = listObservations()
    .filter((o) => o.id !== obs.id)
    .map((o) => ({
      ...o,
      dist: Math.hypot(o.lat - obs.lat, o.lng - obs.lng),
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link
          href="/observations"
          className="text-sm font-medium text-tide-700 hover:text-tide-800"
        >
          ← All observations
        </Link>
      </div>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span>{cat?.emoji}</span>
          <span className="font-medium text-slate-700">{cat?.label}</span>
          <span>·</span>
          <time dateTime={obs.createdAt}>
            {date.toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}{' '}
            at{' '}
            {date.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </time>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {obs.locationName}
        </h1>
        <p className="text-slate-600">{obs.description}</p>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>by {obs.observer}</span>
          <span>·</span>
          <span className="font-mono">
            {obs.lat.toFixed(4)}, {obs.lng.toFixed(4)}
          </span>
        </div>
      </header>

      {/* ── Analysis Card ──────────────────────────────────────── */}
      <section className="tide-card p-6">
        <h2 className="text-lg font-semibold">Analysis</h2>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <SeverityBadge severity={obs.severity} />
          <div className="flex-1">
            <div className="flex items-end justify-between text-sm">
              <span className="font-medium text-slate-700">Anomaly score</span>
              <span className="font-mono font-bold">{(obs.anomalyScore * 100).toFixed(0)}%</span>
            </div>
            <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.max(2, obs.anomalyScore * 100)}%`,
                  background: SEVERITY_COLORS[obs.severity],
                }}
              />
            </div>
          </div>
        </div>

        {obs.indicators.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Detected indicators
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {obs.indicators.map((tag) => (
                <span
                  key={tag}
                  className="pill bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Measurements ───────────────────────────────────────── */}
      {obs.measurements && Object.values(obs.measurements).some((v) => v !== undefined) && (
        <section className="tide-card p-6">
          <h2 className="text-lg font-semibold">Measurements</h2>
          <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {obs.measurements.turbidityNTU !== undefined && (
              <Measurement label="Turbidity" value={obs.measurements.turbidityNTU} unit="NTU" />
            )}
            {obs.measurements.pH !== undefined && (
              <Measurement label="pH" value={obs.measurements.pH} />
            )}
            {obs.measurements.waterTempC !== undefined && (
              <Measurement label="Water temp" value={obs.measurements.waterTempC} unit="°C" />
            )}
            {obs.measurements.salinityPPT !== undefined && (
              <Measurement label="Salinity" value={obs.measurements.salinityPPT} unit="PPT" />
            )}
            {obs.measurements.dissolvedO2 !== undefined && (
              <Measurement label="Dissolved O₂" value={obs.measurements.dissolvedO2} unit="mg/L" />
            )}
          </dl>
        </section>
      )}

      {/* ── Nearby observations ────────────────────────────────── */}
      {nearby.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold">Nearby observations</h2>
          <div className="mt-4 grid gap-3">
            {nearby.map((o) => {
              const nCat = catMap[o.category];
              const nDate = new Date(o.createdAt);
              return (
                <Link
                  key={o.id}
                  href={`/observations/${o.id}`}
                  className="tide-card flex items-center gap-4 p-4 hover:bg-white/90"
                >
                  <span className="text-xl">{nCat?.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-slate-900">{o.locationName}</div>
                    <div className="truncate text-sm text-slate-500">
                      {nDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {o.observer}
                    </div>
                  </div>
                  <SeverityBadge severity={o.severity} />
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function Measurement({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit?: string;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-2xl font-bold text-slate-900">
        {value}
        {unit && <span className="ml-1 text-sm font-normal text-slate-500">{unit}</span>}
      </dd>
    </div>
  );
}
