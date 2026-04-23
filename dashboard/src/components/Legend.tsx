import type { Verdict } from "../types";

const items: { verdict: Verdict | "empty"; label: string }[] = [
  { verdict: "correct", label: "Correct" },
  { verdict: "outdated", label: "Outdated" },
  { verdict: "false", label: "False" },
  { verdict: "hallucinated", label: "Hallucinated" },
  { verdict: "unverifiable", label: "Unverifiable" },
  { verdict: "empty", label: "No claim" },
];

export function Legend() {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-parchment-300/80 pt-5">
      <div className="eyebrow-muted text-ink-500/80">Verdict key</div>
      {items.map((it) => (
        <div key={it.verdict} className="flex items-center gap-2.5">
          {it.verdict === "empty" ? (
            <div className="h-3.5 w-3.5 border border-brass-700/60" />
          ) : (
            <div
              className={`h-3.5 w-3.5 bg-v-${it.verdict} ring-v-${it.verdict}`}
              style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.2), 0 1px 0 rgba(250,246,235,0.6)" }}
            />
          )}
          <div className="font-mono text-[10.5px] uppercase tracking-[0.15em] text-ink-700">
            {it.label}
          </div>
        </div>
      ))}
    </div>
  );
}
