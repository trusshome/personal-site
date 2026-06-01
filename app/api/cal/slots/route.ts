import { NextRequest, NextResponse } from 'next/server';

const BASE = 'https://api.cal.com/v2';

let cachedEventTypeId: number | null = null;

async function getEventTypeId(apiKey: string): Promise<number> {
  if (cachedEventTypeId) return cachedEventTypeId;

  const res = await fetch(`${BASE}/event-types`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'cal-api-version': '2024-06-14',
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error('Could not fetch event types from Cal.com');

  const json = await res.json();
  const et = (json.data as any[])?.find((e) => e.slug === '30min');
  if (!et) throw new Error('No 30min event type found on this Cal.com account');

  cachedEventTypeId = et.id as number;
  return cachedEventTypeId;
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.CAL_COM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'CAL_COM_API_KEY not set' }, { status: 500 });
  }

  const { searchParams } = req.nextUrl;
  const date = searchParams.get('date');
  const timeZone = searchParams.get('timeZone') ?? 'UTC';

  if (!date) return NextResponse.json({ error: 'date param required' }, { status: 400 });

  try {
    const eventTypeId = await getEventTypeId(apiKey);

    const url = new URL(`${BASE}/slots`);
    url.searchParams.set('eventTypeId', String(eventTypeId));
    url.searchParams.set('start', `${date}T00:00:00.000Z`);
    url.searchParams.set('end', `${date}T23:59:59.000Z`);
    url.searchParams.set('timeZone', timeZone);
    url.searchParams.set('format', 'time');

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'cal-api-version': '2024-09-04',
      },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Cal.com slots request failed');

    const data = await res.json();

    // v2 wraps the payload: { status, data: { "YYYY-MM-DD": [...] } }
    const slotsMap = data.data ?? data.slots ?? {};
    const raw: unknown[] = slotsMap[date] ?? [];
    const slots: string[] = raw.map((s) =>
      typeof s === 'string'
        ? s
        : (s as { start: string }).start ?? (s as { time: string }).time,
    );

    return NextResponse.json({ slots, eventTypeId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
