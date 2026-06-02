export type MetricTone = "positive" | "negative" | "neutral";

export type StrategyRule = {
  label: string;
  value: string;
};

export type StrategyMetric = {
  label: string;
  value: string;
  detail: string;
  tone: MetricTone;
};

export const selectedStrategy = {
  name: "Momentum Trend Strategy",
  universe: "Nasdaq 100",
  benchmark: "SPY",
  status: "Mock backtest",
  rebalance: "Monthly",
  holdings: "Top 10 stocks",
  weighting: "Equal weight",
  transactionCost: "0.10%",
  rules: [
    { label: "Trend filter", value: "Price above 200-day moving average" },
    { label: "Momentum", value: "20-day momentum greater than 5%" },
    { label: "Risk guard", value: "RSI below 70" },
    { label: "Liquidity", value: "Volume above 20-day average" }
  ] satisfies StrategyRule[]
};

export const riskMetrics: StrategyMetric[] = [
  {
    label: "Total Return",
    value: "128.4%",
    detail: "+42.6 pts vs SPY",
    tone: "positive"
  },
  {
    label: "CAGR",
    value: "18.7%",
    detail: "5-year mock period",
    tone: "positive"
  },
  {
    label: "Sharpe Ratio",
    value: "1.42",
    detail: "Risk-adjusted return",
    tone: "positive"
  },
  {
    label: "Max Drawdown",
    value: "-18.9%",
    detail: "Largest peak-to-trough decline",
    tone: "negative"
  },
  {
    label: "Volatility",
    value: "16.3%",
    detail: "Annualized",
    tone: "neutral"
  },
  {
    label: "Win Rate",
    value: "58.6%",
    detail: "Monthly observations",
    tone: "neutral"
  }
];

export const equityCurve = [
  { month: "Jan 21", strategy: 100, benchmark: 100 },
  { month: "Apr 21", strategy: 112, benchmark: 108 },
  { month: "Jul 21", strategy: 119, benchmark: 113 },
  { month: "Oct 21", strategy: 126, benchmark: 121 },
  { month: "Jan 22", strategy: 117, benchmark: 115 },
  { month: "Apr 22", strategy: 109, benchmark: 106 },
  { month: "Jul 22", strategy: 115, benchmark: 111 },
  { month: "Oct 22", strategy: 128, benchmark: 116 },
  { month: "Jan 23", strategy: 142, benchmark: 124 },
  { month: "Apr 23", strategy: 157, benchmark: 133 },
  { month: "Jul 23", strategy: 176, benchmark: 145 },
  { month: "Oct 23", strategy: 169, benchmark: 140 },
  { month: "Jan 24", strategy: 188, benchmark: 151 },
  { month: "Apr 24", strategy: 205, benchmark: 161 },
  { month: "Jul 24", strategy: 218, benchmark: 171 },
  { month: "Oct 24", strategy: 208, benchmark: 165 },
  { month: "Jan 25", strategy: 224, benchmark: 176 },
  { month: "Apr 25", strategy: 231, benchmark: 182 },
  { month: "Jul 25", strategy: 222, benchmark: 178 },
  { month: "Oct 25", strategy: 238, benchmark: 188 },
  { month: "Jan 26", strategy: 247, benchmark: 193 },
  { month: "Apr 26", strategy: 228, benchmark: 186 }
];

export const drawdownSeries = [
  { month: "Jan 21", strategy: 0, benchmark: 0 },
  { month: "Apr 21", strategy: -2.1, benchmark: -1.4 },
  { month: "Jul 21", strategy: -1.2, benchmark: -2.0 },
  { month: "Oct 21", strategy: -3.5, benchmark: -3.1 },
  { month: "Jan 22", strategy: -9.3, benchmark: -7.8 },
  { month: "Apr 22", strategy: -16.8, benchmark: -14.7 },
  { month: "Jul 22", strategy: -12.5, benchmark: -11.2 },
  { month: "Oct 22", strategy: -8.4, benchmark: -15.6 },
  { month: "Jan 23", strategy: -4.2, benchmark: -10.1 },
  { month: "Apr 23", strategy: -3.0, benchmark: -7.4 },
  { month: "Jul 23", strategy: -1.6, benchmark: -4.8 },
  { month: "Oct 23", strategy: -6.9, benchmark: -8.2 },
  { month: "Jan 24", strategy: -2.4, benchmark: -5.1 },
  { month: "Apr 24", strategy: -1.9, benchmark: -3.6 },
  { month: "Jul 24", strategy: -1.1, benchmark: -2.7 },
  { month: "Oct 24", strategy: -7.3, benchmark: -7.0 },
  { month: "Jan 25", strategy: -2.8, benchmark: -3.8 },
  { month: "Apr 25", strategy: -1.7, benchmark: -3.2 },
  { month: "Jul 25", strategy: -9.1, benchmark: -6.4 },
  { month: "Oct 25", strategy: -3.8, benchmark: -2.8 },
  { month: "Jan 26", strategy: -1.5, benchmark: -2.2 },
  { month: "Apr 26", strategy: -18.9, benchmark: -9.6 }
];

export const monthlyReturns = [
  { month: "Nov", strategy: 2.9, benchmark: 1.7 },
  { month: "Dec", strategy: 3.8, benchmark: 2.3 },
  { month: "Jan", strategy: 1.7, benchmark: 1.2 },
  { month: "Feb", strategy: -4.2, benchmark: -2.7 },
  { month: "Mar", strategy: 2.1, benchmark: 1.5 },
  { month: "Apr", strategy: -7.8, benchmark: -3.4 }
];

export const benchmarkStats = [
  { label: "Alpha", value: "6.4%", helper: "Annualized excess return" },
  { label: "Beta", value: "0.91", helper: "Relative to SPY" },
  { label: "Correlation", value: "0.78", helper: "Monthly returns" },
  { label: "Tracking Error", value: "8.2%", helper: "Annualized" }
];

export const recentSignals = [
  {
    ticker: "NVDA",
    sector: "Semiconductors",
    momentum: "12.4%",
    rsi: "64",
    weight: "10.0%",
    status: "Included"
  },
  {
    ticker: "MSFT",
    sector: "Software",
    momentum: "8.7%",
    rsi: "58",
    weight: "10.0%",
    status: "Included"
  },
  {
    ticker: "AVGO",
    sector: "Semiconductors",
    momentum: "7.9%",
    rsi: "61",
    weight: "10.0%",
    status: "Included"
  },
  {
    ticker: "COST",
    sector: "Retail",
    momentum: "4.1%",
    rsi: "55",
    weight: "0.0%",
    status: "Filtered"
  },
  {
    ticker: "TSLA",
    sector: "Automobiles",
    momentum: "6.8%",
    rsi: "74",
    weight: "0.0%",
    status: "RSI limit"
  }
];
