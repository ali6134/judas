import { useMemo, useState } from "react";
import { dataset } from "./data";
import type { MatrixCellData, ModelId } from "./types";
import { buildMatrix } from "./lib/matrix";

import { GrainOverlay } from "./components/GrainOverlay";
import { HeaderMasthead } from "./components/HeaderMasthead";
import { HeroRow } from "./components/HeroRow";
import { FactMatrix } from "./components/FactMatrix";
import { DetailPanel } from "./components/DetailPanel";
import { TrendStrip } from "./components/TrendStrip";
import { Footer } from "./components/Footer";

interface Selection {
  category: string;
  model: ModelId;
  bucket: MatrixCellData;
}

export default function App() {
  const matrix = useMemo(() => buildMatrix(dataset), []);
  const [selection, setSelection] = useState<Selection | null>(null);

  return (
    <>
      <div className="flex flex-1 flex-col bg-ink-950">
        <HeaderMasthead brand={dataset.brand} pulledAt={dataset.analyzed_at} />
        <main className="flex flex-1 flex-col bg-ink-900">
          <HeroRow perModel={dataset.per_model_accuracy} />
          <FactMatrix
            matrix={matrix}
            onCellClick={(category, model, bucket) =>
              setSelection({ category, model, bucket })
            }
          />
          <TrendStrip pulledAt={dataset.analyzed_at} />
          <Footer />
        </main>
      </div>
      <DetailPanel selection={selection} onClose={() => setSelection(null)} />
      <GrainOverlay intensity={0.055} />
    </>
  );
}
