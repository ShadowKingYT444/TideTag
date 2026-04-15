import { NextResponse } from 'next/server';
import { getObservation } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const observation = getObservation(params.id);
  if (!observation) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ observation });
}
