import { InlineAnalyzer } from '@/components/InlineAnalyzer';
import Link from 'next/link';

export const metadata = { title: 'Analyze · TideTag' };

export default function AnalyzePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Inline analyzer</h1>
        <p className="mt-1 max-w-2xl text-slate-600">
          Experiment with TideTag&#39;s anomaly-scoring engine in real time.
          Change any input and the analysis updates instantly — no submission
          required.
        </p>
      </header>

      <InlineAnalyzer />

      <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
        <Link
          href="/observations/new"
          className="rounded-lg bg-tide-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-tide-700"
        >
          Submit a real observation
        </Link>
        <Link
          href="/learn"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
        >
          Learn about water quality
        </Link>
      </div>
    </div>
  );
}
