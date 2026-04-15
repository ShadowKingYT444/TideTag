import { NewObservationForm } from '@/components/NewObservationForm';

export const metadata = { title: 'Submit observation · TideTag' };

export default function NewObservationPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Submit an observation</h1>
        <p className="mt-1 text-slate-600">
          Tag a point along the coast. Your report goes straight into the live map and
          dashboard, and gets auto-scored for severity.
        </p>
      </header>
      <NewObservationForm />
    </div>
  );
}
