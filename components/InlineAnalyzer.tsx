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
    const t = setTimeout(runAnalysis, 350);
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

  const severityColor: Record<Severity, string> = {
    info: 'bg-tide-100 text-tide-900 ring-tide-300',
    watch: 'bg-amber-100 text-amber-900 ring-amber-300',
    alert: 'bg-red-100 text-red-900 ring-red-300',
  };

  const scoreBarColor: Record<Severity, string> = {
    info: 'from-tide-400 to-tide-600',
    watch: 'from-amber-400 to-amber-600',
    alert: 'from-red-400 to-red-600',
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      {/* ── Input Panel ──────────────────────────────────────────── */}
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Load a preset scenario
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p, i) => (
              <button
                key={p.name}
                type="button"
                onClick={() => loadPreset(i)}
                className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-100"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                className={
                  'rounded-full px-3 py-1.5 text-sm font-medium transition ' +
                  (category === c.value
                    ? 'bg-tide-600 text-white'
                    : 'bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-100')
                }
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="az-desc" className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="az-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="az-input"
            placeholder="Describe what you observed…"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <label htmlFor="az-turb" className="mb-1 block text-xs font-medium text-slate-600">
              Turbidity (NTU)
            </label>
            <input
              id="az-turb"
              type="number"
              step="0.1"
              min={0}
              value={turbidity}
              onChange={(e) => setTurbidity(e.target.value)}
              className="az-input"
            />
          </div>
          <div>
            <label htmlFor="az-ph" className="mb-1 block text-xs font-medium text-slate-600">
              pH
            </label>
            <input
              id="az-ph"
              type="number"
              step="0.01"
              min={0}
              max={14}
              value={pH}
              onChange={(e) => setPH(e.target.value)}
              className="az-input"
            />
          </div>
          <div>
            <label htmlFor="az-temp" className="mb-1 block text-xs font-medium text-slate-600">
              Water temp (°C)
            </label>
            <input
              id="az-temp"
              type="number"
              step="0.1"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              className="az-input"
            />
          </div>
          <div>
            <label htmlFor="az-do2" className="mb-1 block text-xs font-medium text-slate-600">
              Dissolved O₂
            </label>
            <input
              id="az-do2"
              type="number"
              step="0.1"
              min={0}
              value={dO2}
              onChange={(e) => setDO2(e.target.value)}
              className="az-input"
            />
          </div>
        </div>
      </div>

      {/* ── Result Panel ─────────────────────────────────────────── */}
      <div className="tide-card flex flex-col p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Analysis result
          {loading && (
            <span className="ml-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-tide-600" />
          )}
        </h3>

        {result ? (
          <div className="mt-4 flex flex-1 flex-col gap-5">
            {/* Severity + Score */}
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-sm font-bold uppercase ring-1 ring-inset ${severityColor[result.severity]}`}
              >
                {result.severity}
              </span>
              <div className="flex-1">
                <div className="flex items-end justify-between text-sm">
                  <span className="font-medium text-slate-700">Anomaly score</span>
                  <span className="font-mono font-bold text-slate-900">
                    {(result.anomalyScore * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${scoreBarColor[result.severity]}`}
                    style={{ width: `${Math.max(2, result.anomalyScore * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Indicators */}
            {result.indicators.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Detected indicators
                </h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {result.indicators.map((tag) => (
                    <span
                      key={tag}
                      className="pill bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation */}
            <div className="mt-auto rounded-lg bg-slate-50 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Recommended action
              </h4>
              <p className="mt-1 text-sm text-slate-700">{result.recommendedAction}</p>
            </div>

            {/* Thresholds reference */}
            <details className="text-xs text-slate-500">
              <summary className="cursor-pointer font-medium hover:text-slate-700">
                How scoring works
              </summary>
              <div className="mt-2 space-y-1 rounded-lg bg-slate-50 p-3 text-slate-600">
                <p><strong>Alert</strong> if: pH &lt; 6.5 or &gt; 8.6, turbidity &gt; 25 NTU, DO &lt; 4 mg/L, category = pollution, or keywords like oil/sheen/fish-kill.</p>
                <p><strong>Watch</strong> if: pH 6.5–7.0 or 8.3–8.6, turbidity 10–25 NTU, temp &gt; 28 °C, or keywords like algae/debris.</p>
                <p><strong>Info</strong> otherwise.</p>
                <p>Score is the sum of weighted flags, clamped to 0–1. Severity maps to score: &ge; 0.5 = alert, &ge; 0.2 = watch, &lt; 0.2 = info.</p>
              </div>
            </details>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
            Enter data on the left to see results.
          </div>
        )}
      </div>

      <style jsx global>{`
        .az-input {
          display: block;
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgb(203 213 225);
          background: #fff;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: rgb(15 23 42);
          outline: none;
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        .az-input:focus {
          border-color: rgb(45 144 255);
          box-shadow: 0 0 0 3px rgba(45, 144, 255, 0.2);
        }
        textarea.az-input {
          min-height: 4.5rem;
          resize: vertical;
        }
      `}</style>
    </div>
  );
}
