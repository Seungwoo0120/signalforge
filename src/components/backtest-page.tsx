"use client";

import { BarChart3, Clock, History, Play, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { BenchmarkComparison } from "@/components/benchmark-comparison";
import { DrawdownChart, EquityCurveChart, MonthlyReturnsChart } from "@/components/dashboard-charts";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { StrategyConfigCard } from "@/components/strategy-config-card";
import { useBacktestRuns } from "@/hooks/use-backtest-runs";
import { useStrategy } from "@/providers/strategy-provider";
import { runMockBacktest as calculateMockBacktest } from "@/services/mock-backtest-service";
import { runMockScreener } from "@/services/mock-screener-service";
import type { BacktestRun, RebalanceLogRow } from "@/types/backtest";
import type { StrategyConfig } from "@/types/strategy";

export function BacktestPage() {
  const { strategy, lastRunAt, runMockBacktest } = useStrategy();
  const { runs, latestRun, saveRun, clearRuns } = useBacktestRuns();
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const selectedRun = runs.find((run) => run.id === selectedRunId) ?? null;
  const previewBacktest = calculateMockBacktest(strategy);
  const previewScreener = runMockScreener(strategy);
  const backtest = selectedRun?.backtestResultSnapshot ?? previewBacktest;
  const displayedStrategy = selectedRun?.strategySnapshot ?? strategy;
  const viewLabel = selectedRun ? "Saved Run Snapshot" : "Current Strategy Preview";
  const metrics = backtest.metrics;
  const runLabel = lastRunAt
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(lastRunAt))
    : "Not run in this session";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("run") === "latest" && latestRun) {
      setSelectedRunId(latestRun.id);
    }
  }, [latestRun]);

  function handleRunBacktest() {
    const run = saveRun({
      strategy,
      backtest: previewBacktest,
      screener: previewScreener
    });
    setSelectedRunId(run.id);
    runMockBacktest();
  }

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
            onClick={handleRunBacktest}
          >
            <Play size={17} />
            Run Backtest
          </button>
        }
      />

      <section className="mb-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accentSoft text-accent">
                <BarChart3 size={20} />
              </div>
              <div>
                <div className="mb-2 inline-flex rounded-md border border-borderSoft bg-panelMuted px-2.5 py-1 text-xs font-semibold text-textMuted">
                  {viewLabel}
                </div>
                <h2 className="text-base font-semibold tracking-tight">{displayedStrategy.name}</h2>
                <p className="mt-1 text-sm leading-6 text-textMuted">
                  {displayedStrategy.universe} / {displayedStrategy.portfolioSize} /{" "}
                  {displayedStrategy.weighting} / {displayedStrategy.rebalance} rebalance /{" "}
                  {displayedStrategy.transactionCost} cost
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 lg:items-end">
              <div className="inline-flex items-center gap-2 rounded-md border border-borderSoft bg-panelMuted px-3 py-2 text-sm font-medium text-textMuted">
                <Clock size={16} />
                Last mock run: <span className="text-textPrimary">{runLabel}</span>
              </div>
              {selectedRun ? (
                <button
                  className="inline-flex items-center gap-2 rounded-md border border-borderSoft bg-panelMuted px-3 py-2 text-sm font-semibold text-textPrimary transition hover:border-accent"
                  type="button"
                  onClick={() => setSelectedRunId(null)}
                >
                  <RotateCcw size={15} />
                  View current preview
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <RecentRuns
          runs={runs}
          selectedRunId={selectedRunId}
          onClear={() => {
            clearRuns();
            setSelectedRunId(null);
          }}
          onSelect={setSelectedRunId}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <EquityCurveChart benchmark={displayedStrategy.benchmark} data={backtest.equityCurve} />
        <StrategyConfigCard strategy={displayedStrategy} />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <DrawdownChart benchmark={displayedStrategy.benchmark} data={backtest.drawdown} />
        <MonthlyReturnsChart benchmark={displayedStrategy.benchmark} data={backtest.monthlyReturns} />
      </section>

      <section className="mt-6">
        <BenchmarkComparison benchmark={displayedStrategy.benchmark} stats={backtest.benchmarkStats} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <AssumptionsPanel strategy={displayedStrategy} />
        <RebalanceLog rows={backtest.rebalanceLog} />
      </section>
    </>
  );
}

function RecentRuns({
  runs,
  selectedRunId,
  onClear,
  onSelect
}: {
  runs: BacktestRun[];
  selectedRunId: string | null;
  onClear: () => void;
  onSelect: (runId: string) => void;
}) {
  return (
    <section className="rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-panelMuted text-textMuted">
            <History size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight">Recent Runs</h2>
            <p className="mt-1 text-sm text-textMuted">Stored locally, latest 10 only</p>
          </div>
        </div>
        {runs.length > 0 ? (
          <button className="text-textMuted transition hover:text-danger" type="button" onClick={onClear}>
            <Trash2 size={17} />
          </button>
        ) : null}
      </div>

      <div className="mt-4 space-y-2">
        {runs.length === 0 ? (
          <p className="rounded-md border border-dashed border-borderSoft bg-panelMuted p-3 text-sm leading-6 text-textMuted">
            No saved runs yet. Click Run Backtest to create a snapshot.
          </p>
        ) : (
          runs.map((run) => (
            <button
              key={run.id}
              className={`block w-full rounded-md border p-3 text-left text-sm transition ${
                selectedRunId === run.id
                  ? "border-accent bg-accentSoft text-accent"
                  : "border-borderSoft bg-panelMuted text-textPrimary hover:border-accent"
              }`}
              type="button"
              onClick={() => onSelect(run.id)}
            >
              <div className="font-semibold">{run.strategyName}</div>
              <div className="mt-1 text-xs text-textMuted">
                {formatRunDate(run.createdAt)} / {run.benchmark}
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  );
}

function AssumptionsPanel({ strategy }: { strategy: StrategyConfig }) {
  const rules = [
    strategy.rules.priceAboveSma200 ? "Price above 200-day moving average" : "Trend filter disabled",
    `20-day momentum greater than ${strategy.rules.momentumThreshold}%`,
    `RSI below ${strategy.rules.rsiThreshold}`,
    strategy.rules.volumeAboveAverage ? "Volume above 20-day average" : "Volume filter disabled"
  ];

  return (
    <section className="rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
      <h2 className="text-base font-semibold tracking-tight">Run assumptions</h2>
      <p className="mt-1 text-sm leading-6 text-textMuted">
        Hypothetical backtest setup using simulated prototype data. Not financial advice.
      </p>
      <div className="mt-4 grid gap-3 text-sm">
        <Assumption label="Universe" value={strategy.universe} />
        <Assumption label="Benchmark" value={strategy.benchmark} />
        <Assumption label="Portfolio size" value={strategy.portfolioSize} />
        <Assumption label="Weighting" value={strategy.weighting} />
        <Assumption label="Rebalance" value={strategy.rebalance} />
        <Assumption label="Transaction cost" value={strategy.transactionCost} />
        <Assumption label="Initial capital" value="$10,000 mock account" />
        <Assumption label="Data status" value="Simulated mock data for prototype" />
      </div>
      <div className="mt-4 rounded-md bg-panelMuted p-3">
        <div className="text-sm font-semibold">Signal rules</div>
        <ul className="mt-2 space-y-1 text-sm leading-6 text-textMuted">
          {rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function RebalanceLog({ rows }: { rows: RebalanceLogRow[] }) {
  return (
    <section className="rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
      <div>
        <h2 className="text-base font-semibold tracking-tight">Trade / Rebalance Log</h2>
        <p className="mt-1 text-sm leading-6 text-textMuted">
          Deterministic mock rebalance rows tied to ranking, portfolio size, turnover, and cost assumptions.
        </p>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-borderSoft text-xs uppercase tracking-[0.14em] text-textMuted">
              <th className="py-3 font-semibold">Date</th>
              <th className="py-3 font-semibold">Action</th>
              <th className="py-3 font-semibold">Selected</th>
              <th className="py-3 font-semibold">Added</th>
              <th className="py-3 font-semibold">Removed</th>
              <th className="py-3 font-semibold">Weights</th>
              <th className="py-3 font-semibold">Turnover</th>
              <th className="py-3 font-semibold">Cost</th>
              <th className="py-3 font-semibold">Return</th>
              <th className="py-3 font-semibold">Benchmark</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.date} className="border-b border-borderSoft last:border-0">
                <td className="py-3 font-semibold">{row.date}</td>
                <td className="py-3 text-textMuted">{row.action}</td>
                <td className="py-3 text-textMuted">{row.selectedTickers.join(", ")}</td>
                <td className="py-3 text-textMuted">{formatTickers(row.addedTickers)}</td>
                <td className="py-3 text-textMuted">{formatTickers(row.removedTickers)}</td>
                <td className="py-3 text-textMuted">{row.portfolioWeights}</td>
                <td className="py-3">{row.turnover.toFixed(2)}x</td>
                <td className="py-3">${row.estimatedTransactionCost.toFixed(2)}</td>
                <td className="py-3">{row.periodReturn.toFixed(1)}%</td>
                <td className="py-3">{row.benchmarkReturn.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Assumption({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md bg-panelMuted p-3">
      <span className="text-textMuted">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function formatRunDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(date));
}

function formatTickers(tickers: string[]) {
  return tickers.length > 0 ? tickers.join(", ") : "None";
}
