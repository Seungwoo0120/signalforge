import type { BacktestRun } from "@/types/backtest";
import type { RebalanceFrequency, TransactionCost } from "@/types/strategy";

export type StabilityScore = "High" | "Medium" | "Low";

export type SensitivityScenario =
  | "Momentum Threshold"
  | "RSI Threshold"
  | "Transaction Cost"
  | "Portfolio Size"
  | "Rebalance Frequency";

export type SensitivityResult = {
  id: string;
  scenario: SensitivityScenario;
  variation: string;
  totalReturn: number;
  sharpe: number;
  maxDrawdown: number;
  turnover: number;
  stabilityNote: string;
};

export type SensitivityAnalysis = {
  results: SensitivityResult[];
  stabilityScore: StabilityScore;
  scoreDetail: string;
  overfittingWarning: string | null;
  transactionCostSensitivity: StabilityScore;
  portfolioSensitivity: StabilityScore;
};

export type RunComparisonMetricKey =
  | "totalReturn"
  | "cagr"
  | "sharpe"
  | "maxDrawdown"
  | "volatility"
  | "winRate"
  | "alpha"
  | "beta"
  | "turnover"
  | "transactionCostImpact";

export type RunComparisonRow = {
  runId: string;
  strategyName: string;
  runDate: string;
  universe: string;
  benchmark: string;
  portfolioSize: string;
  rebalance: RebalanceFrequency;
  transactionCost: TransactionCost;
  totalReturn: number;
  cagr: number;
  sharpe: number;
  maxDrawdown: number;
  volatility: number;
  winRate: number;
  alpha: number;
  beta: number;
  turnover: number;
  transactionCostImpact: number;
};

export type RunComparisonHighlight = {
  label: string;
  run: BacktestRun;
  value: string;
};

export type RunComparisonResult = {
  rows: RunComparisonRow[];
  highlights: RunComparisonHighlight[];
};
