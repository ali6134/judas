import { motion } from "motion/react";
import type { ModelId, PerModelAccuracy } from "../types";
import { MODEL_LABEL } from "../lib/labels";

interface Props {
  index: number;
  model: ModelId;
  score: PerModelAccuracy;
  delayMs: number;
}

export function DossierCard({ index, model, score, delayMs }: Props) {
  const accuracy = score.accuracy_pct ?? 0;
  const low = accuracy < 70;
  const strong = accuracy >= 85;

  const scoreColorClass = low
    ? "text-verdict-false"
    : strong
    ? "text-verdict-correct"
    : "text-brass-500";

  return (
    <motion.article
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group relative border border-brass-700/60 bg-parchment-100 px-7 py-6
                 shadow-[0_1px_0_0_rgba(255,253,245,0.6)_inset,0_-1px_0_0_rgba(139,111,47,0.25)_inset,0_4px_12px_-6px_rgba(10,42,32,0.2)]
                 transition-[border-color,box-shadow] duration-300 hover:border-brass-500
                 hover:shadow-[0_1px_0_0_rgba(255,253,245,0.8)_inset,0_-1px_0_0_rgba(139,111,47,0.4)_inset,0_10px_28px_-8px_rgba(10,42,32,0.3)]
                 anim-fade-up"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {/* Subject index ribbon */}
      <div className="flex items-center justify-between mb-4">
        <div className="eyebrow-muted">
          Subject · {String(index).padStart(2, "0")}
        </div>
        {low && <LowConfidenceSeal />}
      </div>

      {/* Model name */}
      <div
        className="font-display text-ink-900"
        style={{
          fontSize: 22,
          fontVariationSettings: "'SOFT' 40, 'opsz' 72",
          fontWeight: 550,
          letterSpacing: "-0.01em",
        }}
      >
        {MODEL_LABEL[model]}
      </div>

      {/* Accuracy numeral */}
      <div
        className={`numeral mt-5 leading-none ${scoreColorClass}`}
        style={{
          fontSize: 84,
          fontWeight: 500,
          fontVariationSettings: "'SOFT' 0, 'opsz' 144",
          letterSpacing: "-0.03em",
        }}
      >
        {accuracy.toFixed(1)}
        <span className="text-brass-700" style={{ fontSize: 36, fontWeight: 400 }}>
          %
        </span>
      </div>

      {/* Meta line */}
      <div className="mt-4 flex items-center gap-3 text-ink-500">
        <div className="h-px w-4 bg-brass-600/70" />
        <div className="font-mono text-[10.5px] uppercase tracking-[0.18em]">
          <span className="text-ink-700">{score.total_claims}</span> claims
          <span className="mx-2 text-brass-700">·</span>
          <span className={low ? "text-verdict-false" : "text-ink-700"}>
            {score.wrong}
          </span>{" "}
          discrepanc{score.wrong === 1 ? "y" : "ies"}
        </div>
      </div>
    </motion.article>
  );
}

function LowConfidenceSeal() {
  return (
    <div
      className="relative flex h-14 w-14 items-center justify-center rounded-full bg-verdict-false text-parchment-50"
      style={{
        transform: "rotate(-8deg)",
        boxShadow:
          "inset 0 0 0 2px rgba(250,246,235,0.4), inset 0 -4px 8px rgba(0,0,0,0.3)",
      }}
    >
      <div className="absolute inset-1 rounded-full border border-parchment-50/60" />
      <div
        className="font-display text-[9px] uppercase leading-[1.05] text-center"
        style={{
          fontVariationSettings: "'SOFT' 30, 'opsz' 12",
          fontWeight: 600,
          letterSpacing: "0.1em",
        }}
      >
        Low
        <br />
        Confidence
      </div>
    </div>
  );
}
