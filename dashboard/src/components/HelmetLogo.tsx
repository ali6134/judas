import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { MouseEvent } from "react";

/**
 * Frontal Corinthian Spartan helmet, looking forward.
 *
 * Composition (viewBox 0 0 220 300, all currentColor):
 *   1. Vertical plume crest — tapered teardrop with horizontal feather striations
 *   2. Dome — rounded crown with a faint rivet band meeting the face mask
 *   3. Face mask + cheek pieces + three serrated chin points
 *   4. Negative cutouts (dark, matches surrounding background):
 *      - Two angled eye slits with the "angry" upward-inward slope
 *      - Vertical nasal guard descending from between the eyes
 *
 * Subtle cursor parallax (±2°) when `interactive` is true — just enough to feel
 * like the helmet is regarding you without breaking the frontal symmetry.
 */
export function HelmetLogo({
  className = "",
  size = 160,
  interactive = true,
  negativeColor = "var(--color-forest-900, #0a2a20)",
}: {
  className?: string;
  size?: number;
  interactive?: boolean;
  /** Color used for eye/nose cutouts. Should match the surrounding surface. */
  negativeColor?: string;
}) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotY = useSpring(useTransform(mx, [0, 1], [2, -2]), {
    stiffness: 140,
    damping: 20,
  });
  const rotX = useSpring(useTransform(my, [0, 1], [-2, 2]), {
    stiffness: 140,
    damping: 20,
  });

  function onMove(e: MouseEvent<HTMLDivElement>) {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }
  function onLeave() {
    if (!interactive) return;
    mx.set(0.5);
    my.set(0.5);
  }

  // Aspect ratio 220:300 — taller than wide, like the reference.
  const height = (size * 300) / 220;

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{
        width: size,
        height,
        rotateY: interactive ? rotY : 0,
        rotateX: interactive ? rotX : 0,
        perspective: 900,
        transformStyle: "preserve-3d",
      }}
    >
      <svg
        viewBox="0 0 220 300"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Judas"
        role="img"
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        {/* ─── PLUME ─── tapered teardrop with segmented feather striations */}
        <path
          fill="currentColor"
          d="
            M 110 6
            C 102 16, 98 34, 96 60
            C 94 74, 93 82, 92 90
            L 128 90
            C 127 82, 126 74, 124 60
            C 122 34, 118 16, 110 6
            Z
          "
        />
        {/* Feather separations on the plume (carve into the plume using negative color) */}
        <g stroke={negativeColor} strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.55">
          <path d="M 99 26 Q 110 22, 121 26" />
          <path d="M 97 46 Q 110 42, 123 46" />
          <path d="M 94 68 Q 110 64, 126 68" />
        </g>

        {/* ─── DOME ─── rounded crown */}
        <path
          fill="currentColor"
          d="
            M 50 144
            C 50 104, 76 82, 110 82
            C 144 82, 170 104, 170 144
            L 50 144
            Z
          "
        />

        {/* ─── RIVET BAND ─── thin horizontal groove where dome meets face */}
        <path
          d="M 54 144 L 166 144"
          stroke={negativeColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.42"
          fill="none"
        />

        {/* ─── FACE MASK + CHEEK PIECES + CHIN SERRATIONS ─── */}
        <path
          fill="currentColor"
          d="
            M 50 144
            L 50 192
            C 50 212, 56 232, 66 252
            L 76 268
            L 82 278
            L 90 264
            L 100 282
            L 110 294
            L 120 282
            L 130 264
            L 138 278
            L 144 268
            L 154 252
            C 164 232, 170 212, 170 192
            L 170 144
            Z
          "
        />

        {/* ─── NEGATIVE SPACE ─── eye slits + nasal guard opening */}
        {/* Left eye — angled, upper inner, lower outer (angry slant) */}
        <path
          fill={negativeColor}
          d="
            M 66 176
            L 98 167
            L 100 187
            L 68 194
            Z
          "
        />
        {/* Right eye — mirrored */}
        <path
          fill={negativeColor}
          d="
            M 122 167
            L 154 176
            L 152 194
            L 120 187
            Z
          "
        />
        {/* Vertical nasal guard cut (nose opening) with tapered bottom */}
        <path
          fill={negativeColor}
          d="
            M 100 187
            L 120 187
            L 120 226
            L 116 234
            L 110 240
            L 104 234
            L 100 226
            Z
          "
        />

        {/* Cheek contour lines for a touch of depth (subtle, 30% opacity) */}
        <g stroke={negativeColor} strokeWidth="1.6" fill="none" opacity="0.28">
          <path d="M 60 200 Q 70 228, 82 252" />
          <path d="M 160 200 Q 150 228, 138 252" />
        </g>
      </svg>
    </motion.div>
  );
}
