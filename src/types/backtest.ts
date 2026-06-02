import type { BenchmarkStat, ChartPoint, StrategyConfig, StrategyMetric } from "@/types/strategy";
import type { ScreenerResult } from "@/types/screener";

export type BacktestAssumptions = {
  universeBias: string;
  portfolioConcentration: string;
  rebalanceTurnover: string;
  transactionCost: string;
  ruleImpact: string;
};

export type BacktestSummary = {
  strategyName: string;
  universe: StrategyConfig["universe"];
  benchmark: StrategyConfig["benchmark"];
  portfolioSize: StrategyConfig["portfolioSize"];
  rebalance: StrategyConfig["rebalance"];
  transactionCost: StrategyConfig["transactionCost"];
};

export type BacktestRawMetrics = {
  totalReturn: number;
  benchmarkReturn: number;
  cagr: number;
  benchmarkCagr: number;
  sharpe: number;
  maxDrawdown: number;
  volatility: number;
  winRate: number;
  alpha: number;
  beta: number;
  turnover: number;
  transactionCostImpact: number;
};

export type RebalanceLogRow = {
  date: string;
  action: "Rebalance";
  selectedTickers: string[];
  addedTickers: string[];
  removedTickers: string[];
  portfolioWeights: string;
  turnover: number;
  estimatedTransactionCost: number;
  periodReturn: number;
  benchmarkReturn: number;
};

export type BacktestResult = {
  summary: BacktestSummary;
  equityCurve: ChartPoint[];
  drawdown: ChartPoint[];
  monthlyReturns: ChartPoint[];
  metrics: StrategyMetric[];
  benchmarkStats: BenchmarkStat[];
  rawMetrics: BacktestRawMetrics;
  assumptions: BacktestAssumptions;
  rebalanceLog: RebalanceLogRow[];
};

export type BacktestRun = {
  id: string;
  createdAt: string;
  runLabel: string;
  strategyName: string;
  benchmark: StrategyConfig["benchmark"];
  strategySnapshot: StrategyConfig;
  backtestResultSnapshot: BacktestResult;
  screenerResultSnapshot: ScreenerResult;
};
