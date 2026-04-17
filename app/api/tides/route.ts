import { NextRequest, NextResponse } from 'next/server';
import { fetchTideSnapshot } from '@/lib/tides';

export const revalidate = 300;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get('lat'));
  const lng = Number(searchParams.get('lng'));

  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    return NextResponse.json({ error: 'lat must be between -90 and 90' }, { status: 400 });
  }
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
    return NextResponse.json({ error: 'lng must be between -180 and 180' }, { status: 400 });
  }

  try {
    const snapshot = await fetchTideSnapshot(lat, lng);
    return NextResponse.json(snapshot, {
      headers: {
        'cache-control': 'public, s-maxage=300, stale-while-revalidate=900',
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: 'Tide service unavailable',
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }
}
