/**
 * Global grain layer using SVG feTurbulence. Sits on top of everything,
 * ignores pointer events, gives the whole app a quiet paper/leather feel.
 */
export function GrainOverlay({ intensity = 0.06 }: { intensity?: number }) {
  return (
    <svg
      className="pointer-events-none fixed inset-0 z-40"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <filter id="judas-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix
          values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${intensity} 0`}
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#judas-grain)" />
    </svg>
  );
}
