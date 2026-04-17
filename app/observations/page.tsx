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
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-eyebrow">Network feed</span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Observations
          </h1>
          <p className="mt-2 text-slate-600">
            {items.length} observation{items.length === 1 ? '' : 's'} in the current view.
          </p>
        </div>
        <Link href="/observations/new" className="btn-primary">
          <PlusIcon />
          New observation
        </Link>
      </header>

      <div className="glass p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Category
          </span>
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
              <span aria-hidden>{c.emoji}</span> {c.label}
            </FilterLink>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-200/60 pt-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Severity
          </span>
          <FilterLink param="severity" value={undefined} active={!searchParams.severity}>
            Any
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
      </div>

      {items.length === 0 ? (
        <div className="glass p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
            </svg>
          </div>
          <p className="mt-3 font-medium text-slate-700">No observations match these filters.</p>
          <p className="mt-1 text-sm text-slate-500">
            Try clearing a filter or{' '}
            <Link href="/observations/new" className="font-medium text-tide-700 hover:text-tide-800">
              submit the first one
            </Link>
            .
          </p>
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
  return (
    <Link
      href={`/observations${query}`}
      className={'chip inline-flex items-center gap-1.5 ' + (active ? 'chip-active' : '')}
    >
      {children}
    </Link>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 4v12M4 10h12" />
    </svg>
  );
}
