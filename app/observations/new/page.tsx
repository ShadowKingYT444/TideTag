import { NewObservationForm } from '@/components/NewObservationForm';

export const metadata = { title: 'Submit observation · TideTag' };

export default function NewObservationPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <span className="section-eyebrow">Contribute</span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Submit an observation
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Tag a point along the coast. Your report goes straight into the live
          map and dashboard, and is automatically scored for severity and paired
          with tide context from the nearest NOAA station.
        </p>
      </header>
      <NewObservationForm />
    </div>
  );
}
