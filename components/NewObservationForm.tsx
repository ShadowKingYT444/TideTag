'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/types';
import type { Category } from '@/lib/types';

type State = 'idle' | 'submitting' | 'success' | 'error';

export function NewObservationForm() {
  const router = useRouter();
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    observer: '',
    locationName: '',
    lat: '',
    lng: '',
    category: 'water-quality' as Category,
    description: '',
    photoUrl: '',
    turbidityNTU: '',
    pH: '',
    waterTempC: '',
    salinityPPT: '',
    dissolvedO2: '',
  });

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function useMyLocation() {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported on this device.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        update('lat', pos.coords.latitude.toFixed(5));
        update('lng', pos.coords.longitude.toFixed(5));
      },
      () => setError('Could not read device location.'),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('submitting');
    setError(null);

    const payload = {
      observer: form.observer,
      locationName: form.locationName,
      lat: form.lat === '' ? undefined : Number(form.lat),
      lng: form.lng === '' ? undefined : Number(form.lng),
      category: form.category,
      description: form.description,
      photoUrl: form.photoUrl || undefined,
      measurements: {
        turbidityNTU: form.turbidityNTU === '' ? undefined : Number(form.turbidityNTU),
        pH: form.pH === '' ? undefined : Number(form.pH),
        waterTempC: form.waterTempC === '' ? undefined : Number(form.waterTempC),
        salinityPPT: form.salinityPPT === '' ? undefined : Number(form.salinityPPT),
        dissolvedO2: form.dissolvedO2 === '' ? undefined : Number(form.dissolvedO2),
      },
    };

    try {
      const res = await fetch('/api/observations', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) {
        setState('error');
        setError(body?.error || 'Submission failed');
        return;
      }
      setState('success');
      setTimeout(() => {
        router.push('/observations');
        router.refresh();
      }, 1600);
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Network error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="glass p-6">
        <SectionTitle label="Reporter" index="01" />
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <Field label="Observer name" required>
            <input
              type="text"
              value={form.observer}
              onChange={(e) => update('observer', e.target.value)}
              required
              className="tt-input"
              placeholder="Your name or team"
            />
          </Field>
          <Field label="Location name" required>
            <input
              type="text"
              value={form.locationName}
              onChange={(e) => update('locationName', e.target.value)}
              required
              className="tt-input"
              placeholder="e.g. Jamaica Bay outfall channel"
            />
          </Field>
        </div>
      </div>

      <div className="glass p-6">
        <SectionTitle label="Where" index="02" />
        <div className="mt-4 grid gap-5 md:grid-cols-[1fr_1fr_auto]">
          <Field label="Latitude" required>
            <input
              type="number"
              step="0.00001"
              min={-90}
              max={90}
              value={form.lat}
              onChange={(e) => update('lat', e.target.value)}
              required
              className="tt-input font-mono"
            />
          </Field>
          <Field label="Longitude" required>
            <input
              type="number"
              step="0.00001"
              min={-180}
              max={180}
              value={form.lng}
              onChange={(e) => update('lng', e.target.value)}
              required
              className="tt-input font-mono"
            />
          </Field>
          <div className="flex items-end">
            <button type="button" onClick={useMyLocation} className="btn-secondary h-[46px]">
              <LocationIcon />
              Use my location
            </button>
          </div>
        </div>
      </div>

      <div className="glass p-6">
        <SectionTitle label="What" index="03" />
        <div className="mt-4 grid gap-5">
          <Field label="Category" required>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => update('category', c.value)}
                  className={
                    'chip inline-flex items-center gap-1.5 ' +
                    (form.category === c.value ? 'chip-active' : '')
                  }
                >
                  <span aria-hidden>{c.emoji}</span> {c.label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Description" required>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              required
              rows={4}
              className="tt-input"
              placeholder="What did you see? Water color, debris, wildlife, smells, recent weather…"
            />
          </Field>
          <Field label="Photo URL (optional)">
            <input
              type="url"
              value={form.photoUrl}
              onChange={(e) => update('photoUrl', e.target.value)}
              className="tt-input"
              placeholder="https://…"
            />
          </Field>
        </div>
      </div>

      <div className="glass p-6">
        <SectionTitle label="Measurements" index="04" optional />
        <p className="mt-1 text-sm text-slate-500">
          If you have a water-quality meter handy, enter any of these.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Field label="Turbidity (NTU)">
            <input
              type="number"
              step="0.1"
              min={0}
              value={form.turbidityNTU}
              onChange={(e) => update('turbidityNTU', e.target.value)}
              className="tt-input font-mono"
            />
          </Field>
          <Field label="pH">
            <input
              type="number"
              step="0.01"
              min={0}
              max={14}
              value={form.pH}
              onChange={(e) => update('pH', e.target.value)}
              className="tt-input font-mono"
            />
          </Field>
          <Field label="Water temp (°C)">
            <input
              type="number"
              step="0.1"
              value={form.waterTempC}
              onChange={(e) => update('waterTempC', e.target.value)}
              className="tt-input font-mono"
            />
          </Field>
          <Field label="Salinity (PPT)">
            <input
              type="number"
              step="0.1"
              min={0}
              value={form.salinityPPT}
              onChange={(e) => update('salinityPPT', e.target.value)}
              className="tt-input font-mono"
            />
          </Field>
          <Field label="Dissolved O₂ (mg/L)">
            <input
              type="number"
              step="0.1"
              min={0}
              value={form.dissolvedO2}
              onChange={(e) => update('dissolvedO2', e.target.value)}
              className="tt-input font-mono"
            />
          </Field>
        </div>
      </div>

      {state === 'success' && (
        <div className="rounded-xl border border-green-200/70 bg-green-50/80 px-4 py-3 text-sm text-green-800 backdrop-blur" role="status">
          Observation submitted. Severity and indicators have been assigned automatically. Redirecting…
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200/70 bg-red-50/80 px-4 py-3 text-sm text-red-800 backdrop-blur" role="alert">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={state === 'submitting' || state === 'success'}
          className="btn-primary"
        >
          {state === 'submitting'
            ? 'Submitting…'
            : state === 'success'
            ? 'Submitted'
            : 'Submit observation'}
        </button>
        <p className="text-xs text-slate-500">
          Severity and indicators are assigned automatically.
        </p>
      </div>
    </form>
  );
}

function SectionTitle({
  label,
  index,
  optional,
}: {
  label: string;
  index: string;
  optional?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-[11px] font-semibold tracking-[0.18em] text-slate-400">
        {index}
      </span>
      <h2 className="text-base font-semibold tracking-tight text-slate-900">
        {label}
        {optional && (
          <span className="ml-2 text-xs font-normal text-slate-400">optional</span>
        )}
      </h2>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 18s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z" /><circle cx="10" cy="8" r="2" />
    </svg>
  );
}
