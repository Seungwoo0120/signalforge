import { GitCompareArrows } from "lucide-react";

import { benchmarkStats } from "@/data/mock-data";

export function BenchmarkComparison() {
  return (
    <section className="rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accentSoft text-accent">
          <GitCompareArrows size={20} />
        </div>
        <div>
          <h2 className="text-base font-semibold tracking-tight">Benchmark Comparison</h2>
          <p className="mt-1 text-sm leading-6 text-textMuted">
            Momentum Trend Strategy is compared against SPY using mock monthly returns.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {benchmarkStats.map((stat) => (
          <div key={stat.label} className="rounded-md border border-borderSoft bg-panelMuted p-4">
            <div className="text-sm text-textMuted">{stat.label}</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight">{stat.value}</div>
            <div className="mt-1 text-sm text-textMuted">{stat.helper}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
