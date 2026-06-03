import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { cn } from "@/lib/utils";
import type { MetricTone } from "@/types/strategy";

const toneStyles: Record<MetricTone, string> = {
  positive: "text-success",
  negative: "text-danger",
  neutral: "text-textMuted"
};

export function MetricCard({
  label,
  value,
  detail,
  tone
}: {
  label: string;
  value: string;
  detail: string;
  tone: MetricTone;
}) {
  const Icon = tone === "positive" ? ArrowUpRight : tone === "negative" ? ArrowDownRight : Minus;

  return (
    <section className="rounded-md border border-borderSoft bg-panel p-4 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-textMuted">{label}</div>
        <div className="rounded-md bg-panelMuted p-1.5">
          <Icon className={cn(toneStyles[tone])} size={15} />
        </div>
      </div>
      <div className="mt-4 text-3xl font-semibold tracking-tight">{value}</div>
      <div className="mt-2 text-sm leading-6 text-textMuted">{detail}</div>
    </section>
  );
}
