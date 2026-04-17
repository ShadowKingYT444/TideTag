'use client';

import { useCallback, useEffect, useState } from 'react';
import { CATEGORIES } from '@/lib/types';
import type { Category, Severity } from '@/lib/types';

type AnalyzeResult = {
  severity: Severity;
  anomalyScore: number;
  indicators: string[];
  recommendedAction: string;
};

const PRESETS: {
  name: string;
  category: Category;
  description: string;
  turbidityNTU: string;
  pH: string;
  waterTempC: string;
  dissolvedO2: string;
}[] = [
  {
    name: 'Healthy beach',
    category: 'water-quality',
    description: 'Clear water, light breeze, no visible debris.',
    turbidityNTU: '3',
    pH: '8.0',
    waterTempC: '18',
    dissolvedO2: '8.5',
  },
  {
    name: 'Oil spill near outfall',
    category: 'pollution',
    description: 'Visible oil sheen spreading from the outfall pipe.',
    turbidityNTU: '30',
    pH: '6.8',
    waterTempC: '16',
    dissolvedO2: '3.5',
  },
  {
    name: 'Algal bloom',
    category: 'water-quality',
    description: 'Heavy green algae bloom along the marina wall.',
    turbidityNTU: '22',
    pH: '8.5',
    waterTempC: '24',
    dissolvedO2: '4.5',
  },
  {
    name: 'Fish die-off',
    category: 'intertidal',
    description: 'Dead fish observed in wrack line, approximately a dozen.',
    turbidityNTU: '28',
    pH: '7.5',
    waterTempC: '22',
    dissolvedO2: '3.2',
  },
  {
    name: 'Routine — borderline',
    category: 'water-quality',
    description: 'Slightly foamy surf, greenish tinge.',
    turbidityNTU: '12',
    pH: '8.2',
    waterTempC: '20',
    dissolvedO2: '6.0',
  },
];

export function InlineAnalyzer() {
  const [category, setCategory] = useState<Category>('water-quality');
  const [description, setDescription] = useState('');
  const [turbidity, setTurbidity] = useState('');
  const [pH, setPH] = useState('');
  const [temp, setTemp] = useState('');
  const [dO2, setDO2] = useState('');
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    const measurements: Record<string, number> = {};
    if (turbidity) measurements.turbidityNTU = Number(turbidity);
    if (pH) measurements.pH = Number(pH);
    if (temp) measurements.waterTempC = Number(temp);
    if (dO2) measurements.dissolvedO2 = Number(dO2);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          category,
          description,
          measurements: Object.keys(measurements).length > 0 ? measurements : undefined,
        }),
      });
      const data: AnalyzeResult = await res.json();
      setResult(data);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [category, description, turbidity, pH, temp, dO2]);

  useEffect(() => {
    const t = setTimeout(runAnalysis, 300);
    return () => clearTimeout(t);
  }, [runAnalysis]);

  function loadPreset(index: number) {
    const p = PRESETS[index];
    setCategory(p.category);
    setDescription(p.description);
    setTurbidity(p.turbidityNTU);
    setPH(p.pH);
    setTemp(p.waterTempC);
    setDO2(p.dissolvedO2);
  }

  const severityStyle: Record<Severity, string> = {
    info: 'bg-tide-50 text-tide-900 ring-tide-200',
    watch: 'bg-amber-50 text-amber-900 ring-amber-200',
    alert: 'bg-red-50 text-red-900 ring-red-200',
  };

  const scoreBarColor: Record<Severity, string> = {
    info: 'from-tide-400 to-tide-600',
    watch: 'from-amber-400 to-amber-600',
    alert: 'from-red-400 to-red-600',
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      {/* ── Input Panel ──────────────────────────────────────────── */}
      <div className="glass space-y-5 p-6">
        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Load a preset scenario
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p, i) => (
              <button
                key={p.name}
                type="button"
                onClick={() => loadPreset(i)}
                className="chip"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                className={'chip inline-flex items-center gap-1.5 ' + (category === c.value ? 'chip-active' : '')}
              >
                <span aria-hidden>{c.emoji}</span> {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="az-desc" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Description
          </label>
          <textarea
            id="az-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="tt-input"
            placeholder="Describe what you observed…"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <AzField label="Turbidity (NTU)" id="az-turb" value={turbidity} onChange={setTurbidity} step="0.1" min={0} />
          <AzField label="pH" id="az-ph" value={pH} onChange={setPH} step="0.01" min={0} max={14} />
          <AzField label="Temp (°C)" id="az-temp" value={temp} onChange={setTemp} step="0.1" />
          <AzField label="DO (mg/L)" id="az-do2" value={dO2} onChange={setDO2} step="0.1" min={0} />
        </div>
      </div>

      {/* ── Result Panel ─────────────────────────────────────────── */}
      <div className="glass flex flex-col p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            Analysis result
          </h3>
          <span
            className={
              'pill ring-1 ring-inset transition ' +
              (loading
                ? 'bg-slate-100 text-slate-500 ring-slate-200'
                : 'bg-kelp-500/10 text-kelp-700 ring-kelp-400/30')
            }
          >
            <span
              className={
                'h-1.5 w-1.5 rounded-full ' +
                (loading ? 'bg-slate-400 animate-pulse' : 'bg-kelp-500')
              }
            />
            {loading ? 'Analyzing' : 'Live'}
          </span>
        </div>

        {result ? (
          <div className="mt-5 flex flex-1 flex-col gap-6">
            <div className="flex items-center gap-4">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ring-1 ring-inset ${severityStyle[result.severity]}`}
              >
                {result.severity}
              </span>
              <div className="flex-1">
                <div className="flex items-end justify-between text-sm">
                  <span className="font-medium text-slate-700">Anomaly score</span>
                  <span className="font-mono text-sm font-semibold text-slate-900">
                    {(result.anomalyScore * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100/80 ring-1 ring-inset ring-slate-200/60">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${scoreBarColor[result.severity]}`}
                    style={{ width: `${Math.max(2, result.anomalyScore * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {result.indicators.length > 0 && (
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Detected indicators
                </h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {result.indicators.map((tag) => (
                    <span
                      key={tag}
                      className="pill bg-slate-100/70 text-slate-700 ring-1 ring-inset ring-slate-200/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto rounded-xl border border-slate-200/70 bg-white/60 p-4">
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Recommended action
              </h4>
              <p className="mt-1.5 text-sm text-slate-700">{result.recommendedAction}</p>
            </div>

            <details className="group text-xs text-slate-500">
              <summary className="flex cursor-pointer select-none items-center gap-1.5 font-medium transition hover:text-slate-700">
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition group-open:rotate-90" aria-hidden="true"><path d="M7 5l6 5-6 5" /></svg>
                How scoring works
              </summary>
              <div className="mt-3 space-y-1.5 rounded-xl bg-slate-50/80 p-3 text-slate-600">
                <p><strong className="text-slate-800">Alert</strong> if: pH &lt; 6.5 or &gt; 8.6, turbidity &gt; 25 NTU, DO &lt; 4 mg/L, category = pollution, or keywords like oil/sheen/fish-kill.</p>
                <p><strong className="text-slate-800">Watch</strong> if: pH 6.5–7.0 or 8.3–8.6, turbidity 10–25 NTU, temp &gt; 28 °C, or keywords like algae/debris.</p>
                <p><strong className="text-slate-800">Info</strong> otherwise.</p>
              </div>
            </details>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center py-10 text-sm text-slate-400">
            Enter data on the left to see results.
          </div>
        )}
      </div>
    </div>
  );
}

function AzField({
  label,
  id,
  value,
  onChange,
  step,
  min,
  max,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  step?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </label>
      <input
        id={id}
        type="number"
        step={step}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="tt-input font-mono"
      />
    </div>
  );
}
