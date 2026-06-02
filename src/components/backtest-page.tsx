"use client";

import { BarChart3, Clock, Play } from "lucide-react";

import { BenchmarkComparison } from "@/components/benchmark-comparison";
import { DrawdownChart, EquityCurveChart, MonthlyReturnsChart } from "@/components/dashboard-charts";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { StrategyConfigCard } from "@/components/strategy-config-card";
import { useStrategy } from "@/providers/strategy-provider";
import { runMockBacktest as calculateMockBacktest } from "@/services/mock-backtest-service";

export function BacktestPage() {
  const { strategy, lastRunAt, runMockBacktest } = useStrategy();
  const backtest = calculateMockBacktest(strategy);
  const metrics = backtest.metrics;
  const runLabel = lastRunAt
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(lastRunAt))
    : "Not run in this session";

  return (
    <>
      <PageHeader
        eyebrow="Backtest"
        title="Review mock strategy performance and risk."
        description="This page uses deterministic mock data to model the frontend flow. It is not a real backtest, forecast, or investment recommendation."
        actions={
          <button
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            type="button"
            onClick={runMockBacktest}
          >
            <Play size={17} />
            Run mock backtest
          </button>
        }
      />

      <section className="mb-6 rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accentSoft text-accent">
              <BarChart3 size={20} />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight">{strategy.name}</h2>
              <p className="mt-1 text-sm leading-6 text-textMuted">
                {strategy.universe} / {strategy.portfolioSize} / {strategy.weighting} /{" "}
                {strategy.rebalance} rebalance / {strategy.transactionCost} cost
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-md border border-borderSoft bg-panelMuted px-3 py-2 text-sm font-medium text-textMuted">
            <Clock size={16} />
            Last mock run: <span className="text-textPrimary">{runLabel}</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <EquityCurveChart benchmark={strategy.benchmark} data={backtest.equityCurve} />
        <StrategyConfigCard strategy={strategy} />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <DrawdownChart benchmark={strategy.benchmark} data={backtest.drawdown} />
        <MonthlyReturnsChart benchmark={strategy.benchmark} data={backtest.monthlyReturns} />
      </section>

      <section className="mt-6">
        <BenchmarkComparison benchmark={strategy.benchmark} stats={backtest.benchmarkStats} />
      </section>

      <section className="mt-6 rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
        <h2 className="text-base font-semibold tracking-tight">Mock assumptions</h2>
        <p className="mt-1 text-sm leading-6 text-textMuted">
          Results are deterministic simulations for product design. Higher return does not guarantee future performance.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {Object.entries(backtest.assumptions).map(([key, value]) => (
            <div key={key} className="rounded-md bg-panelMuted p-3 text-sm leading-6 text-textMuted">
              {value}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
