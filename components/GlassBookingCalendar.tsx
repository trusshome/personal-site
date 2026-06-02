'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
  getDaysInMonth,
  startOfMonth,
  getDay,
  isBefore,
  startOfDay,
} from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const RIGHT_W = 400; // desktop only

type RightStep = 'slots' | 'form' | 'success';

function fmtTime(iso: string, tz: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: tz,
  }).format(new Date(iso));
}

// ── Shared input style ────────────────────────────────────────────────────────
const inputCls =
  'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-base text-white placeholder:text-white/30 transition-colors focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal/40';

export default function GlassBookingCalendar() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const today = React.useMemo(() => startOfDay(new Date()), []);
  const timeZone = React.useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  );

  // ── Left panel state ───────────────────────────────────────────────────────
  const [currentMonth, setCurrentMonth] = React.useState(today);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

  // ── Right panel state ──────────────────────────────────────────────────────
  const [step, setStep] = React.useState<RightStep>('slots');
  const [slots, setSlots] = React.useState<string[]>([]);
  const [eventTypeId, setEventTypeId] = React.useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null);
  const [slotsLoading, setSlotsLoading] = React.useState(false);
  const [slotsError, setSlotsError] = React.useState<string | null>(null);

  // ── Form state ─────────────────────────────────────────────────────────────
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [bookingError, setBookingError] = React.useState<string | null>(null);
  const [confirmation, setConfirmation] = React.useState<{
    start: string;
    uid: string;
  } | null>(null);

  const cells = React.useMemo(() => {
    const start = startOfMonth(currentMonth);
    const total = getDaysInMonth(currentMonth);
    const leading = getDay(start);
    const days = Array.from({ length: total }, (_, i) => {
      const date = new Date(start.getFullYear(), start.getMonth(), i + 1);
      return { date, isPast: isBefore(date, today), isToday: isToday(date) };
    });
    return [...Array(leading).fill(null), ...days] as (null | typeof days[0])[];
  }, [currentMonth, today]);

  // Fetch available slots whenever the selected date changes.
  const handleDateClick = async (date: Date) => {
    setSelectedDate(date);
    setStep('slots');
    setSelectedSlot(null);
    setSlots([]);
    setBookingError(null);
    setSlotsError(null);
    setSlotsLoading(true);

    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const res = await fetch(
        `/api/cal/slots?date=${dateStr}&timeZone=${encodeURIComponent(timeZone)}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not load availability');
      setSlots(data.slots ?? []);
      setEventTypeId(data.eventTypeId ?? null);
    } catch (err: any) {
      setSlotsError(err.message);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleSlotClick = (slot: string) => {
    setSelectedSlot(slot);
    setBookingError(null);
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !eventTypeId) return;

    setSubmitting(true);
    setBookingError(null);

    try {
      const res = await fetch('/api/cal/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventTypeId,
          start: selectedSlot,
          name,
          email,
          notes,
          timeZone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Booking failed');
      setConfirmation({ start: data.startTime ?? selectedSlot, uid: data.uid });
      setStep('success');
    } catch (err: any) {
      setBookingError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="flex flex-col sm:flex-row overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-ink/50 text-white shadow-2xl backdrop-blur-2xl w-full sm:w-auto"
      aria-label="Booking calendar"
    >
      {/* ── LEFT: date grid — hidden on mobile once a date is selected so the
           calendar never expands (no layout shift, no Liquid Glass break).
           Each step is a full replacement view; a back button lets users
           return to the date picker. ── */}
      <div className={cn('w-full sm:w-72 flex-shrink-0 p-4 sm:p-5', isMobile && selectedDate && 'hidden sm:block')}>
        {/* Month nav */}
        <div className="mb-4 flex items-center justify-between">
          <motion.p
            key={format(currentMonth, 'MMMM yyyy')}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18 }}
            className="font-display text-base font-semibold tracking-tight"
          >
            {format(currentMonth, 'MMMM yyyy')}
          </motion.p>
          <div className="flex gap-0.5">
            <button
              onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
              className="rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
              className="rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10"
              aria-label="Next month"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Day labels */}
        <div className="mb-1 grid grid-cols-7">
          {WEEK_DAYS.map((d) => (
            <div
              key={d}
              className="py-1 text-center font-mono text-[9px] font-bold uppercase text-white/30"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-y-0.5">
          {cells.map((cell, i) => {
            if (!cell) return <div key={`e-${i}`} aria-hidden />;
            const isSel = selectedDate ? isSameDay(cell.date, selectedDate) : false;
            return (
              <div
                key={format(cell.date, 'yyyy-MM-dd')}
                className="flex items-center justify-center"
              >
                <button
                  onClick={() => !cell.isPast && handleDateClick(cell.date)}
                  disabled={cell.isPast}
                  aria-label={format(cell.date, 'EEEE MMMM d')}
                  aria-pressed={isSel}
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all duration-150
                    ${isSel
                      ? 'bg-signal text-white shadow-[0_0_12px_var(--color-signal)]'
                      : cell.isPast
                      ? 'cursor-not-allowed text-white/20'
                      : 'text-white/80 hover:bg-white/15 hover:text-white'
                    }`}
                >
                  {cell.isToday && !isSel && (
                    <span
                      aria-hidden
                      className="absolute bottom-1 h-1 w-1 rounded-full bg-signal"
                    />
                  )}
                  {format(cell.date, 'd')}
                </button>
              </div>
            );
          })}
        </div>

        {selectedDate && (
          <p className="mt-4 text-center font-mono text-[10px] text-white/40">
            {format(selectedDate, 'EEE, MMM d')}
          </p>
        )}
        {!selectedDate && (
          <p className="mt-4 text-center font-mono text-[10px] text-white/25">
            Pick a day to see times
          </p>
        )}
      </div>

      {/* ── Divider — hidden on mobile once a date is selected ─────────────── */}
      <AnimatePresence>
        {selectedDate && !isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={isMobile ? 'h-px w-full flex-shrink-0 bg-white/10' : 'w-px flex-shrink-0 bg-white/10'}
          />
        )}
      </AnimatePresence>

      {/* ── RIGHT: slots → form → success ──────────────────────────────────── */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            key="right-panel"
            initial={isMobile ? { height: 0, opacity: 0 } : { width: 0, opacity: 0 }}
            animate={isMobile ? { height: 'auto', opacity: 1 } : { width: RIGHT_W, opacity: 1 }}
            exit={isMobile ? { height: 0, opacity: 0 } : { width: 0, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0.08 }}
            className="flex-shrink-0 overflow-hidden"
            style={isMobile ? undefined : { minHeight: 420 }}
          >
            <AnimatePresence mode="wait" initial={false}>

              {/* ── STEP: time slots ─────────────────────────────────────── */}
              {step === 'slots' && (
                <motion.div
                  key="slots"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-full flex-col p-4 sm:p-5 w-full sm:w-[400px]"
                >
                  {isMobile && (
                    <button
                      onClick={() => { setSelectedDate(null); setSlots([]); setSlotsError(null); }}
                      className="mb-3 flex items-center gap-1 self-start font-mono text-xs text-white/40 transition-colors hover:text-white"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      Change date
                    </button>
                  )}
                  <p className="mb-1 font-display text-sm font-semibold text-white/70">
                    Available times
                  </p>
                  {isMobile && selectedDate && (
                    <p className="mb-4 font-mono text-[10px] text-white/40">
                      {format(selectedDate, 'EEE, MMM d')}
                    </p>
                  )}

                  {slotsLoading && (
                    <div className="flex flex-1 items-center justify-center gap-2 text-white/40">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="font-mono text-xs">Loading…</span>
                    </div>
                  )}

                  {slotsError && (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                      <p className="text-sm text-white/50">{slotsError}</p>
                      <button
                        onClick={() => selectedDate && handleDateClick(selectedDate)}
                        className="font-mono text-xs text-signal hover:underline"
                      >
                        Try again
                      </button>
                    </div>
                  )}

                  {!slotsLoading && !slotsError && slots.length === 0 && (
                    <div className="flex flex-1 items-center justify-center">
                      <p className="text-center text-sm text-white/40">
                        No availability on this day.
                        <br />Try another date.
                      </p>
                    </div>
                  )}

                  {!slotsLoading && slots.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 overflow-y-auto pr-1 max-h-28 sm:max-h-[360px]">
                      {slots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => handleSlotClick(slot)}
                          className="rounded-xl border border-white/10 px-3 py-2.5 text-sm font-medium text-white/80 transition-all duration-150 hover:border-signal/60 hover:bg-signal/10 hover:text-white"
                        >
                          {fmtTime(slot, timeZone)}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── STEP: booking form ───────────────────────────────────── */}
              {step === 'form' && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-full flex-col p-4 sm:p-5 w-full sm:w-[400px]"
                >
                  <button
                    onClick={() => setStep('slots')}
                    className="mb-4 flex items-center gap-1 self-start font-mono text-xs text-white/40 transition-colors hover:text-white"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    {selectedSlot && fmtTime(selectedSlot, timeZone)}
                  </button>

                  <p className="mb-1 font-display text-sm font-semibold text-white/70">
                    Confirm your booking
                  </p>
                  {isMobile && selectedDate && selectedSlot && (
                    <p className="mb-4 font-mono text-[10px] text-white/40">
                      {format(selectedDate, 'EEE, MMM d')} · {fmtTime(selectedSlot, timeZone)}
                    </p>
                  )}

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3"
                    onFocus={(e) => {
                      // Make the scroll container in page.tsx scrollable so
                      // onViewportResize can scroll the focused input above the keyboard.
                      const root = e.currentTarget.closest('[aria-label="Booking calendar"]') as HTMLElement | null;
                      if (root) root.style.paddingBottom = '320px';
                    }}
                    onBlur={(e) => {
                      // Only remove padding when focus leaves the form entirely.
                      if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
                      const root = e.currentTarget.closest('[aria-label="Booking calendar"]') as HTMLElement | null;
                      if (root) root.style.paddingBottom = '';
                    }}
                  >
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputCls}
                      autoComplete="name"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputCls}
                      autoComplete="email"
                    />
                    <textarea
                      placeholder="Additional notes (optional)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className={`${inputCls} resize-none`}
                    />

                    {bookingError && (
                      <p className="font-mono text-xs text-red-400">{bookingError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="group relative mt-1 inline-flex h-10 items-center justify-center overflow-hidden rounded-full bg-ink px-5 text-sm font-medium text-white transition-all duration-200 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
                    >
                      <span
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-r from-signal via-signal-dark to-cyan-motion opacity-60 blur transition-opacity duration-500 group-hover:opacity-90 group-disabled:opacity-30"
                      />
                      <span className="relative flex items-center gap-2">
                        {submitting ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Booking…</>
                        ) : (
                          'Confirm booking'
                        )}
                      </span>
                    </button>
                  </form>
                </motion.div>
              )}

              {/* ── STEP: success ────────────────────────────────────────── */}
              {step === 'success' && confirmation && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center"
                  style={{ width: RIGHT_W }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5, bounce: 0.3, delay: 0.1 }}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-signal shadow-[0_0_24px_var(--color-signal)]"
                  >
                    <Check className="h-7 w-7 text-white" strokeWidth={2.5} />
                  </motion.div>

                  <div>
                    <p className="font-display text-lg font-semibold">
                      You're booked!
                    </p>
                    <p className="mt-1 text-sm text-white/50">
                      {format(new Date(confirmation.start), 'EEEE, MMMM d')}
                      {' · '}
                      {fmtTime(confirmation.start, timeZone)}
                    </p>
                  </div>

                  <p className="max-w-[260px] font-mono text-xs leading-relaxed text-white/35">
                    A confirmation email is on its way to {email}. See you then.
                  </p>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
