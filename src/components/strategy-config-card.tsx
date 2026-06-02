import { CheckCircle2, CircleDollarSign, RotateCcw, ShieldCheck } from "lucide-react";

import { selectedStrategy } from "@/data/mock-data";

export function StrategyConfigCard() {
  return (
    <section className="rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-textMuted">Selected strategy</div>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">{selectedStrategy.name}</h2>
        </div>
        <span className="rounded-md border border-borderSoft bg-panelMuted px-3 py-1.5 text-sm font-medium text-textMuted">
          {selectedStrategy.status}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <SummaryItem icon={<ShieldCheck size={17} />} label="Universe" value={selectedStrategy.universe} />
        <SummaryItem icon={<RotateCcw size={17} />} label="Rebalance" value={selectedStrategy.rebalance} />
        <SummaryItem icon={<CircleDollarSign size={17} />} label="Portfolio" value={selectedStrategy.holdings} />
        <SummaryItem
          icon={<CircleDollarSign size={17} />}
          label="Cost"
          value={selectedStrategy.transactionCost}
        />
      </div>

      <div className="mt-6">
        <div className="text-sm font-semibold">Rule stack</div>
        <div className="mt-3 space-y-3">
          {selectedStrategy.rules.map((rule) => (
            <div
              key={rule.label}
              className="flex gap-3 rounded-md border border-borderSoft bg-panelMuted p-3"
            >
              <CheckCircle2 className="mt-0.5 shrink-0 text-success" size={18} />
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

function SummaryItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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
