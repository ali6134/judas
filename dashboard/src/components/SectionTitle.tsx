export function SectionTitle({
  eyebrow,
  title,
  trailing,
}: {
  eyebrow: string;
  title: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 anim-fade-up" style={{ animationDuration: "0.5s" }}>
      <div className="flex items-end gap-5">
        <div className="flex flex-col gap-2 pt-1">
          <div className="h-px w-12 bg-brass-500" />
          <div className="eyebrow text-brass-500">{eyebrow}</div>
        </div>
        <h2
          className="font-display text-parchment-50"
          style={{
            fontSize: 34,
            fontWeight: 550,
            fontVariationSettings: "'SOFT' 30, 'opsz' 72",
            letterSpacing: "-0.015em",
            lineHeight: 1,
          }}
        >
          {title}
        </h2>
      </div>
      {trailing}
    </div>
  );
}
