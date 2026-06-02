export type Benchmark = "SPY" | "QQQ";
export type Universe = "Nasdaq 100" | "S&P 500";
export type PortfolioSize = "Top 5" | "Top 10" | "Top 20";
export type Weighting = "Equal weight";
export type RebalanceFrequency = "Weekly" | "Monthly" | "Quarterly";
export type TransactionCost = "0.00%" | "0.05%" | "0.10%" | "0.25%";
export type MetricTone = "positive" | "negative" | "neutral";

export type StrategyConfig = {
  name: string;
  universe: Universe;
  benchmark: Benchmark;
  portfolioSize: PortfolioSize;
  weighting: Weighting;
  rebalance: RebalanceFrequency;
  transactionCost: TransactionCost;
  rules: {
    priceAboveSma200: boolean;
    momentumThreshold: number;
    rsiThreshold: number;
    volumeAboveAverage: boolean;
  };
};

export type StrategyRule = {
  label: string;
  value: string;
  enabled: boolean;
};

export type StrategyMetric = {
  label: string;
  value: string;
  detail: string;
  tone: MetricTone;
};

export type ChartPoint = {
  month: string;
  strategy: number;
  benchmark: number;
};

export type BenchmarkStat = {
  label: string;
  value: string;
  helper: string;
};

export type ScreenerRow = {
  ticker: string;
  company: string;
  sector: string;
  momentum: number;
  rsi: number;
  volumeSignal: "Pass" | "Watch";
  trendSignal: "Pass" | "Fail";
  score: number;
  status: "Included" | "Filtered" | "Watchlist" | "RSI limit";
};
