import { CheckCircle2, CircleDollarSign, RotateCcw, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { getStrategyRules } from "@/data/mock-data";
import { cn } from "@/lib/utils";
import type { StrategyConfig } from "@/types/strategy";

export function StrategyConfigCard({ strategy }: { strategy: StrategyConfig }) {
  const rules = getStrategyRules(strategy);

  return (
    <section className="rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-textMuted">Selected strategy</div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">{strategy.name}</h2>
        </div>
        <span className="rounded-md border border-borderSoft bg-panelMuted px-3 py-1.5 text-sm font-medium text-textMuted">
          Simulated Backtest
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <SummaryItem icon={<ShieldCheck size={17} />} label="Universe" value={strategy.universe} />
        <SummaryItem icon={<RotateCcw size={17} />} label="Rebalance" value={strategy.rebalance} />
        <SummaryItem icon={<CircleDollarSign size={17} />} label="Portfolio" value={strategy.portfolioSize} />
        <SummaryItem
          icon={<CircleDollarSign size={17} />}
          label="Cost"
          value={strategy.transactionCost}
        />
      </div>

      <div className="mt-6">
        <div className="text-sm font-semibold">Rule stack</div>
        <div className="mt-3 space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.label}
              className={cn(
                "flex gap-3 rounded-md border border-borderSoft bg-panelMuted p-3",
                !rule.enabled && "opacity-55"
              )}
            >
              <CheckCircle2 className={cn("mt-0.5 shrink-0", rule.enabled ? "text-success" : "text-textMuted")} size={18} />
              <div>
                <div className="text-sm font-medium">{rule.label}</div>
                <div className="mt-1 text-sm leading-5 text-textMuted">{rule.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SummaryItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-borderSoft bg-panelMuted p-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accentSoft text-accent">
        {icon}
      </div>
      <div>
        <div className="text-xs font-medium uppercase tracking-[0.14em] text-textMuted">{label}</div>
        <div className="mt-1 text-sm font-semibold">{value}</div>
      </div>
    </div>
  );
}
