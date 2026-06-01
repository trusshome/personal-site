import { track } from '@vercel/analytics';

/**
 * The single conversion event. Fired on every Book a call click.
 * The book link opens in a new tab, so the page stays alive and the event
 * has time to send. track() also uses navigator.sendBeacon under the hood,
 * so the event survives even if a click ever becomes a same-tab navigation.
 */
export function trackBookACall(location?: string) {
  track('book_a_call', location ? { location } : {});
}
