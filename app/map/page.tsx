import nextDynamic from 'next/dynamic';
import { listObservations } from '@/lib/data';

export const metadata = { title: 'Map · TideTag' };
export const dynamic = 'force-dynamic';

const MapClient = nextDynamic(() => import('@/components/MapClient'), {
  ssr: false,
  loading: () => (
    <div className="tide-card flex h-[70vh] items-center justify-center text-slate-500">
      Loading map…
    </div>
  ),
});

export default function MapPage() {
  const observations = listObservations();
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Coastal map</h1>
        <p className="mt-1 text-slate-600">
          Geotagged observations from across the TideTag network. Colored by severity.
        </p>
      </header>
      <MapClient initial={observations} />
    </div>
  );
}
