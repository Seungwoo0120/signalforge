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
import { useBacktestRuns } from "@/hooks/use-backtest-runs";
import { useStrategyPresets } from "@/hooks/use-strategy-presets";
import { useStrategy } from "@/providers/strategy-provider";
import { runMockBacktest as calculateMockBacktest } from "@/services/mock-backtest-service";
import { generateMockResearchNotes } from "@/services/mock-research-service";
import { runMockScreener } from "@/services/mock-screener-service";

export function DashboardPage() {
  const router = useRouter();
  const { strategy, runMockBacktest } = useStrategy();
  const { latestRun, saveRun } = useBacktestRuns();
  const { latestPreset, userPresets } = useStrategyPresets();
  const backtest = calculateMockBacktest(strategy);
  const screener = runMockScreener(strategy);
  const notes = generateMockResearchNotes(strategy, backtest, screener);
  const metrics = backtest.metrics.slice(0, 6);

  function handleRunBacktest() {
    saveRun({ strategy, backtest, screener });
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
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
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
          </div>
          <LatestRunSummary latestRun={latestRun} onOpen={() => router.push("/backtest?run=latest")} />
        </div>
        <WorkflowSummary
          latestPresetName={latestPreset?.name ?? "None saved"}
          presetCount={userPresets.length}
          onOpenBacktests={() => router.push("/backtest")}
          onOpenBuilder={() => router.push("/strategy-builder")}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
        <ResultsTable rows={screener.rows.slice(0, 5)} rebalance={strategy.rebalance} />
        <div className="grid gap-6">
          <BenchmarkComparison benchmark={strategy.benchmark} stats={backtest.benchmarkStats} />
          <AiExplanationPanel notes={notes} />
        </div>
      </section>
    </>
  );
}

function WorkflowSummary({
  latestPresetName,
  onOpenBacktests,
  onOpenBuilder,
  presetCount
}: {
  latestPresetName: string;
  onOpenBacktests: () => void;
  onOpenBuilder: () => void;
  presetCount: number;
}) {
  return (
    <div className="mt-5 rounded-md border border-borderSoft bg-panelMuted p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-sm font-semibold">Workflow Library</div>
          <p className="mt-1 text-sm leading-6 text-textMuted">
            {presetCount} saved strategy presets / Latest preset: {latestPresetName}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded-md border border-borderSoft bg-panel px-3 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent"
            type="button"
            onClick={onOpenBuilder}
          >
            Open Strategy Builder
          </button>
          <button
            className="rounded-md border border-borderSoft bg-panel px-3 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent"
            type="button"
            onClick={onOpenBacktests}
          >
            View Backtest Runs
          </button>
        </div>
      </div>
    </div>
  );
}

function LatestRunSummary({
  latestRun,
  onOpen
}: {
  latestRun: ReturnType<typeof useBacktestRuns>["latestRun"];
  onOpen: () => void;
}) {
  if (!latestRun) {
    return (
      <div className="min-w-[280px] rounded-md border border-dashed border-borderSoft bg-panelMuted p-4">
        <div className="text-sm font-semibold">Latest Backtest Run</div>
        <p className="mt-2 text-sm leading-6 text-textMuted">
          No saved run yet. Run a mock backtest to store a snapshot of the current strategy.
        </p>
      </div>
    );
  }

  const metrics = latestRun.backtestResultSnapshot.metrics;
  const createdAt = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(latestRun.createdAt));

  return (
    <div className="min-w-[300px] rounded-md border border-borderSoft bg-panelMuted p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Latest Backtest Run</div>
          <p className="mt-1 text-sm text-textMuted">{createdAt}</p>
        </div>
        <button className="text-sm font-semibold text-accent" type="button" onClick={onOpen}>
          Open
        </button>
      </div>
      <div className="mt-3 text-sm font-semibold">{latestRun.strategyName}</div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <Summary label="Return" value={metricValue(metrics, "Total Return")} />
        <Summary label="Sharpe" value={metricValue(metrics, "Sharpe Ratio")} />
        <Summary label="Drawdown" value={metricValue(metrics, "Max Drawdown")} />
        <Summary label="Benchmark" value={latestRun.benchmark} />
      </div>
    </div>
  );
}

function metricValue(metrics: { label: string; value: string }[], label: string) {
  return metrics.find((metric) => metric.label === label)?.value ?? "n/a";
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-panelMuted p-3">
      <div className="text-textMuted">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
