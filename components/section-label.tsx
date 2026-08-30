export function SectionLabel({ num, label }: { num: string; label: string }) {
  return (
    <div className="mb-10 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
        <span className="h-px w-10 bg-muted-foreground/50" />
        {num} — {label}
      </div>
      <span className="hidden sm:block font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40 select-none">
        Coded &amp; designed by Ikram
      </span>
    </div>
  )
}
