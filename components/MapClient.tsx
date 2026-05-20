'use client';

import { useEffect, useMemo, useState } from 'react';
import L from 'leaflet';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngBoundsExpression } from 'leaflet';
import type { Observation, Severity } from '@/lib/types';
import { CATEGORIES, SEVERITY_COLORS } from '@/lib/types';

const catLabel = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label]));

export default function MapClient({ initial }: { initial: Observation[] }) {
  const [observations, setObservations] = useState<Observation[]>(initial);
  const [severity, setSeverity] = useState<Severity | 'all'>('all');
  const [category, setCategory] = useState<string>('all');
  const [fetchError, setFetchError] = useState<string | null>(null);
  const canvasRenderer = useMemo(() => L.canvas({ padding: 0.35 }), []);

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

  const bounds = useMemo<LatLngBoundsExpression | null>(() => {
    if (filtered.length === 0) return null;
    return filtered.map((o) => [o.lat, o.lng] as [number, number]);
  }, [filtered]);
  const indexed = useMemo(() => filtered.slice(0, 250), [filtered]);
  const markerRadius = filtered.length > 1000 ? 5 : 10;

  return (
    <div className="space-y-4">
      <div className="glass flex flex-wrap items-center gap-3 p-3">
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
              {c.label}
            </FilterChip>
          ))}
        </div>
        <div className="ml-auto flex gap-1.5">
          <FilterChip active={severity === 'all'} onClick={() => setSeverity('all')}>
            Any severity
          </FilterChip>
          {(['info', 'watch', 'alert'] as const).map((s) => (
            <FilterChip key={s} active={severity === s} onClick={() => setSeverity(s)}>
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: SEVERITY_COLORS[s] }}
              />{' '}
              {s}
            </FilterChip>
          ))}
        </div>
      </div>

      {fetchError && (
        <div className="rounded-xl border border-amber-200/70 bg-amber-50/80 px-4 py-2 text-sm text-amber-800 backdrop-blur" role="alert">
          Could not refresh observations: {fetchError}. Showing server-rendered data.
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="glass relative h-[70vh] min-h-[480px] overflow-hidden p-0">
          <MapContainer center={center} zoom={6} scrollWheelZoom className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds bounds={bounds} />
            {filtered.map((o) => (
              <CircleMarker
                key={o.id}
                center={[o.lat, o.lng]}
                radius={markerRadius}
                renderer={canvasRenderer}
                pathOptions={{
                  color: '#ffffff',
                  fillColor: SEVERITY_COLORS[o.severity],
                  fillOpacity: 0.92,
                  weight: filtered.length > 1000 ? 1 : 2,
                }}
              >
                <Popup>
                  <div className="space-y-1 font-sans">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      {catLabel[o.category]} | {o.severity}
                    </div>
                    <div className="text-[15px] font-semibold text-slate-900">
                      {o.locationName}
                    </div>
                    <div className="text-sm leading-relaxed text-slate-700">
                      {o.description}
                    </div>
                    <div className="text-[11px] text-slate-500">by {o.observer}</div>
                    {o.indicators.length > 0 && (
                      <div className="pt-1 text-[11px] text-slate-600">
                        {o.indicators.join(', ')}
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        <aside className="glass max-h-[70vh] min-h-[480px] overflow-hidden p-0">
          <div className="border-b border-slate-200/70 px-4 py-3">
            <div className="text-sm font-semibold text-slate-900">Observation index</div>
            <div className="mt-0.5 text-xs text-slate-500">
              {filtered.length} of {observations.length} sourced from the observations feed
              {filtered.length > indexed.length ? `; showing newest ${indexed.length}` : ''}
            </div>
          </div>
          <div className="max-h-[calc(70vh-58px)] overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-slate-500">
                No observations match these filters.
              </div>
            ) : (
              indexed.map((o) => (
                <a
                  key={o.id}
                  href={`/observations/${o.id}`}
                  className="block rounded-xl px-3 py-3 transition hover:bg-white/80"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900">
                        {o.locationName}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {catLabel[o.category]} | {new Date(o.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white"
                      style={{ background: SEVERITY_COLORS[o.severity] }}
                      aria-label={o.severity}
                    />
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">
                    {o.description}
                  </p>
                </a>
              ))
            )}
          </div>
        </aside>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <LegendDot color={SEVERITY_COLORS.info} label="Info" />
        <LegendDot color={SEVERITY_COLORS.watch} label="Watch" />
        <LegendDot color={SEVERITY_COLORS.alert} label="Alert" />
        <span className="ml-auto font-mono text-[11px]">
          {filtered.length} markers shown
        </span>
      </div>
    </div>
  );
}

function FitBounds({ bounds }: { bounds: LatLngBoundsExpression | null }) {
  const map = useMap();

  useEffect(() => {
    if (!bounds) return;
    map.fitBounds(bounds, {
      maxZoom: 8,
      padding: [36, 36],
    });
  }, [bounds, map]);

  return null;
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
      className={'chip inline-flex items-center gap-1.5 ' + (active ? 'chip-active' : '')}
    >
      {children}
    </button>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full ring-2 ring-white" style={{ background: color }} />
      {label}
    </span>
  );
}
