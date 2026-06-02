"use client";

import { Activity, Play, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

import { AiExplanationPanel } from "@/components/ai-explanation-panel";
import { BenchmarkComparison } from "@/components/benchmark-comparison";
import { DrawdownChart, EquityCurveChart, MonthlyReturnsChart } from "@/components/dashboard-charts";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { ResultsTable } from "@/components/results-table";
import { StrategyConfigCard } from "@/components/strategy-config-card";
import { getRiskMetrics, screenerRows } from "@/data/mock-data";
import { useStrategy } from "@/providers/strategy-provider";

export function DashboardPage() {
  const router = useRouter();
  const { strategy, runMockBacktest } = useStrategy();
  const metrics = getRiskMetrics(strategy.benchmark);

  function handleRunBacktest() {
    runMockBacktest();
    router.push("/backtest?run=latest");
  }

  return (
    <>
      <PageHeader
        eyebrow={`Home / Overview / ${strategy.universe}`}
        title="Build, test, and understand rule-based stock strategies."
        description="SignalForge is an interactive mock-data frontend prototype for quantitative strategy research, focused on clear backtest visuals, risk metrics, and benchmark context."
        actions={
          <>
            <button
              className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              type="button"
              onClick={handleRunBacktest}
            >
              <Play size={17} />
              Run mock backtest
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-md border border-borderSoft bg-panelMuted px-4 py-2.5 text-sm font-semibold text-textPrimary transition hover:border-accent"
              type="button"
              onClick={() => router.push("/strategy-builder")}
            >
              <SlidersHorizontal size={17} />
              Edit rules
            </button>
          </>
        }
      />

      <section className="mb-6 rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accentSoft text-accent">
            <Activity size={20} />
          </div>
          <div>
            <div className="text-sm font-medium text-textMuted">Current strategy</div>
            <div className="font-semibold">{strategy.name}</div>
          </div>
        </div>
        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <Summary label="Universe" value={strategy.universe} />
          <Summary label="Benchmark" value={strategy.benchmark} />
          <Summary label="Portfolio" value={strategy.portfolioSize} />
          <Summary label="Cost" value={strategy.transactionCost} />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <EquityCurveChart benchmark={strategy.benchmark} />
        <StrategyConfigCard strategy={strategy} />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <DrawdownChart benchmark={strategy.benchmark} />
        <MonthlyReturnsChart benchmark={strategy.benchmark} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
        <ResultsTable rows={screenerRows.slice(0, 5)} rebalance={strategy.rebalance} />
        <div className="grid gap-6">
          <BenchmarkComparison benchmark={strategy.benchmark} />
          <AiExplanationPanel />
        </div>
      </section>
    </>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-panelMuted p-3">
      <div className="text-textMuted">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
