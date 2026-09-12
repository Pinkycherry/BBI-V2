/**
 * The transition out of the dark band.
 *
 * Two offset layers so the crest reads as depth rather than a single cut —
 * the reference uses the same trick to stop the dark section ending on a
 * straight line.
 */
export function WaveDivider() {
  return (
    <div aria-hidden className="relative -mt-px bg-night leading-[0]">
      <svg viewBox="0 0 1440 150" preserveAspectRatio="none" className="block h-[90px] w-full sm:h-[150px]">
        <path
          fill="var(--color-coral)"
          d="M0,40 C240,90 420,10 720,34 C1020,58 1230,96 1440,52 L1440,150 L0,150 Z"
        />
        <path
          fill="var(--color-cream)"
          d="M0,70 C260,120 430,44 720,66 C1010,88 1240,124 1440,80 L1440,150 L0,150 Z"
        />
      </svg>
    </div>
  );
}
