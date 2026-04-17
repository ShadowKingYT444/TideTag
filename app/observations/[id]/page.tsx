import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { getObservation, listObservations } from '@/lib/data';
import { CATEGORIES, SEVERITY_COLORS } from '@/lib/types';
import { SeverityBadge } from '@/components/SeverityBadge';
import { TideContext } from '@/components/TideContext';

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
          className="inline-flex items-center gap-1.5 text-sm font-medium text-tide-700 hover:text-tide-800"
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 4l-6 6 6 6M6 10h12" />
          </svg>
          All observations
        </Link>
      </div>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
          <span aria-hidden className="text-sm">{cat?.emoji}</span>
          <span className="text-slate-700">{cat?.label}</span>
          <span className="text-slate-300">·</span>
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
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {obs.locationName}
        </h1>
        <p className="text-base leading-relaxed text-slate-600">{obs.description}</p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span>by {obs.observer}</span>
          <span className="text-slate-300">·</span>
          <span className="font-mono text-xs">
            {obs.lat.toFixed(4)}, {obs.lng.toFixed(4)}
          </span>
        </div>
      </header>

      {/* ── Analysis Card ──────────────────────────────────────── */}
      <section className="glass p-6">
        <h2 className="text-base font-semibold tracking-tight text-slate-900">
          Analysis
        </h2>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <SeverityBadge severity={obs.severity} />
          <div className="flex-1">
            <div className="flex items-end justify-between text-sm">
              <span className="font-medium text-slate-700">Anomaly score</span>
              <span className="font-mono text-sm font-semibold text-slate-900">
                {(obs.anomalyScore * 100).toFixed(0)}%
              </span>
            </div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100/80 ring-1 ring-inset ring-slate-200/60">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.max(2, obs.anomalyScore * 100)}%`,
                  background: SEVERITY_COLORS[obs.severity],
                }}
              />
            </div>
          </div>
        </div>

        {obs.indicators.length > 0 && (
          <div className="mt-5">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Detected indicators
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {obs.indicators.map((tag) => (
                <span
                  key={tag}
                  className="pill bg-slate-100/70 text-slate-700 ring-1 ring-inset ring-slate-200/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Tidal context (NOAA) ───────────────────────────────── */}
      <Suspense fallback={<TideSkeleton />}>
        <TideContext lat={obs.lat} lng={obs.lng} />
      </Suspense>

      {/* ── Measurements ───────────────────────────────────────── */}
      {obs.measurements && Object.values(obs.measurements).some((v) => v !== undefined) && (
        <section className="glass p-6">
          <h2 className="text-base font-semibold tracking-tight text-slate-900">
            Measurements
          </h2>
          <dl className="mt-5 grid grid-cols-2 gap-6 sm:grid-cols-3">
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
          <h2 className="text-base font-semibold tracking-tight text-slate-900">
            Nearby observations
          </h2>
          <div className="mt-4 grid gap-3">
            {nearby.map((o) => {
              const nCat = catMap[o.category];
              const nDate = new Date(o.createdAt);
              return (
                <Link
                  key={o.id}
                  href={`/observations/${o.id}`}
                  className="glass flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:shadow-glass-lg"
                >
                  <span className="text-xl">{nCat?.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-slate-900">{o.locationName}</div>
                    <div className="truncate text-xs text-slate-500">
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
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 flex items-baseline gap-1 text-2xl font-semibold text-slate-900">
        <span>{value}</span>
        {unit && <span className="text-sm font-normal text-slate-500">{unit}</span>}
      </dd>
    </div>
  );
}

function TideSkeleton() {
  return (
    <section className="glass p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-5 w-36 animate-pulse rounded bg-slate-200/70" />
          <div className="mt-2 h-3 w-64 animate-pulse rounded bg-slate-200/60" />
        </div>
      </div>
      <div className="mt-6 h-24 animate-pulse rounded-xl bg-slate-100/80" />
    </section>
  );
}
