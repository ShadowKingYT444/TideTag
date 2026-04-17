import { InlineAnalyzer } from '@/components/InlineAnalyzer';
import Link from 'next/link';

export const metadata = { title: 'Analyze · TideTag' };

export default function AnalyzePage() {
  return (
    <div className="space-y-8">
      <header>
        <span className="section-eyebrow">Engine</span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Inline analyzer
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Experiment with TideTag&apos;s anomaly-scoring engine in real time. Change
          any input and the analysis updates instantly — no submission required.
        </p>
      </header>

      <InlineAnalyzer />

      <div className="flex flex-wrap gap-3 border-t border-slate-200/70 pt-6">
        <Link href="/observations/new" className="btn-primary">
          Submit a real observation
        </Link>
        <Link href="/map" className="btn-secondary">
          Explore the map
        </Link>
      </div>
    </div>
  );
}
