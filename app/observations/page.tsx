import Link from 'next/link';
import { listObservations } from '@/lib/data';
import { CATEGORIES } from '@/lib/types';
import { ObservationCard } from '@/components/ObservationCard';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Observations · TideTag' };

type Search = { category?: string; severity?: string };

export default function ObservationsPage({ searchParams }: { searchParams: Search }) {
  const items = listObservations({
    category: searchParams.category,
    severity: searchParams.severity,
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Observations</h1>
          <p className="mt-1 text-slate-600">
            {items.length} observation{items.length === 1 ? '' : 's'} in the current view.
          </p>
        </div>
        <Link
          href="/observations/new"
          className="rounded-lg bg-tide-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-tide-700"
        >
          + New observation
        </Link>
      </header>

      <div className="flex flex-wrap gap-2">
        <FilterLink param="category" value={undefined} active={!searchParams.category}>
          All
        </FilterLink>
        {CATEGORIES.map((c) => (
          <FilterLink
            key={c.value}
            param="category"
            value={c.value}
            active={searchParams.category === c.value}
          >
            {c.emoji} {c.label}
          </FilterLink>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterLink param="severity" value={undefined} active={!searchParams.severity}>
          Any severity
        </FilterLink>
        {(['info', 'watch', 'alert'] as const).map((s) => (
          <FilterLink
            key={s}
            param="severity"
            value={s}
            active={searchParams.severity === s}
          >
            {s}
          </FilterLink>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="tide-card p-10 text-center text-slate-500">
          No observations match these filters.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((o) => (
            <ObservationCard key={o.id} obs={o} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterLink({
  param,
  value,
  active,
  children,
}: {
  param: 'category' | 'severity';
  value: string | undefined;
  active: boolean;
  children: React.ReactNode;
}) {
  const query = value ? `?${param}=${value}` : '';
  const classes = active
    ? 'bg-slate-900 text-white'
    : 'bg-white text-slate-700 hover:bg-slate-100 ring-1 ring-inset ring-slate-200';
  return (
    <Link
      href={`/observations${query}`}
      className={`rounded-full px-3 py-1 text-xs font-medium ${classes}`}
    >
      {children}
    </Link>
  );
}
