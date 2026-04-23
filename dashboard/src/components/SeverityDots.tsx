import { motion } from "motion/react";

export function SeverityDots({ n }: { n: number }) {
  const clamped = Math.max(1, Math.min(5, n));
  return (
    <div className="flex items-center gap-2" title={`Severity ${clamped}/5`}>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
        severity
      </div>
      <div className="flex gap-[5px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={`block h-[9px] w-[9px] ${
              i <= clamped
                ? "bg-brass-500"
                : "bg-parchment-300 ring-1 ring-inset ring-brass-700/30"
            }`}
            style={{
              boxShadow: i <= clamped
                ? "inset 0 -1px 0 rgba(0,0,0,0.25), 0 1px 0 rgba(250,246,235,0.6)"
                : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}
