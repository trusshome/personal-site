import { NextRequest, NextResponse } from 'next/server';

const BASE = 'https://api.cal.com/v2';

export async function POST(req: NextRequest) {
  const apiKey = process.env.CAL_COM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'CAL_COM_API_KEY not set' }, { status: 500 });
  }

  try {
    const { eventTypeId, start, name, email, notes, timeZone } = await req.json();

    if (!eventTypeId || !start || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const body: Record<string, unknown> = {
      eventTypeId,
      start,
      attendee: {
        name,
        email,
        timeZone: timeZone ?? 'UTC',
      },
    };
    if (notes?.trim()) {
      body.bookingFieldsResponses = { notes: notes.trim() };
    }

    const res = await fetch(`${BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'cal-api-version': '2026-02-25',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.message ?? data.message ?? 'Cal.com booking failed' },
        { status: res.status },
      );
    }

    // v2 response: { status: "success", data: { uid, start, ... } }
    const booking = data.data ?? data;
    return NextResponse.json({
      uid: booking.uid,
      startTime: booking.start ?? booking.startTime,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
