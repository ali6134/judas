import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import type { MatrixCellData, ModelId } from "../types";
import { CATEGORY_LABELS, MODEL_LABEL } from "../lib/labels";
import { ClaimExhibit } from "./ClaimExhibit";

interface Selection {
  category: string;
  model: ModelId;
  bucket: MatrixCellData;
}

export function DetailPanel({
  selection,
  onClose,
}: {
  selection: Selection | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!selection) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selection, onClose]);

  return (
    <AnimatePresence>
      {selection && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-ink-950/55 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: "105%" }}
            animate={{ x: 0 }}
            exit={{ x: "105%" }}
            transition={{
              type: "spring",
              stiffness: 190,
              damping: 26,
              mass: 0.9,
            }}
            className="fixed right-0 top-0 z-50 h-full w-[min(680px,100vw)] flex flex-col border-l border-brass-700/60"
          >
            {/* Header band */}
            <div className="relative paper-forest border-b border-brass-700/60 px-8 pb-6 pt-7">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="eyebrow text-brass-500">Evidence log</div>
                  <h3
                    className="mt-2 font-display text-parchment-50"
                    style={{
                      fontSize: 32,
                      fontVariationSettings: "'SOFT' 25, 'opsz' 96",
                      fontWeight: 600,
                      letterSpacing: "-0.015em",
                      lineHeight: 1.05,
                    }}
                  >
                    {CATEGORY_LABELS[selection.category] ?? selection.category}
                  </h3>
                  <div className="mt-3 flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-parchment-300/90">
                    <span>{selection.bucket.claims.length} exhibit{selection.bucket.claims.length === 1 ? "" : "s"}</span>
                    <span className="h-3 w-px bg-brass-500/60" />
                    <span>{MODEL_LABEL[selection.model]}</span>
                    <span className="h-3 w-px bg-brass-500/60" />
                    <span className="text-brass-500">{selection.category}</span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-parchment-200 border border-brass-500/60 px-3 py-2 hover:bg-brass-500/15"
                >
                  Close · Esc
                </button>
              </div>
              <div className="rule-brass absolute bottom-0 left-0 right-0" />
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto paper-parchment">
              <div className="flex flex-col gap-6 px-8 py-8">
                {selection.bucket.claims.map((c, i) => (
                  <ClaimExhibit
                    key={i}
                    claim={c}
                    index={i}
                    total={selection.bucket.claims.length}
                  />
                ))}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
