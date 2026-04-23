import { motion } from "motion/react";
import type { MatrixCellData } from "../types";
import { VerdictStamp } from "./VerdictStamp";
import { SeverityDots } from "./SeverityDots";

type Exhibit = MatrixCellData["claims"][number];

export function ClaimExhibit({
  claim,
  index,
  total,
}: {
  claim: Exhibit;
  index: number;
  total: number;
}) {
  const r = claim._response;
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="border border-brass-700/50 bg-parchment-50"
      style={{ boxShadow: "0 1px 0 rgba(255,253,245,0.7) inset, 0 -1px 0 rgba(139,111,47,0.25) inset" }}
    >
      {/* Header row: exhibit number, stamp, severity */}
      <div className="relative flex items-center justify-between gap-4 border-b border-brass-700/30 bg-parchment-100 px-6 py-4">
        <div className="flex items-center gap-5">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-700">
            Exhibit {index + 1} <span className="text-ink-500">/ {total}</span>
          </div>
          <div className="h-6 w-px bg-brass-700/40" />
          <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-500">
            {r.prompt_topic}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <SeverityDots n={claim.severity} />
          <div className="-my-3">
            <VerdictStamp verdict={claim.verdict} />
          </div>
        </div>
      </div>

      {/* Claim excerpt as a document block-quote */}
      <div className="px-6 pt-6">
        <div className="eyebrow-muted text-ink-500 mb-2">Extracted claim</div>
        <blockquote className="relative pl-5">
          <div className="absolute left-0 top-0 h-full w-[2px] bg-brass-500" />
          <p
            className="font-display italic text-ink-900"
            style={{
              fontSize: 18,
              lineHeight: 1.5,
              fontVariationSettings: "'SOFT' 90, 'opsz' 72",
              fontWeight: 400,
            }}
          >
            “{claim.claim_text}”
          </p>
        </blockquote>
      </div>

      {/* Ledger row: claimed vs ground truth */}
      <div className="mx-6 mt-6 grid grid-cols-[1fr_auto_1fr] items-stretch border-y border-brass-700/30">
        <div className="py-4 pr-4">
          <div className="eyebrow-muted text-ink-500">Claimed</div>
          <div className="mt-1.5 font-mono text-[13px] text-ink-900 break-words">
            {claim.claimed_value}
          </div>
        </div>
        <div className="rule-vertical-brass" />
        <div className="py-4 pl-4">
          <div className="eyebrow-muted text-verdict-correct">Ground truth</div>
          <div className="mt-1.5 font-mono text-[13px] text-verdict-correct break-words">
            {String(claim.ground_truth_value ?? "—")}
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div className="px-6 pt-5 pb-5">
        <div className="flex gap-3">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-brass-700 shrink-0 pt-[3px]">
            Reason —
          </div>
          <p className="font-display text-ink-700" style={{ fontSize: 14, lineHeight: 1.55, fontVariationSettings: "'SOFT' 80, 'opsz' 36" }}>
            {claim.reasoning}
          </p>
        </div>
      </div>

      {/* Footer: prompt + sources */}
      <div className="border-t border-brass-700/20 bg-parchment-100/60 px-6 py-4">
        <div className="flex flex-wrap items-start gap-x-6 gap-y-2">
          <div className="eyebrow-muted text-ink-500 pt-[2px]">Prompt</div>
          <div
            className="font-display text-ink-900"
            style={{ fontSize: 14, fontVariationSettings: "'SOFT' 70, 'opsz' 36", fontWeight: 450 }}
          >
            {r.prompt}
          </div>
        </div>
        {r.cited_sources.length > 0 && (
          <div className="mt-3 flex flex-col gap-1.5">
            <div className="eyebrow-muted text-ink-500">Sources ({r.cited_sources.length})</div>
            <ul className="flex flex-col gap-1">
              {r.cited_sources.slice(0, 6).map((s, i) => (
                <li key={i} className="flex flex-wrap items-baseline gap-3">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-brass-700 min-w-[140px]">
                    {s.domain ?? new URL(s.url).hostname}
                  </span>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11.5px] text-ink-700 hover:text-brass-700 break-all underline-offset-2 hover:underline"
                  >
                    {s.url}
                  </a>
                </li>
              ))}
              {r.cited_sources.length > 6 && (
                <li className="font-mono text-[10.5px] italic text-ink-500">
                  +{r.cited_sources.length - 6} more
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </motion.article>
  );
}
