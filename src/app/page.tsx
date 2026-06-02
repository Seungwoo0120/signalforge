import { Activity, Play, SlidersHorizontal } from "lucide-react";

import { AiExplanationPanel } from "@/components/ai-explanation-panel";
import { AppLayout } from "@/components/app-layout";
import { BenchmarkComparison } from "@/components/benchmark-comparison";
import { DrawdownChart, EquityCurveChart, MonthlyReturnsChart } from "@/components/dashboard-charts";
import { MetricCard } from "@/components/metric-card";
import { ResultsTable } from "@/components/results-table";
import { StrategyConfigCard } from "@/components/strategy-config-card";
import { riskMetrics, selectedStrategy } from "@/data/mock-data";

export default function Home() {
  return (
    <AppLayout>
      <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-textMuted">
            <span>Home / Overview</span>
            <span className="h-1 w-1 rounded-full bg-textMuted" />
            <span>{selectedStrategy.universe}</span>
          </div>
          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Build, test, and understand rule-based stock strategies.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-textMuted">
                SignalForge is a mock-data frontend foundation for quantitative strategy research,
                focused on clear backtest visuals, risk metrics, and benchmark context.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90">
                <Play size={17} />
                Run mock backtest
              </button>
              <button className="inline-flex items-center gap-2 rounded-md border border-borderSoft bg-panelMuted px-4 py-2.5 text-sm font-semibold text-textPrimary transition hover:border-accent">
                <SlidersHorizontal size={17} />
                Edit rules
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accentSoft text-accent">
              <Activity size={20} />
            </div>
            <div>
              <div className="text-sm font-medium text-textMuted">Current strategy</div>
              <div className="font-semibold">{selectedStrategy.name}</div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md bg-panelMuted p-3">
              <div className="text-textMuted">Universe</div>
              <div className="mt-1 font-semibold">{selectedStrategy.universe}</div>
            </div>
            <div className="rounded-md bg-panelMuted p-3">
              <div className="text-textMuted">Weighting</div>
              <div className="mt-1 font-semibold">{selectedStrategy.weighting}</div>
            </div>
            <div className="rounded-md bg-panelMuted p-3">
              <div className="text-textMuted">Holdings</div>
              <div className="mt-1 font-semibold">{selectedStrategy.holdings}</div>
            </div>
            <div className="rounded-md bg-panelMuted p-3">
              <div className="text-textMuted">Cost</div>
              <div className="mt-1 font-semibold">{selectedStrategy.transactionCost}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {riskMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <EquityCurveChart />
        <StrategyConfigCard />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <DrawdownChart />
        <MonthlyReturnsChart />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
        <ResultsTable />
        <div className="grid gap-6">
          <BenchmarkComparison />
          <AiExplanationPanel />
        </div>
      </section>
    </AppLayout>
  );
}
