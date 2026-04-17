import { fetchTideSnapshot, type TideSnapshot } from '@/lib/tides';

const timeFmt = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: '2-digit',
});
const weekdayFmt = new Intl.DateTimeFormat(undefined, { weekday: 'short' });

export async function TideContext({ lat, lng }: { lat: number; lng: number }) {
  let snapshot: TideSnapshot | null = null;
  try {
    snapshot = await fetchTideSnapshot(lat, lng);
  } catch {
    snapshot = null;
  }

  if (!snapshot) {
    return (
      <section className="glass p-6">
        <Header />
        <p className="mt-3 text-sm text-slate-500">
          Tide data is temporarily unavailable from NOAA. Please try again later.
        </p>
      </section>
    );
  }

  const now = Date.now();
  const upcoming = snapshot.extremes
    .filter((e) => new Date(e.time).getTime() > now - 60 * 60 * 1000)
    .slice(0, 4);

  const phaseCopy =
    snapshot.phase === 'rising'
      ? 'Tide rising'
      : snapshot.phase === 'falling'
      ? 'Tide falling'
      : 'Tide phase unknown';

  return (
    <section className="glass overflow-hidden p-6">
      <Header />
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Nearest station · NOAA CO-OPS
          </div>
          <div className="mt-1 text-lg font-semibold text-slate-900">
            {snapshot.station.name}
          </div>
          <div className="mt-0.5 text-xs text-slate-500">
            Station {snapshot.station.id} · {snapshot.distanceKm.toFixed(0)} km from observation
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white/70 px-4 py-3 shadow-sm">
          <PhaseIcon phase={snapshot.phase} />
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {phaseCopy}
            </div>
            <div className="text-lg font-semibold text-slate-900">
              {snapshot.current
                ? `${snapshot.current.heightFt.toFixed(2)} ft`
                : '—'}
            </div>
            {snapshot.current && (
              <div className="text-[11px] text-slate-500">
                as of {timeFmt.format(new Date(snapshot.current.time))}
              </div>
            )}
          </div>
        </div>
      </div>

      {upcoming.length > 0 && (
        <div className="mt-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Upcoming highs &amp; lows
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {upcoming.map((e) => {
              const d = new Date(e.time);
              const isHigh = e.type === 'H';
              return (
                <div
                  key={e.time}
                  className="rounded-xl border border-slate-200/70 bg-white/60 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={
                        'pill ' +
                        (isHigh
                          ? 'bg-tide-50 text-tide-800 ring-1 ring-inset ring-tide-200'
                          : 'bg-kelp-500/10 text-kelp-700 ring-1 ring-inset ring-kelp-400/30')
                      }
                    >
                      {isHigh ? 'High' : 'Low'}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {e.height.toFixed(2)} ft
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    {timeFmt.format(d)}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {weekdayFmt.format(d)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Tidal context
        </h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Live tide predictions from the nearest NOAA station.
        </p>
      </div>
      <span className="pill bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-kelp-500" />
        Live
      </span>
    </div>
  );
}

function PhaseIcon({ phase }: { phase: 'rising' | 'falling' | 'unknown' }) {
  const cls =
    phase === 'rising'
      ? 'text-tide-600'
      : phase === 'falling'
      ? 'text-kelp-600'
      : 'text-slate-400';
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cls}
    >
      {phase === 'rising' ? (
        <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
      ) : phase === 'falling' ? (
        <path d="M3 7l6 6 4-4 8 8M15 17h6v-6" />
      ) : (
        <path d="M3 12h18" />
      )}
    </svg>
  );
}
