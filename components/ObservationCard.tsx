import Link from 'next/link';
import type { Observation } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';
import { SeverityBadge } from './SeverityBadge';

const catMap = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]));

export function ObservationCard({ obs }: { obs: Observation }) {
  const cat = catMap[obs.category];
  const date = new Date(obs.createdAt);
  return (
    <Link href={`/observations/${obs.id}`} className="group block">
      <article className="glass relative h-full overflow-hidden p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-glass-lg">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
        />
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span aria-hidden className="text-sm">{cat?.emoji}</span>
              <span className="truncate text-slate-600">{cat?.label}</span>
              <span className="text-slate-300">·</span>
              <time dateTime={obs.createdAt}>
                {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </time>
            </div>
            <h3 className="mt-1.5 truncate text-[15px] font-semibold text-slate-900 transition group-hover:text-tide-700">
              {obs.locationName}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-600">
              {obs.description}
            </p>
          </div>
          <SeverityBadge severity={obs.severity} />
        </div>

        {obs.indicators.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {obs.indicators.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="pill bg-slate-100/70 text-slate-700 ring-1 ring-inset ring-slate-200/80"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs text-slate-500">
          <span className="truncate">{obs.observer}</span>
          <span className="font-mono text-[11px] text-slate-500">
            {obs.lat.toFixed(3)}, {obs.lng.toFixed(3)}
          </span>
        </div>
      </article>
    </Link>
  );
}
