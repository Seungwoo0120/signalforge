import type { BacktestRun } from "@/types/backtest";
import type { RunComparisonHighlight, RunComparisonResult, RunComparisonRow } from "@/types/sensitivity";

export function compareBacktestRuns(runs: BacktestRun[], selectedRunIds: string[]): RunComparisonResult {
  const selectedRuns = runs.filter((run) => selectedRunIds.includes(run.id)).slice(0, 4);
  const rows = selectedRuns.map(toComparisonRow);

  return {
    rows,
    highlights: buildHighlights(selectedRuns)
  };
}

function toComparisonRow(run: BacktestRun): RunComparisonRow {
  const metrics = run.backtestResultSnapshot.rawMetrics;
  const strategy = run.strategySnapshot;

  return {
    runId: run.id,
    strategyName: run.strategyName,
    runDate: run.createdAt,
    universe: strategy.universe,
    benchmark: run.benchmark,
    portfolioSize: strategy.portfolioSize,
    rebalance: strategy.rebalance,
    transactionCost: strategy.transactionCost,
    totalReturn: metrics.totalReturn,
    cagr: metrics.cagr,
    sharpe: metrics.sharpe,
    maxDrawdown: metrics.maxDrawdown,
    volatility: metrics.volatility,
    winRate: metrics.winRate,
    alpha: metrics.alpha,
    beta: metrics.beta,
    turnover: metrics.turnover,
    transactionCostImpact: metrics.transactionCostImpact
  };
}

function buildHighlights(runs: BacktestRun[]): RunComparisonHighlight[] {
  if (runs.length === 0) return [];

  return [
    {
      label: "Best Total Return",
      run: bestRun(runs, (run) => run.backtestResultSnapshot.rawMetrics.totalReturn),
      value: `${bestValue(runs, (run) => run.backtestResultSnapshot.rawMetrics.totalReturn).toFixed(1)}%`
    },
    {
      label: "Best Sharpe Ratio",
      run: bestRun(runs, (run) => run.backtestResultSnapshot.rawMetrics.sharpe),
      value: bestValue(runs, (run) => run.backtestResultSnapshot.rawMetrics.sharpe).toFixed(2)
    },
    {
      label: "Lowest Max Drawdown",
      run: bestRun(runs, (run) => -Math.abs(run.backtestResultSnapshot.rawMetrics.maxDrawdown)),
      value: `${bestValue(runs, (run) => -Math.abs(run.backtestResultSnapshot.rawMetrics.maxDrawdown)).toFixed(1)}%`
    },
    {
      label: "Lowest Cost Impact",
      run: bestRun(runs, (run) => -run.backtestResultSnapshot.rawMetrics.transactionCostImpact),
      value: `${Math.abs(bestValue(runs, (run) => -run.backtestResultSnapshot.rawMetrics.transactionCostImpact)).toFixed(2)}%`
    }
  ];
}

function bestRun(runs: BacktestRun[], getValue: (run: BacktestRun) => number) {
  return runs.reduce((best, run) => (getValue(run) > getValue(best) ? run : best), runs[0]);
}

function bestValue(runs: BacktestRun[], getValue: (run: BacktestRun) => number) {
  return getValue(bestRun(runs, getValue));
}
