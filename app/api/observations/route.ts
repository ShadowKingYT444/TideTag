import { NextRequest, NextResponse } from 'next/server';
import { createObservation, listObservations } from '@/lib/data';
import type { Category, ObservationInput } from '@/lib/types';

export const dynamic = 'force-dynamic';

const VALID_CATEGORIES: Category[] = [
  'water-quality',
  'sediment',
  'intertidal',
  'pollution',
  'wildlife',
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') ?? undefined;
  const severity = searchParams.get('severity') ?? undefined;
  const items = listObservations({ category, severity });
  return NextResponse.json({ observations: items });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = parseInput(body);
  if ('error' in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const observation = createObservation(parsed.value);
  return NextResponse.json({ observation }, { status: 201 });
}

function parseInput(raw: unknown): { value: ObservationInput } | { error: string } {
  if (!raw || typeof raw !== 'object') return { error: 'Body must be an object' };
  const b = raw as Record<string, unknown>;

  const observer = str(b.observer);
  const locationName = str(b.locationName);
  const description = str(b.description);
  const category = str(b.category);
  const lat = num(b.lat);
  const lng = num(b.lng);

  if (!observer) return { error: 'observer is required' };
  if (!locationName) return { error: 'locationName is required' };
  if (!description) return { error: 'description is required' };
  if (!category || !VALID_CATEGORIES.includes(category as Category)) {
    return { error: `category must be one of: ${VALID_CATEGORIES.join(', ')}` };
  }
  if (lat === undefined || lat < -90 || lat > 90) return { error: 'lat must be between -90 and 90' };
  if (lng === undefined || lng < -180 || lng > 180) return { error: 'lng must be between -180 and 180' };

  const photoUrl = str(b.photoUrl);
  const measurements =
    b.measurements && typeof b.measurements === 'object'
      ? {
          turbidityNTU: num((b.measurements as any).turbidityNTU),
          pH: num((b.measurements as any).pH),
          waterTempC: num((b.measurements as any).waterTempC),
          salinityPPT: num((b.measurements as any).salinityPPT),
          dissolvedO2: num((b.measurements as any).dissolvedO2),
        }
      : undefined;

  return {
    value: {
      observer,
      locationName,
      description,
      category: category as Category,
      lat,
      lng,
      photoUrl: photoUrl || undefined,
      measurements,
    },
  };
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim().length > 0 ? v.trim() : undefined;
}
function num(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v);
  return undefined;
}
