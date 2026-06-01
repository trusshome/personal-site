type WordmarkProps = {
  /** On dark sections the non-LOU letters become paper. LOU stays signal. */
  dark?: boolean;
  /** Compact bracketed mark for nav and favicon: [LOU]. */
  compact?: boolean;
  className?: string;
};

export default function Wordmark({ dark, compact, className }: WordmarkProps) {
  const base = dark ? 'text-paper' : 'text-ink';

  if (compact) {
    return (
      <span className={`font-display font-medium tracking-tight ${base} ${className ?? ''}`}>
        [<span className="text-signal">LOU</span>]
      </span>
    );
  }

  // One unbroken word. The spans sit flush so it reads "entity resoLOUtion".
  return (
    <span className={`font-display font-medium tracking-tight ${base} ${className ?? ''}`}>
      entity reso<span className="text-signal">LOU</span>tion
    </span>
  );
}
