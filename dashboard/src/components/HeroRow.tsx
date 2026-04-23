import type { PerModelAccuracy, ModelId } from "../types";
import { MODELS } from "../lib/labels";
import { DossierCard } from "./DossierCard";
import { SectionTitle } from "./SectionTitle";

export function HeroRow({
  perModel,
}: {
  perModel: Record<ModelId, PerModelAccuracy>;
}) {
  return (
    <section className="relative mx-auto max-w-[1400px] px-10 pt-14 pb-6">
      <SectionTitle eyebrow="Section 01" title="Fact accuracy — by LLM" />
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        {MODELS.map((m, i) => (
          <DossierCard
            key={m}
            index={i + 1}
            model={m}
            score={perModel[m]}
            delayMs={700 + i * 140}
          />
        ))}
      </div>
    </section>
  );
}
