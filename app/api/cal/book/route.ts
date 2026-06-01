import { NextRequest, NextResponse } from 'next/server';

const BASE = 'https://api.cal.com/v2';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_START_RE = /^\d{4}-\d{2}-\d{2}T/;
const MAX_NAME  = 100;
const MAX_NOTES = 1000;

export async function POST(req: NextRequest) {
  const apiKey = process.env.CAL_COM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'CAL_COM_API_KEY not set' }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { eventTypeId, start, name, email, notes, timeZone } =
    body as Record<string, unknown>;

  // --- Input validation ---
  if (typeof eventTypeId !== 'number' || !Number.isInteger(eventTypeId) || eventTypeId <= 0) {
    return NextResponse.json({ error: 'Invalid event type' }, { status: 400 });
  }
  if (typeof start !== 'string' || !ISO_START_RE.test(start)) {
    return NextResponse.json({ error: 'Invalid start time' }, { status: 400 });
  }
  if (typeof name !== 'string' || name.trim().length === 0 || name.length > MAX_NAME) {
    return NextResponse.json({ error: 'Name is required (max 100 characters)' }, { status: 400 });
  }
  if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
  }
  if (notes !== undefined && notes !== null) {
    if (typeof notes !== 'string' || notes.length > MAX_NOTES) {
      return NextResponse.json({ error: 'Notes exceed maximum length' }, { status: 400 });
    }
  }

  const payload: Record<string, unknown> = {
    eventTypeId,
    start,
    attendee: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      timeZone: typeof timeZone === 'string' ? timeZone : 'UTC',
    },
  };

  const trimmedNotes = typeof notes === 'string' ? notes.trim() : '';
  if (trimmedNotes) {
    payload.bookingFieldsResponses = { notes: trimmedNotes };
  }

  try {
    const res = await fetch(`${BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'cal-api-version': '2026-02-25',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      // Return a safe message. Avoid leaking Cal.com internals for server errors;
      // client errors (slot taken, etc.) are safe to surface.
      const safeMessage =
        res.status < 500
          ? (data.error?.message ?? data.message ?? 'Booking could not be completed')
          : 'Booking could not be completed';
      return NextResponse.json({ error: safeMessage }, { status: res.status });
    }

    const booking = data.data ?? data;
    return NextResponse.json({
      uid: booking.uid,
      startTime: booking.start ?? booking.startTime,
    });
  } catch {
    return NextResponse.json({ error: 'Booking could not be completed' }, { status: 500 });
  }
}
