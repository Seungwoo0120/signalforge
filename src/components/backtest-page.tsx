"use client";

import { BarChart3, Clock, GitCompareArrows, History, Play, RotateCcw, ShieldCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { BenchmarkComparison } from "@/components/benchmark-comparison";
import { DrawdownChart, EquityCurveChart, MonthlyReturnsChart } from "@/components/dashboard-charts";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { StrategyConfigCard } from "@/components/strategy-config-card";
import { useBacktestRuns } from "@/hooks/use-backtest-runs";
import { useStrategy } from "@/providers/strategy-provider";
import { runMockBacktest as calculateMockBacktest } from "@/services/mock-backtest-service";
import { generateMockResearchNotes } from "@/services/mock-research-service";
import { compareBacktestRuns } from "@/services/mock-run-comparison-service";
import { runMockScreener } from "@/services/mock-screener-service";
import { runMockSensitivityAnalysis } from "@/services/mock-sensitivity-service";
import type { BacktestRun, RebalanceLogRow } from "@/types/backtest";
import type { RunComparisonResult, SensitivityAnalysis, SensitivityResult } from "@/types/sensitivity";
import type { StrategyConfig } from "@/types/strategy";

export function BacktestPage() {
  const router = useRouter();
  const { replaceStrategy, strategy, lastRunAt, runMockBacktest } = useStrategy();
  const { runs, latestRun, saveRun, clearRuns } = useBacktestRuns();
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [comparisonRunIds, setComparisonRunIds] = useState<string[]>([]);
  const selectedRun = runs.find((run) => run.id === selectedRunId) ?? null;
  const previewBacktest = calculateMockBacktest(strategy);
  const previewScreener = runMockScreener(strategy);
  const backtest = selectedRun?.backtestResultSnapshot ?? previewBacktest;
  const displayedStrategy = selectedRun?.strategySnapshot ?? strategy;
  const viewLabel = selectedRun ? "Saved Run Snapshot" : "Current Strategy Preview";
  const metrics = backtest.metrics;
  const sensitivity = runMockSensitivityAnalysis(displayedStrategy);
  const runNotes = selectedRun
    ? generateMockResearchNotes(
        selectedRun.strategySnapshot,
        selectedRun.backtestResultSnapshot,
        selectedRun.screenerResultSnapshot,
        sensitivity
      )
    : null;
  const comparison = useMemo(() => compareBacktestRuns(runs, comparisonRunIds), [comparisonRunIds, runs]);
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

  useEffect(() => {
    setComparisonRunIds((current) => {
      const validIds = current.filter((runId) => runs.some((run) => run.id === runId));
      if (validIds.length > 0) return validIds.slice(0, 4);
      return runs.slice(0, 4).map((run) => run.id);
    });
  }, [runs]);

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

      <section className="mb-5 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accentSoft text-accent">
                <BarChart3 size={20} />
              </div>
              <div className="min-w-0">
                <div className="mb-2 inline-flex rounded-md border border-borderSoft bg-panelMuted px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-textMuted">
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
            setComparisonRunIds([]);
          }}
          onSelect={setSelectedRunId}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      {selectedRun ? (
        <section className="mt-6">
          <RunDetailPanel
            notes={runNotes?.strategySummary ?? "Saved run snapshot from local browser storage."}
            run={selectedRun}
            onLoadStrategy={() => {
              replaceStrategy(selectedRun.strategySnapshot);
              router.push("/strategy-builder");
            }}
          />
        </section>
      ) : null}

      <section className="mt-5 grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <EquityCurveChart benchmark={displayedStrategy.benchmark} data={backtest.equityCurve} />
        <StrategyConfigCard strategy={displayedStrategy} />
      </section>

      <section className="mt-5 grid min-w-0 gap-6 lg:grid-cols-2">
        <DrawdownChart benchmark={displayedStrategy.benchmark} data={backtest.drawdown} />
        <MonthlyReturnsChart benchmark={displayedStrategy.benchmark} data={backtest.monthlyReturns} />
      </section>

      <section className="mt-5 min-w-0">
        <BenchmarkComparison benchmark={displayedStrategy.benchmark} stats={backtest.benchmarkStats} />
      </section>

      <section className="mt-5 grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)]">
        <AssumptionsPanel strategy={displayedStrategy} />
        <RebalanceLog rows={backtest.rebalanceLog} />
      </section>

      <section className="mt-5 min-w-0">
        <RunComparison
          comparison={comparison}
          comparisonRunIds={comparisonRunIds}
          runs={runs}
          onToggleRun={(runId) => {
            setComparisonRunIds((current) => toggleComparisonRun(current, runId));
          }}
        />
      </section>

      <section className="mt-5 grid min-w-0 items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <StabilityScorePanel sensitivity={sensitivity} />
        <SensitivityTable results={sensitivity.results} />
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
    <section className="min-w-0 rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
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

      <div className="mt-4 max-h-[360px] space-y-2 overflow-y-auto pr-1">
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
              <div className="mt-1 text-xs font-medium text-textMuted">
                {formatRunDate(run.createdAt)} / {run.benchmark}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <span>Return {metricValue(run, "Total Return")}</span>
                <span>Sharpe {metricValue(run, "Sharpe Ratio")}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  );
}

function RunDetailPanel({
  notes,
  onLoadStrategy,
  run
}: {
  notes: string;
  onLoadStrategy: () => void;
  run: BacktestRun;
}) {
  return (
    <section className="min-w-0 rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex rounded-md border border-borderSoft bg-panelMuted px-2.5 py-1 text-xs font-semibold text-textMuted">
            Saved Run Snapshot
          </div>
          <h2 className="mt-3 text-lg font-semibold tracking-tight">{run.strategyName}</h2>
          <p className="mt-1 text-sm leading-6 text-textMuted">
            Created {formatRunDate(run.createdAt)}. This view uses the strategy and result snapshot saved at run time.
          </p>
        </div>
        <button
          className="inline-flex rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          type="button"
          onClick={onLoadStrategy}
        >
          Load Strategy from Run
        </button>
      </div>

      <div className="mt-5 grid gap-3 text-sm md:grid-cols-4">
        <Assumption label="Universe" value={run.strategySnapshot.universe} />
        <Assumption label="Benchmark" value={run.benchmark} />
        <Assumption label="Portfolio" value={run.strategySnapshot.portfolioSize} />
        <Assumption label="Rebalance" value={run.strategySnapshot.rebalance} />
      </div>

      <div className="mt-5 grid gap-3 text-sm md:grid-cols-4">
        <Assumption label="Total Return" value={metricValue(run, "Total Return")} />
        <Assumption label="Sharpe" value={metricValue(run, "Sharpe Ratio")} />
        <Assumption label="Max Drawdown" value={metricValue(run, "Max Drawdown")} />
        <Assumption label="Cost Impact" value={metricValue(run, "Cost Impact")} />
      </div>

      <div className="mt-5 rounded-md border border-dashed border-borderSoft bg-panelMuted p-4">
        <div className="text-sm font-semibold">Research-style interpretation</div>
        <p className="mt-2 text-sm leading-6 text-textMuted">{notes}</p>
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
    <section className="min-w-0 rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
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
    <section className="min-w-0 rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
      <div>
        <h2 className="text-base font-semibold tracking-tight">Trade / Rebalance Log</h2>
        <p className="mt-1 text-sm leading-6 text-textMuted">
          Deterministic mock rebalance rows tied to ranking, portfolio size, turnover, and cost assumptions.
        </p>
      </div>
      <div className="mt-5 max-w-full overflow-x-auto rounded-md border border-borderSoft">
        <table className="w-full min-w-[920px] border-collapse text-left text-sm">
          <thead className="bg-panelMuted">
            <tr className="border-b border-borderSoft text-xs uppercase tracking-[0.14em] text-textMuted">
              <th className="px-3 py-3 font-semibold">Date</th>
              <th className="px-3 py-3 font-semibold">Action</th>
              <th className="px-3 py-3 font-semibold">Selected</th>
              <th className="px-3 py-3 font-semibold">Added</th>
              <th className="px-3 py-3 font-semibold">Removed</th>
              <th className="px-3 py-3 font-semibold">Weights</th>
              <th className="px-3 py-3 text-right font-semibold">Turnover</th>
              <th className="px-3 py-3 text-right font-semibold">Cost</th>
              <th className="px-3 py-3 text-right font-semibold">Return</th>
              <th className="px-3 py-3 text-right font-semibold">Benchmark</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.date} className="border-b border-borderSoft transition last:border-0 hover:bg-panelMuted/65">
                <td className="whitespace-nowrap px-3 py-3 font-semibold">{row.date}</td>
                <td className="whitespace-nowrap px-3 py-3 text-textMuted">{row.action}</td>
                <td className="max-w-[260px] px-3 py-3 text-textMuted">
                  <TickerList tickers={row.selectedTickers} />
                </td>
                <td className="max-w-[160px] px-3 py-3 text-textMuted">
                  <TickerList emptyLabel="None" tickers={row.addedTickers} />
                </td>
                <td className="max-w-[160px] px-3 py-3 text-textMuted">
                  <TickerList emptyLabel="None" tickers={row.removedTickers} />
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-textMuted">{row.portfolioWeights}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">{row.turnover.toFixed(2)}x</td>
                <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">
                  ${row.estimatedTransactionCost.toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">{row.periodReturn.toFixed(1)}%</td>
                <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">
                  {row.benchmarkReturn.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RunComparison({
  comparison,
  comparisonRunIds,
  runs,
  onToggleRun
}: {
  comparison: RunComparisonResult;
  comparisonRunIds: string[];
  runs: BacktestRun[];
  onToggleRun: (runId: string) => void;
}) {
  return (
    <section className="min-w-0 rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-panelMuted text-textMuted">
            <GitCompareArrows size={19} />
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight">Run Comparison</h2>
            <p className="mt-1 text-sm leading-6 text-textMuted">
              Compare 2 to 4 saved local runs. This is analytical context, not investment advice.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {runs.slice(0, 10).map((run) => {
            const selected = comparisonRunIds.includes(run.id);
            return (
              <button
                key={run.id}
                className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                  selected
                    ? "border-accent bg-accentSoft text-accent"
                    : "border-borderSoft bg-panelMuted text-textMuted hover:border-accent"
                }`}
                type="button"
                onClick={() => onToggleRun(run.id)}
              >
                {run.strategyName}
              </button>
            );
          })}
        </div>
      </div>

      {runs.length === 0 ? (
        <p className="mt-5 rounded-md border border-dashed border-borderSoft bg-panelMuted p-4 text-sm leading-6 text-textMuted">
          No saved runs yet. Run a backtest first to unlock comparison.
        </p>
      ) : (
        <>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {comparison.highlights.map((highlight) => (
              <div key={highlight.label} className="rounded-md border border-borderSoft bg-panelMuted p-4">
                <div className="text-sm text-textMuted">{highlight.label}</div>
                <div className="mt-2 text-xl font-semibold tracking-tight">{highlight.value}</div>
                <div className="mt-1 text-sm text-textMuted">{highlight.run.strategyName}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 max-w-full overflow-x-auto rounded-md border border-borderSoft">
            <table className="w-full min-w-[1160px] border-collapse text-left text-sm">
              <thead className="bg-panelMuted">
                <tr className="border-b border-borderSoft text-xs uppercase tracking-[0.14em] text-textMuted">
                  <th className="px-3 py-3 font-semibold">Strategy</th>
                  <th className="px-3 py-3 font-semibold">Run Date</th>
                  <th className="px-3 py-3 font-semibold">Universe</th>
                  <th className="px-3 py-3 font-semibold">Benchmark</th>
                  <th className="px-3 py-3 font-semibold">Portfolio</th>
                  <th className="px-3 py-3 font-semibold">Rebalance</th>
                  <th className="px-3 py-3 text-right font-semibold">Cost</th>
                  <th className="px-3 py-3 text-right font-semibold">Return</th>
                  <th className="px-3 py-3 text-right font-semibold">CAGR</th>
                  <th className="px-3 py-3 text-right font-semibold">Sharpe</th>
                  <th className="px-3 py-3 text-right font-semibold">Drawdown</th>
                  <th className="px-3 py-3 text-right font-semibold">Vol</th>
                  <th className="px-3 py-3 text-right font-semibold">Win Rate</th>
                  <th className="px-3 py-3 text-right font-semibold">Alpha</th>
                  <th className="px-3 py-3 text-right font-semibold">Beta</th>
                  <th className="px-3 py-3 text-right font-semibold">Turnover</th>
                  <th className="px-3 py-3 text-right font-semibold">Cost Impact</th>
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row) => (
                  <tr key={row.runId} className="border-b border-borderSoft transition last:border-0 hover:bg-panelMuted/65">
                    <td className="max-w-[220px] px-3 py-3 font-semibold">{row.strategyName}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-textMuted">{formatRunDate(row.runDate)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-textMuted">{row.universe}</td>
                    <td className="whitespace-nowrap px-3 py-3">{row.benchmark}</td>
                    <td className="whitespace-nowrap px-3 py-3">{row.portfolioSize}</td>
                    <td className="whitespace-nowrap px-3 py-3">{row.rebalance}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">{row.transactionCost}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">{formatPercent(row.totalReturn)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">{formatPercent(row.cagr)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">{row.sharpe.toFixed(2)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">{formatPercent(row.maxDrawdown)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">{formatPercent(row.volatility)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">{formatPercent(row.winRate)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">{formatPercent(row.alpha)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">{row.beta.toFixed(2)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">{row.turnover.toFixed(2)}x</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">
                      {formatPercent(row.transactionCostImpact)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

function StabilityScorePanel({ sensitivity }: { sensitivity: SensitivityAnalysis }) {
  return (
    <section className="min-w-0 rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accentSoft text-accent">
          <ShieldCheck size={19} />
        </div>
        <div>
          <h2 className="text-base font-semibold tracking-tight">Stability Score</h2>
          <div className="mt-2 text-3xl font-semibold tracking-tight">{sensitivity.stabilityScore}</div>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-textMuted">{sensitivity.scoreDetail}</p>
      {sensitivity.overfittingWarning ? (
        <p className="mt-3 rounded-md border border-dashed border-borderSoft bg-panelMuted p-3 text-sm leading-6 text-textMuted">
          {sensitivity.overfittingWarning}
        </p>
      ) : null}
      <div className="mt-4 grid gap-3 text-sm">
        <Assumption label="Cost sensitivity" value={sensitivity.transactionCostSensitivity} />
        <Assumption label="Portfolio sensitivity" value={sensitivity.portfolioSensitivity} />
      </div>
    </section>
  );
}

function SensitivityTable({ results }: { results: SensitivityResult[] }) {
  return (
    <section className="min-w-0 rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
      <h2 className="text-base font-semibold tracking-tight">Parameter Sensitivity</h2>
      <p className="mt-1 text-sm leading-6 text-textMuted">
        Deterministic mock variations test whether nearby settings produce similar results.
      </p>
      <div className="mt-5 max-w-full overflow-x-auto rounded-md border border-borderSoft">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead className="bg-panelMuted">
            <tr className="border-b border-borderSoft text-xs uppercase tracking-[0.14em] text-textMuted">
              <th className="px-3 py-3 font-semibold">Scenario</th>
              <th className="px-3 py-3 font-semibold">Variation</th>
              <th className="px-3 py-3 text-right font-semibold">Total Return</th>
              <th className="px-3 py-3 text-right font-semibold">Sharpe</th>
              <th className="px-3 py-3 text-right font-semibold">Max Drawdown</th>
              <th className="px-3 py-3 text-right font-semibold">Turnover</th>
              <th className="px-3 py-3 font-semibold">Stability Note</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id} className="border-b border-borderSoft transition last:border-0 hover:bg-panelMuted/65">
                <td className="whitespace-nowrap px-3 py-3 font-semibold">{result.scenario}</td>
                <td className="px-3 py-3 text-textMuted">{result.variation}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">{formatPercent(result.totalReturn)}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">{result.sharpe.toFixed(2)}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">{formatPercent(result.maxDrawdown)}</td>
                <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">{result.turnover.toFixed(2)}x</td>
                <td className="max-w-[280px] px-3 py-3 text-textMuted">{result.stabilityNote}</td>
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

function TickerList({ emptyLabel, tickers }: { emptyLabel?: string; tickers: string[] }) {
  if (tickers.length === 0) return <span className="text-textMuted">{emptyLabel ?? "None"}</span>;

  return (
    <div className="flex max-w-full flex-wrap gap-1.5">
      {tickers.map((ticker) => (
        <span
          key={ticker}
          className="inline-flex rounded-md border border-borderSoft bg-panelMuted px-2 py-0.5 text-xs font-semibold text-textPrimary"
        >
          {ticker}
        </span>
      ))}
    </div>
  );
}

function metricValue(run: BacktestRun, label: string) {
  return run.backtestResultSnapshot.metrics.find((metric) => metric.label === label)?.value ?? "n/a";
}

function toggleComparisonRun(current: string[], runId: string) {
  if (current.includes(runId)) return current.filter((id) => id !== runId);
  return [...current, runId].slice(-4);
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}
