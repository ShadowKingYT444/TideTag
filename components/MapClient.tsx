'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Observation, Severity } from '@/lib/types';
import { SEVERITY_COLORS, CATEGORIES } from '@/lib/types';

const catLabel = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label]));

export default function MapClient({ initial }: { initial: Observation[] }) {
  const [observations, setObservations] = useState<Observation[]>(initial);
  const [severity, setSeverity] = useState<Severity | 'all'>('all');
  const [category, setCategory] = useState<string>('all');
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/observations')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to refresh observations');
        return r.json();
      })
      .then((data) => {
        if (!cancelled && Array.isArray(data.observations)) {
          setObservations(data.observations);
          setFetchError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setFetchError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return observations.filter(
      (o) =>
        (severity === 'all' || o.severity === severity) &&
        (category === 'all' || o.category === category),
    );
  }, [observations, severity, category]);

  const center: [number, number] = useMemo(() => {
    if (filtered.length === 0) return [37.5, -76];
    const lat = filtered.reduce((s, o) => s + o.lat, 0) / filtered.length;
    const lng = filtered.reduce((s, o) => s + o.lng, 0) / filtered.length;
    return [lat, lng];
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={category === 'all'} onClick={() => setCategory('all')}>
            All categories
          </FilterChip>
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c.value}
              active={category === c.value}
              onClick={() => setCategory(c.value)}
            >
              {c.emoji} {c.label}
            </FilterChip>
          ))}
        </div>
        <div className="flex gap-1.5">
          <FilterChip active={severity === 'all'} onClick={() => setSeverity('all')}>
            Any severity
          </FilterChip>
          {(['info', 'watch', 'alert'] as const).map((s) => (
            <FilterChip key={s} active={severity === s} onClick={() => setSeverity(s)}>
              {s}
            </FilterChip>
          ))}
        </div>
      </div>

      {fetchError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800" role="alert">
          Could not refresh observations: {fetchError}. Showing cached data.
        </div>
      )}

      <div className="tide-card h-[70vh] overflow-hidden p-0">
        <MapContainer center={center} zoom={6} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map((o) => (
            <CircleMarker
              key={o.id}
              center={[o.lat, o.lng]}
              radius={8}
              pathOptions={{
                color: SEVERITY_COLORS[o.severity],
                fillColor: SEVERITY_COLORS[o.severity],
                fillOpacity: 0.7,
                weight: 2,
              }}
            >
              <Popup>
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    {catLabel[o.category]} · {o.severity}
                  </div>
                  <div className="font-semibold">{o.locationName}</div>
                  <div className="text-sm text-slate-700">{o.description}</div>
                  <div className="text-xs text-slate-500">by {o.observer}</div>
                  {o.indicators.length > 0 && (
                    <div className="pt-1 text-xs text-slate-600">
                      {o.indicators.join(', ')}
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <LegendDot color={SEVERITY_COLORS.info} label="info" />
        <LegendDot color={SEVERITY_COLORS.watch} label="watch" />
        <LegendDot color={SEVERITY_COLORS.alert} label="alert" />
        <span className="ml-auto">{filtered.length} markers shown</span>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'rounded-full px-3 py-1 text-xs font-medium transition ' +
        (active
          ? 'bg-slate-900 text-white'
          : 'bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-100')
      }
    >
      {children}
    </button>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
