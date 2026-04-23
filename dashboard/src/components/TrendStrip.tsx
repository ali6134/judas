export function TrendStrip({ pulledAt }: { pulledAt: string }) {
  return (
    <section className="mx-auto max-w-[1400px] px-10 py-10">
      <div className="flex items-center justify-between border-t border-b border-brass-700/50 bg-ink-900 py-5 px-6">
        <div className="flex items-center gap-6">
          <div className="eyebrow text-brass-500">Trend log</div>
          <div className="h-4 w-px bg-brass-700" />
          <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-parchment-200">
            First entry logged <span className="text-parchment-50">{pulledAt}</span>
          </div>
        </div>
        <div className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-300">
          Awaiting next cycle · 1 data point
        </div>
      </div>
    </section>
  );
}
