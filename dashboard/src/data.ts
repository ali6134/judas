import verdictsRaw from "../../data/analyzed/ag1-verdicts-2026-04-22.json";
import rawRaw from "../../data/raw/ag1-2026-04-22.json";
import type { Dataset, Phase1Data, Phase3Data, Source } from "./types";

// Vite's JSON loader returns `any`-like structural types. Cast once, trust the shape.
const verdicts = verdictsRaw as unknown as Phase3Data;
const raw = rawRaw as unknown as Phase1Data;

const sourcesByChat: Record<string, Source[]> = {};
for (const r of raw.responses) {
  sourcesByChat[r.chat_id] = r.cited_sources ?? [];
}

export const dataset: Dataset = {
  ...verdicts,
  responses: verdicts.responses.map((r) => ({
    ...r,
    cited_sources: sourcesByChat[r.chat_id] ?? [],
  })),
};
