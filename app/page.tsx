import Link from 'next/link';
import { getStats } from '@/lib/data';
import { ObservationCard } from '@/components/ObservationCard';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const stats = getStats();

  return (
    <div className="space-y-16">
      <section className="grid gap-10 pt-6 md:grid-cols-2 md:items-center">
        <div>
          <span className="pill bg-tide-100 text-tide-800 ring-1 ring-inset ring-tide-200">
            Citizen science · Coastal monitoring
          </span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Tag the tide. <br />
            <span className="bg-gradient-to-r from-tide-600 to-kelp-600 bg-clip-text text-transparent">
              Protect the coast.
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-lg text-slate-600">
            TideTag is an AI-powered coastal monitoring platform that turns student
            and community observations into near-real-time signals for water
            quality, sediment dynamics, and pollution events.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/observations/new"
              className="rounded-lg bg-tide-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-tide-700"
            >
              Submit an observation
            </Link>
            <Link
              href="/map"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Explore the map
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Contributors" value={stats.headline.contributors.toLocaleString() + '+'} />
          <Stat label="Observations" value={stats.headline.totalObservations.toLocaleString() + '+'} />
          <Stat label="Miles of coastline" value={stats.headline.milesOfCoastline + '+'} />
          <Stat label="Active alerts" value={stats.headline.activeAlerts.toString()} tone="alert" />
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
            <p className="mt-1 text-slate-600">
              Three steps from a walk on the beach to an actionable signal.
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Step
            n={1}
            title="Observe"
            body="Students and stewards log geotagged observations — photos, water-quality readings, and notes — from any phone."
          />
          <Step
            n={2}
            title="Analyze"
            body="Computer-vision cues and geospatial heuristics tag indicators like algal blooms, oil sheen, and erosion, improving pollution-event detection by ~25%."
          />
          <Step
            n={3}
            title="Act"
            body="Conservation partners triage alerts, route follow-ups, and share open data with schools, researchers, and local agencies."
          />
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Recent observations</h2>
          <Link href="/observations" className="text-sm font-semibold text-tide-700 hover:text-tide-800">
            See all →
          </Link>
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

function Stat({
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

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="tide-card p-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tide-600 text-sm font-bold text-white">
        {n}
      </div>
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{body}</p>
    </div>
  );
}
