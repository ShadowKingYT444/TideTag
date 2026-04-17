import Link from 'next/link';
import type { Observation } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';
import { SeverityBadge } from './SeverityBadge';

const catMap = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]));

export function ObservationCard({ obs }: { obs: Observation }) {
  const cat = catMap[obs.category];
  const date = new Date(obs.createdAt);
  return (
    <Link href={`/observations/${obs.id}`} className="block">
      <article className="tide-card p-4 transition hover:shadow-md hover:ring-1 hover:ring-tide-200">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span aria-hidden="true">{cat?.emoji}</span>
              <span className="truncate font-medium text-slate-700">{cat?.label}</span>
              <span>·</span>
              <time dateTime={obs.createdAt}>
                {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </time>
            </div>
            <h3 className="mt-0.5 truncate text-base font-semibold text-slate-900">
              {obs.locationName}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">{obs.description}</p>
          </div>
          <SeverityBadge severity={obs.severity} />
        </div>

        {obs.indicators.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {obs.indicators.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="pill bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate">by {obs.observer}</span>
          <span className="font-mono">
            {obs.lat.toFixed(3)}, {obs.lng.toFixed(3)}
          </span>
        </div>
      </article>
    </Link>
  );
}
