import nextDynamic from 'next/dynamic';
import { listObservations } from '@/lib/data';

export const metadata = { title: 'Map | TideTag' };
export const dynamic = 'force-dynamic';

const MapClient = nextDynamic(() => import('@/components/MapClient'), {
  ssr: false,
  loading: () => (
    <div className="glass flex h-[70vh] items-center justify-center text-sm text-slate-500">
      <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-tide-600" />
      <span className="ml-3">Loading map...</span>
    </div>
  ),
});

export default function MapPage() {
  const observations = listObservations();
  return (
    <div className="space-y-6">
      <header>
        <span className="section-eyebrow">Geospatial</span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Coastal map
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Every sourced observation is plotted and listed here for fast review.
          Markers are colored by severity; click any marker for details.
        </p>
      </header>
      <MapClient initial={observations} />
    </div>
  );
}
