import {
  calculateBeta,
  calculateCagr,
  calculateDrawdown,
  calculateSharpe,
  calculateTotalReturn,
  calculateVolatility,
  calculateWinRate,
  compoundReturns,
  formatPercent,
  formatSignedPercent,
  getPortfolioCount,
  getRebalanceTurnover,
  metricTone,
  parseTransactionCost,
  round,
  toChartPoints
} from "@/lib/quant-metrics";
import type { BacktestResult } from "@/types/backtest";
import type { Benchmark, ChartPoint, StrategyConfig, StrategyMetric } from "@/types/strategy";

const months = [
  "Jan 21",
  "Apr 21",
  "Jul 21",
  "Oct 21",
  "Jan 22",
  "Apr 22",
  "Jul 22",
  "Oct 22",
  "Jan 23",
  "Apr 23",
  "Jul 23",
  "Oct 23",
  "Jan 24",
  "Apr 24",
  "Jul 24",
  "Oct 24",
  "Jan 25",
  "Apr 25",
  "Jul 25",
  "Oct 25",
  "Jan 26",
  "Apr 26"
];

const spyReturns = [
  0,
  8.0,
  4.6,
  7.1,
  -5.0,
  -7.8,
  4.7,
  4.5,
  6.9,
  7.2,
  9.0,
  -3.4,
  7.9,
  6.6,
  6.2,
  -3.5,
  6.7,
  3.4,
  -2.2,
  5.6,
  2.7,
  -3.6
];

const qqqReturns = [
  0,
  9.4,
  5.7,
  8.9,
  -7.6,
  -9.8,
  6.4,
  5.8,
  9.1,
  8.2,
  10.4,
  -4.8,
  9.4,
  7.8,
  7.3,
  -4.7,
  7.8,
  4.1,
  -3.0,
  6.6,
  3.5,
  -4.4
];

export function runMockBacktest(strategy: StrategyConfig): BacktestResult {
  const benchmarkReturns = getBenchmarkReturns(strategy.benchmark);
  const portfolioCount = getPortfolioCount(strategy.portfolioSize);
  const turnover = getRebalanceTurnover(strategy.rebalance);
  const costRate = parseTransactionCost(strategy.transactionCost);
  const annualCostImpact = costRate * turnover * 100;
  const monthlyCostImpact = annualCostImpact / 12;
  const concentrationBoost = portfolioCount === 5 ? 0.42 : portfolioCount === 10 ? 0.24 : 0.08;
  const concentrationRisk = portfolioCount === 5 ? 0.42 : portfolioCount === 10 ? 0.18 : -0.18;
  const universeBoost = strategy.universe === "Nasdaq 100" ? 0.22 : 0.05;
  const universeRisk = strategy.universe === "Nasdaq 100" ? 0.22 : -0.08;
  const rebalanceBoost = strategy.rebalance === "Weekly" ? 0.18 : strategy.rebalance === "Monthly" ? 0.1 : -0.05;
  const trendRiskGuard = strategy.rules.priceAboveSma200 ? -0.44 : 0.42;
  const volumeRiskGuard = strategy.rules.volumeAboveAverage ? -0.2 : 0.18;
  const momentumBoost = (strategy.rules.momentumThreshold - 5) * 0.035;
  const rsiRiskGuard = (70 - strategy.rules.rsiThreshold) * 0.018;
  const qualityScore =
    universeBoost +
    concentrationBoost +
    rebalanceBoost +
    momentumBoost +
    (strategy.rules.priceAboveSma200 ? 0.18 : -0.08) +
    (strategy.rules.volumeAboveAverage ? 0.08 : -0.04) -
    monthlyCostImpact;
  const riskTilt = universeRisk + concentrationRisk + trendRiskGuard + volumeRiskGuard - rsiRiskGuard;

  const strategyReturns = benchmarkReturns.map((benchmarkReturn, index) => {
    const cycleAdjustment = ((index % 4) - 1.5) * 0.11;
    const downsideGuard = benchmarkReturn < 0 && strategy.rules.priceAboveSma200 ? Math.abs(benchmarkReturn) * 0.24 : 0;
    const concentrationDrag = benchmarkReturn < -5 ? Math.max(0, concentrationRisk) * 0.55 : 0;
    const grossReturn = benchmarkReturn * (0.82 + Math.max(riskTilt, -0.5) * 0.08) + qualityScore + cycleAdjustment;
    return round(grossReturn + downsideGuard - concentrationDrag, 2);
  });

  const benchmarkValues = compoundReturns(100, benchmarkReturns);
  const strategyValues = compoundReturns(100, strategyReturns);
  const equityCurve = toChartPoints(months, strategyValues, benchmarkValues);
  const benchmarkDrawdown = calculateDrawdown(benchmarkValues);
  const strategyDrawdown = calculateDrawdown(strategyValues);
  const drawdown = toChartPoints(months, strategyDrawdown, benchmarkDrawdown);
  const monthlyReturns = getRecentMonthlyReturns(strategyReturns, benchmarkReturns);
  const totalReturn = calculateTotalReturn(strategyValues);
  const benchmarkReturn = calculateTotalReturn(benchmarkValues);
  const cagr = calculateCagr(totalReturn, strategyReturns.length);
  const benchmarkCagr = calculateCagr(benchmarkReturn, benchmarkReturns.length);
  const volatility = calculateVolatility(strategyReturns);
  const sharpe = calculateSharpe(strategyReturns);
  const maxDrawdown = Math.min(...strategyDrawdown);
  const winRate = calculateWinRate(strategyReturns);
  const beta = calculateBeta(strategyReturns, benchmarkReturns);
  const alpha = cagr - benchmarkCagr * beta;

  return {
    summary: {
      strategyName: strategy.name,
      universe: strategy.universe,
      benchmark: strategy.benchmark,
      portfolioSize: strategy.portfolioSize,
      rebalance: strategy.rebalance,
      transactionCost: strategy.transactionCost
    },
    equityCurve,
    drawdown,
    monthlyReturns,
    metrics: buildMetrics({
      totalReturn,
      benchmarkReturn,
      cagr,
      sharpe,
      maxDrawdown,
      volatility,
      winRate,
      alpha,
      beta,
      turnover,
      transactionCostImpact: annualCostImpact,
      benchmark: strategy.benchmark
    }),
    benchmarkStats: [
      { label: "Alpha", value: formatSignedPercent(alpha), helper: "Annualized excess return" },
      { label: "Beta", value: beta.toFixed(2), helper: `Relative to ${strategy.benchmark}` },
      {
        label: "Return Gap",
        value: formatSignedPercent(totalReturn - benchmarkReturn),
        helper: `Total return vs ${strategy.benchmark}`
      },
      {
        label: "Cost Impact",
        value: `-${annualCostImpact.toFixed(2)}%`,
        helper: "Annualized turnover drag"
      }
    ],
    rawMetrics: {
      totalReturn,
      benchmarkReturn,
      cagr,
      benchmarkCagr,
      sharpe,
      maxDrawdown,
      volatility,
      winRate,
      alpha,
      beta,
      turnover,
      transactionCostImpact: annualCostImpact
    },
    assumptions: {
      universeBias:
        strategy.universe === "Nasdaq 100"
          ? "Nasdaq 100 adds higher growth and volatility assumptions."
          : "S&P 500 adds broader sector exposure and slightly lower volatility assumptions.",
      portfolioConcentration: `${strategy.portfolioSize} changes concentration risk and return dispersion.`,
      rebalanceTurnover: `${strategy.rebalance} rebalance assumes ${turnover.toFixed(2)}x annual turnover.`,
      transactionCost: `${strategy.transactionCost} cost reduces returns by about ${annualCostImpact.toFixed(2)}% annualized in this mock model.`,
      ruleImpact: "Trend, momentum, RSI, and volume rules alter downside guardrails and candidate quality."
    }
  };
}

function getBenchmarkReturns(benchmark: Benchmark) {
  return benchmark === "SPY" ? spyReturns : qqqReturns;
}

function getRecentMonthlyReturns(strategyReturns: number[], benchmarkReturns: number[]): ChartPoint[] {
  const labels = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];
  const strategySlice = strategyReturns.slice(-6);
  const benchmarkSlice = benchmarkReturns.slice(-6);

  return labels.map((month, index) => ({
    month,
    strategy: round(strategySlice[index], 1),
    benchmark: round(benchmarkSlice[index], 1)
  }));
}

function buildMetrics({
  totalReturn,
  benchmarkReturn,
  cagr,
  sharpe,
  maxDrawdown,
  volatility,
  winRate,
  alpha,
  beta,
  turnover,
  transactionCostImpact,
  benchmark
}: {
  totalReturn: number;
  benchmarkReturn: number;
  cagr: number;
  sharpe: number;
  maxDrawdown: number;
  volatility: number;
  winRate: number;
  alpha: number;
  beta: number;
  turnover: number;
  transactionCostImpact: number;
  benchmark: Benchmark;
}): StrategyMetric[] {
  return [
    {
      label: "Total Return",
      value: formatPercent(totalReturn),
      detail: `${formatSignedPercent(totalReturn - benchmarkReturn)} vs ${benchmark}`,
      tone: metricTone(totalReturn - benchmarkReturn)
    },
    {
      label: "CAGR",
      value: formatPercent(cagr),
      detail: "Mock annualized return",
      tone: metricTone(cagr)
    },
    {
      label: "Sharpe Ratio",
      value: sharpe.toFixed(2),
      detail: "Risk-adjusted return metric",
      tone: metricTone(sharpe)
    },
    {
      label: "Max Drawdown",
      value: formatPercent(maxDrawdown),
      detail: "Decline from a previous peak",
      tone: "negative"
    },
    {
      label: "Volatility",
      value: formatPercent(volatility),
      detail: "Annualized monthly variation",
      tone: "neutral"
    },
    {
      label: "Win Rate",
      value: formatPercent(winRate),
      detail: "Positive mock periods",
      tone: "neutral"
    },
    {
      label: "Alpha",
      value: formatSignedPercent(alpha),
      detail: "Annualized after beta adjustment",
      tone: metricTone(alpha)
    },
    {
      label: "Beta",
      value: beta.toFixed(2),
      detail: `Sensitivity to ${benchmark}`,
      tone: beta > 1.1 ? "negative" : "neutral"
    },
    {
      label: "Turnover",
      value: `${turnover.toFixed(2)}x`,
      detail: "Assumed annual portfolio rotation",
      tone: turnover > 1.5 ? "negative" : "neutral"
    },
    {
      label: "Cost Impact",
      value: `-${transactionCostImpact.toFixed(2)}%`,
      detail: "Estimated annual transaction drag",
      tone: transactionCostImpact > 0.2 ? "negative" : "neutral"
    }
  ];
}
