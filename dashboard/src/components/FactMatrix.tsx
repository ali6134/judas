import type { MatrixCellData, MatrixData, ModelId, Verdict } from "../types";
import { MODELS, MODEL_LABEL, CATEGORY_LABELS, VERDICT_RANK } from "../lib/labels";
import { MatrixCell } from "./MatrixCell";
import { Legend } from "./Legend";
import { SectionTitle } from "./SectionTitle";

export function FactMatrix({
  matrix,
  onCellClick,
}: {
  matrix: MatrixData;
  onCellClick: (category: string, model: ModelId, bucket: MatrixCellData) => void;
}) {
  const rows = Object.keys(matrix)
    .map((cat) => {
      let rank = 0;
      for (const m of MODELS) {
        const v = matrix[cat][m]?.verdicts ?? {};
        for (const k of Object.keys(v) as Verdict[]) {
          rank = Math.max(rank, VERDICT_RANK[k] * 10 + (v[k] ?? 0));
        }
      }
      return { cat, rank };
    })
    .sort((a, b) => b.rank - a.rank || a.cat.localeCompare(b.cat));

  return (
    <section className="relative mx-auto max-w-[1400px] px-10 pt-10 pb-6">
      <SectionTitle
        eyebrow="Section 02"
        title="Evidence log — category × LLM"
        trailing={
          <div className="eyebrow-muted text-brass-500/80">
            Click any cell · open exhibits
          </div>
        }
      />

      <div
        className="mt-8 paper-parchment border border-brass-700/60 shadow-[0_8px_30px_-14px_rgba(6,34,23,0.45)] anim-fade-up"
        style={{ animationDelay: "1000ms" }}
      >
        <div className="border-b border-brass-700/40 bg-parchment-100 px-7 py-4 flex items-center justify-between">
          <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-700">
            File · AG1-2026-04-22
          </div>
          <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-ink-500">
            {rows.length} categories · {MODELS.length} engines
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-brass-700/30">
                <th className="w-[44%] py-4 pl-7 pr-4 text-left">
                  <div className="eyebrow-muted text-ink-700">Fact category</div>
                </th>
                {MODELS.map((m) => (
                  <th key={m} className="py-4 px-3">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className="font-display text-ink-900"
                        style={{
                          fontSize: 15,
                          fontWeight: 550,
                          fontVariationSettings: "'SOFT' 30, 'opsz' 48",
                          letterSpacing: "-0.005em",
                        }}
                      >
                        {MODEL_LABEL[m]}
                      </div>
                      <div className="h-px w-6 bg-brass-600/70" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ cat }, i) => (
                <tr
                  key={cat}
                  className="border-b border-parchment-300/50 last:border-b-0 hover:bg-parchment-100/70 anim-fade-up"
                  style={{
                    animationDelay: `${1200 + i * 40}ms`,
                    animationDuration: "0.45s",
                  }}
                >
                  <td className="py-4 pl-7 pr-4">
                    <div
                      className="font-display text-ink-900"
                      style={{
                        fontSize: 17,
                        fontWeight: 500,
                        fontVariationSettings: "'SOFT' 50, 'opsz' 48",
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {CATEGORY_LABELS[cat] ?? cat}
                    </div>
                    <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                      {cat}
                    </div>
                  </td>
                  {MODELS.map((m) => {
                    const bucket = matrix[cat][m];
                    const summary = bucket
                      ? Object.entries(bucket.verdicts)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(" · ")
                      : undefined;
                    return (
                      <MatrixCell
                        key={m}
                        bucket={bucket}
                        model={m}
                        verdictSummary={summary}
                        onClick={() => bucket && onCellClick(cat, m, bucket)}
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-7 py-5">
          <Legend />
        </div>
      </div>
    </section>
  );
}
