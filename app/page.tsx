import Link from 'next/link';
import { getStats } from '@/lib/data';
import { ObservationCard } from '@/components/ObservationCard';
import { TideContext } from '@/components/TideContext';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const stats = getStats();

  return (
    <div className="space-y-20 pb-10">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative grid gap-10 pt-6 md:grid-cols-[1.15fr_1fr] md:items-center">
        <div className="animate-fade-up">
          <span className="section-eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-tide-500" />
            Citizen science · Coastal monitoring
          </span>
          <h1 className="mt-4 text-[40px] font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-[56px]">
            Tag the tide.{' '}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-tide-600 via-tide-500 to-kelp-500 bg-clip-text text-transparent">
              Protect the coast.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
            TideTag turns student and community observations into near-real-time
            signals for water quality, sediment dynamics, and pollution events —
            backed by NOAA tide data and automated anomaly detection.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/observations/new" className="btn-primary">
              Submit an observation
              <Arrow />
            </Link>
            <Link href="/map" className="btn-secondary">
              Explore the map
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <Trust label="NOAA CO-OPS" />
            <Trust label="Open data" />
            <Trust label="Mobile-first" />
            <Trust label="No login required" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat label="Contributors" value={stats.headline.contributors.toLocaleString() + '+'} accent="tide" />
          <Stat label="Observations" value={stats.headline.totalObservations.toLocaleString() + '+'} accent="kelp" />
          <Stat label="Miles of coastline" value={stats.headline.milesOfCoastline + '+'} accent="tide" />
          <Stat
            label="Active alerts"
            value={stats.headline.activeAlerts.toString()}
            tone={stats.headline.activeAlerts > 0 ? 'alert' : undefined}
            accent="alert"
          />
        </div>
      </section>

      {/* ─── How it works ───────────────────────────────────────── */}
      <section>
        <SectionHead
          eyebrow="How it works"
          title="From a walk on the beach to an actionable signal"
          description="Three steps, designed for a phone in the field and a data team at the desk."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Step
            n={1}
            title="Observe"
            body="Students and stewards log geotagged reports — photos, water-quality readings, and notes — from any phone."
          />
          <Step
            n={2}
            title="Analyze"
            body="Heuristics and geospatial cues tag indicators like algal blooms, oil sheen, and erosion, improving pollution-event detection by ~25%."
          />
          <Step
            n={3}
            title="Act"
            body="Conservation partners triage alerts, route follow-ups, and share open data with schools, researchers, and local agencies."
          />
        </div>
      </section>

      {/* ─── Live tidal context ───────────────────────────────── */}
      <section>
        <SectionHead
          eyebrow="Live data"
          title="Tide-aware observations"
          description="Every submission is paired with live tide predictions from the nearest NOAA station so analysts can interpret measurements in context."
        />
        <div className="mt-6">
          {/* Featured station: The Battery, NYC */}
          <TideContext lat={40.7} lng={-74.014} />
        </div>
      </section>

      {/* ─── Recent observations ─────────────────────────────── */}
      <section>
        <div className="flex items-end justify-between">
          <SectionHead
            eyebrow="Network feed"
            title="Recent observations"
            description="Reports flowing in from contributors along the coast."
          />
          <Link
            href="/observations"
            className="hidden text-sm font-semibold text-tide-700 hover:text-tide-800 sm:inline"
          >
            See all →
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.recent.map((o) => (
            <ObservationCard key={o.id} obs={o} />
          ))}
        </div>
        <div className="mt-6 sm:hidden">
          <Link href="/observations" className="btn-secondary w-full justify-center">
            See all observations →
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
  accent,
}: {
  label: string;
  value: string;
  tone?: 'alert';
  accent?: 'tide' | 'kelp' | 'alert';
}) {
  const accentRing =
    accent === 'kelp'
      ? 'before:bg-gradient-to-br before:from-kelp-400/30 before:to-transparent'
      : accent === 'alert'
      ? 'before:bg-gradient-to-br before:from-red-400/25 before:to-transparent'
      : 'before:bg-gradient-to-br before:from-tide-400/30 before:to-transparent';
  return (
    <div
      className={
        'glass relative overflow-hidden p-5 before:pointer-events-none before:absolute before:-right-10 before:-top-10 before:h-32 before:w-32 before:rounded-full before:blur-2xl ' +
        accentRing
      }
    >
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

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="glass group relative overflow-hidden p-6 transition hover:-translate-y-0.5 hover:shadow-glass-lg">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-b from-tide-500 to-tide-600 text-sm font-bold text-white shadow-[0_4px_14px_-4px_rgba(22,112,245,0.55)]">
          {n}
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <span className="section-eyebrow">{eyebrow}</span>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-2xl text-slate-600">{description}</p>
      )}
    </div>
  );
}

function Trust({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="text-kelp-600" aria-hidden="true">
        <path d="M4 10l4 4 8-8" />
      </svg>
      {label}
    </span>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}
