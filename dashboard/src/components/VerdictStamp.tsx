import type { Verdict } from "../types";

export function VerdictStamp({ verdict }: { verdict: Verdict }) {
  const tone = verdict === "outdated";
  const textClass = tone ? "text-ink-900" : "text-parchment-50";
  return (
    <div
      className={`relative h-[72px] w-[72px] rounded-full bg-v-${verdict} ${textClass} flex items-center justify-center`}
      style={{
        transform: "rotate(-7deg)",
        boxShadow:
          "inset 0 0 0 2px rgba(250,246,235,0.35), inset 0 -6px 14px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.25)",
      }}
    >
      <div className="absolute inset-1.5 rounded-full border border-parchment-50/40" />
      <div
        className="font-display text-center leading-[1.02]"
        style={{
          fontSize: verdict === "hallucinated" || verdict === "unverifiable" ? 9.5 : 11,
          fontWeight: 650,
          fontVariationSettings: "'SOFT' 20, 'opsz' 24",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {verdict === "hallucinated" ? (
          <>Hallu-<br />cinated</>
        ) : verdict === "unverifiable" ? (
          <>Un-<br />verifiable</>
        ) : (
          verdict
        )}
      </div>
    </div>
  );
}
