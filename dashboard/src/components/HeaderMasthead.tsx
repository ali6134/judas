import { HelmetLogo } from "./HelmetLogo";

export function HeaderMasthead({
  brand,
  pulledAt,
}: {
  brand: string;
  pulledAt: string;
}) {
  return (
    <header className="relative paper-forest overflow-hidden border-b border-brass-800/70">
      {/* Watermark helmet bleeding off right edge */}
      <div
        className="pointer-events-none absolute -right-32 -top-12 text-parchment-50/[0.045] anim-fade-in"
        style={{ animationDuration: "1.2s" }}
        aria-hidden
      >
        <HelmetLogo size={620} interactive={false} negativeColor="transparent" />
      </div>

      {/* Corner classification stamp */}
      <div
        className="absolute right-8 top-7 z-10 anim-fade-up"
        style={{ animationDelay: "900ms" }}
      >
        <div
          className="border border-brass-600 bg-parchment-50/95 px-4 py-2 text-ink-900 shadow-[0_2px_0_0_rgba(139,111,47,0.6)]"
          style={{ transform: "rotate(-3deg)" }}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500">
            Case file
          </div>
          <div
            className="font-display text-[15px] leading-none"
            style={{ fontVariationSettings: "'SOFT' 30, 'opsz' 48", fontWeight: 600 }}
          >
            {brand} · {pulledAt}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1400px] items-center gap-12 px-10 py-14">
        {/* Primary helmet */}
        <div className="text-parchment-50 shrink-0 anim-helmet">
          <HelmetLogo size={180} />
        </div>

        {/* Wordmark block */}
        <div className="relative flex flex-col">
          <div
            className="eyebrow text-brass-500 mb-4 anim-fade-up"
            style={{ animationDelay: "150ms", animationDuration: "0.5s" }}
          >
            Forensic LLM Fact-Check
          </div>

          <h1
            className="display-jumbo text-parchment-50 anim-rise-jumbo"
            style={{
              fontSize: "clamp(72px, 9.5vw, 132px)",
              letterSpacing: "-0.035em",
              fontVariationSettings: "'SOFT' 20, 'opsz' 144",
              fontWeight: 650,
              animationDelay: "240ms",
            }}
          >
            JUDAS
          </h1>

          <div
            className="mt-5 flex items-center gap-4 anim-fade-in"
            style={{ animationDelay: "700ms", animationDuration: "0.6s" }}
          >
            <div className="h-px w-16 bg-brass-500" />
            <div className="eyebrow text-brass-500">
              What LLMs really say about your brand
            </div>
          </div>
        </div>
      </div>

      {/* Bottom brass rule */}
      <div className="rule-brass absolute bottom-0 left-0 right-0" />
    </header>
  );
}
