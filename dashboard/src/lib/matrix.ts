import type { Dataset, MatrixData, Verdict } from "../types";
import { VERDICT_RANK } from "./labels";

export function buildMatrix(ds: Dataset): MatrixData {
  const matrix: MatrixData = {};
  for (const r of ds.responses) {
    for (const c of r.claims) {
      const cat = c.fact_category;
      const model = r.model;
      matrix[cat] ??= {};
      matrix[cat][model] ??= { verdicts: {}, claims: [] };
      const bucket = matrix[cat][model]!;
      bucket.verdicts[c.verdict] = (bucket.verdicts[c.verdict] ?? 0) + 1;
      bucket.claims.push({ ...c, _response: r });
    }
  }
  return matrix;
}

export function worstVerdict(verdicts: Partial<Record<Verdict, number>>): Verdict | null {
  const keys = Object.keys(verdicts) as Verdict[];
  if (!keys.length) return null;
  return keys.reduce<Verdict>(
    (a, b) => (VERDICT_RANK[b] > VERDICT_RANK[a] ? b : a),
    keys[0]
  );
}
