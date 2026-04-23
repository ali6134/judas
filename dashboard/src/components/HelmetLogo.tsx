import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { MouseEvent } from "react";

/**
 * Side-profile Corinthian helmet, facing right.
 * Pure white with a dark plume eye. Traced as two main groups:
 *   1. Plume crest (top) arcing back
 *   2. Bowl + cheekpiece + neck + nose guard silhouette
 * Parallax tilt responds to cursor position across the helmet.
 */
export function HelmetLogo({
  className = "",
  size = 160,
  interactive = true,
}: {
  className?: string;
  size?: number;
  interactive?: boolean;
}) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotY = useSpring(useTransform(mx, [0, 1], [4, -4]), {
    stiffness: 140,
    damping: 18,
  });
  const rotX = useSpring(useTransform(my, [0, 1], [-3, 3]), {
    stiffness: 140,
    damping: 18,
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

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ width: size, height: size, rotateY: interactive ? rotY : 0, rotateX: interactive ? rotX : 0, perspective: 800 }}
    >
      <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-label="Judas" role="img">
        {/* ─── Plume crest: an arcing horsehair ridge with tuft bands ─── */}
        <g fill="currentColor">
          {/* Main plume body */}
          <path d="
            M 64 58
            C 68 38, 88 20, 124 18
            C 160 16, 182 28, 192 46
            C 196 54, 194 64, 186 68
            C 174 62, 156 58, 138 58
            C 118 58, 98 60, 80 66
            C 72 68, 64 66, 64 58 Z
          " />
          {/* Plume cascade falling to the rear */}
          <path d="
            M 58 66
            C 52 78, 48 94, 48 106
            C 48 114, 52 118, 58 118
            C 62 108, 66 94, 72 80
            C 68 74, 60 70, 58 66 Z
          " />
          {/* Plume tuft lines for texture */}
          <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.55">
            <path d="M 78 52 C 90 42, 110 38, 128 38" />
            <path d="M 90 46 C 108 38, 128 34, 150 34" />
            <path d="M 108 40 C 130 32, 158 30, 178 34" />
          </g>
        </g>

        {/* ─── Helmet bowl + cheek piece ─── */}
        <g fill="currentColor">
          <path d="
            M 60 104
            C 60 88, 70 76, 86 72
            L 170 72
            C 188 72, 200 86, 200 106
            L 200 128
            C 200 138, 194 146, 184 150
            L 178 152
            L 178 170
            C 192 170, 200 180, 198 196
            C 190 206, 174 212, 158 212
            L 128 212
            C 116 212, 106 206, 100 196
            L 96 188
            L 96 170
            L 80 170
            C 68 170, 58 162, 58 150
            L 58 128
            C 58 120, 60 112, 60 104 Z
          " />
        </g>

        {/* ─── Eye opening (dark negative space) ─── */}
        <path
          d="
            M 102 108
            C 108 104, 124 102, 140 104
            C 156 106, 168 112, 174 118
            L 172 124
            C 158 122, 140 122, 124 124
            C 112 126, 104 124, 102 120 Z
          "
          fill="var(--color-forest-950, #051c15)"
        />

        {/* ─── Nose guard slit ─── */}
        <path
          d="M 168 124 L 180 124 L 180 168 L 174 168 L 172 136 L 168 136 Z"
          fill="var(--color-forest-950, #051c15)"
        />

        {/* ─── Cheekpiece edge contour for extra depth ─── */}
        <g fill="none" stroke="var(--color-forest-950, #051c15)" strokeWidth="1.5" opacity="0.5">
          <path d="M 98 170 Q 110 186 128 198" />
          <path d="M 178 150 Q 180 158 180 170" />
        </g>
      </svg>
    </motion.div>
  );
}
