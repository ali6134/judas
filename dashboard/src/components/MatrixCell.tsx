import { motion } from "motion/react";
import type { MatrixCellData, ModelId, Verdict } from "../types";
import { worstVerdict } from "../lib/matrix";

interface Props {
  bucket: MatrixCellData | undefined;
  model: ModelId;
  onClick: () => void;
  verdictSummary?: string;
}

export function MatrixCell({ bucket, onClick, verdictSummary }: Props) {
  if (!bucket) {
    return (
      <td className="py-2 px-2 text-center">
        <div
          className="inline-flex h-9 w-9 items-center justify-center text-ink-500/50"
          aria-label="no claim"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden>
            <line x1="1" y1="1" x2="7" y2="7" stroke="currentColor" strokeWidth="0.75" />
            <line x1="7" y1="1" x2="1" y2="7" stroke="currentColor" strokeWidth="0.75" />
          </svg>
        </div>
      </td>
    );
  }

  const verdict = (worstVerdict(bucket.verdicts) ?? "correct") as Verdict;
  const total = Object.values(bucket.verdicts).reduce<number>((a, b) => a + (b ?? 0), 0);

  return (
    <td className="py-2 px-2 text-center">
      <motion.button
        onClick={onClick}
        whileHover={{ y: -3 }}
        whileTap={{ y: -1 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        title={verdictSummary}
        className={`relative inline-flex h-9 w-12 items-center justify-center
                    text-parchment-50
                    bg-v-${verdict} ring-v-${verdict}
                    transition-shadow duration-200
                    focus-visible:outline-none
                    cell-hover-glow-${verdict}`}
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.22), 0 2px 0 rgba(139,111,47,0.35)",
        }}
      >
        <span
          className={`font-display text-[15px] leading-none ${verdict === "outdated" ? "text-ink-900" : ""}`}
          style={{ fontVariationSettings: "'SOFT' 10, 'opsz' 48", fontWeight: 600 }}
        >
          {total}
        </span>
      </motion.button>
    </td>
  );
}
