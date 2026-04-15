import { NextRequest, NextResponse } from 'next/server';
import { analyze } from '@/lib/analyze';
import type { Category } from '@/lib/types';

export const dynamic = 'force-dynamic';

const VALID_CATEGORIES: Category[] = [
  'water-quality',
  'sediment',
  'intertidal',
  'pollution',
  'wildlife',
];

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const category = body?.category;
  if (typeof category !== 'string' || !VALID_CATEGORIES.includes(category as Category)) {
    return NextResponse.json(
      { error: `category must be one of: ${VALID_CATEGORIES.join(', ')}` },
      { status: 400 },
    );
  }

  const description = typeof body?.description === 'string' ? body.description : '';
  const measurements = body?.measurements && typeof body.measurements === 'object' ? body.measurements : undefined;

  const result = analyze({ category: category as Category, description, measurements });
  return NextResponse.json(result);
}
