import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { MetricTone } from "@/data/mock-data";
import { cn } from "@/lib/utils";

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
        <div className="text-sm font-medium text-textMuted">{label}</div>
        <Icon className={cn("mt-0.5", toneStyles[tone])} size={17} />
      </div>
      <div className="mt-4 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-sm text-textMuted">{detail}</div>
    </section>
  );
}
