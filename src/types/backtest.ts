import type { BenchmarkStat, ChartPoint, StrategyConfig, StrategyMetric } from "@/types/strategy";

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

export type BacktestResult = {
  summary: BacktestSummary;
  equityCurve: ChartPoint[];
  drawdown: ChartPoint[];
  monthlyReturns: ChartPoint[];
  metrics: StrategyMetric[];
  benchmarkStats: BenchmarkStat[];
  rawMetrics: BacktestRawMetrics;
  assumptions: BacktestAssumptions;
};
