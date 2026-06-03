import type { ChartPoint, MetricTone, PortfolioSize, RebalanceFrequency, TransactionCost } from "@/types/strategy";

export function parseTransactionCost(cost: TransactionCost) {
  return Number(cost.replace("%", "")) / 100;
}

export function getPortfolioCount(size: PortfolioSize) {
  const [, count] = size.split(" ");
  return Number(count);
}

export function getRebalanceEventsPerYear(rebalance: RebalanceFrequency) {
  const events: Record<RebalanceFrequency, number> = {
    Weekly: 52,
    Monthly: 12,
    Quarterly: 4
  };

  return events[rebalance];
}

export function getRebalanceTurnover(rebalance: RebalanceFrequency) {
  const turnover: Record<RebalanceFrequency, number> = {
    Weekly: 2.4,
    Monthly: 1.15,
    Quarterly: 0.55
  };

  return turnover[rebalance];
}

export function compoundReturns(startingValue: number, monthlyReturns: number[]) {
  return monthlyReturns.reduce<number[]>((values, monthlyReturn) => {
    const previous = values[values.length - 1];
    return [...values, round(previous * (1 + monthlyReturn / 100), 1)];
  }, [startingValue]);
}

export function toChartPoints(months: string[], strategyValues: number[], benchmarkValues: number[]): ChartPoint[] {
  return months.map((month, index) => ({
    month,
    strategy: strategyValues[index],
    benchmark: benchmarkValues[index]
  }));
}

export function calculateDrawdown(values: number[]) {
  let peak = values[0] ?? 100;

  return values.map((value) => {
    peak = Math.max(peak, value);
    return round(((value - peak) / peak) * 100, 1);
  });
}

export function calculateTotalReturn(values: number[]) {
  const first = values[0] ?? 100;
  const last = values[values.length - 1] ?? first;

  return ((last / first) - 1) * 100;
}

export function calculateCagr(totalReturn: number, months: number) {
  const years = months / 12;
  return (Math.pow(1 + totalReturn / 100, 1 / years) - 1) * 100;
}

export function calculateVolatility(monthlyReturns: number[]) {
  return standardDeviation(monthlyReturns) * Math.sqrt(12);
}

export function calculateSharpe(monthlyReturns: number[]) {
  const annualizedReturn = mean(monthlyReturns) * 12;
  const volatility = calculateVolatility(monthlyReturns);

  return volatility === 0 ? 0 : annualizedReturn / volatility;
}

export function calculateWinRate(monthlyReturns: number[]) {
  const wins = monthlyReturns.filter((monthlyReturn) => monthlyReturn > 0).length;
  return (wins / monthlyReturns.length) * 100;
}

export function calculateBeta(strategyReturns: number[], benchmarkReturns: number[]) {
  const benchmarkMean = mean(benchmarkReturns);
  const strategyMean = mean(strategyReturns);
  const covariance =
    strategyReturns.reduce((total, value, index) => {
      return total + (value - strategyMean) * (benchmarkReturns[index] - benchmarkMean);
    }, 0) / strategyReturns.length;
  const benchmarkVariance =
    benchmarkReturns.reduce((total, value) => total + Math.pow(value - benchmarkMean, 2), 0) /
    benchmarkReturns.length;

  return benchmarkVariance === 0 ? 0 : covariance / benchmarkVariance;
}

export function metricTone(value: number, positiveIsGood = true): MetricTone {
  if (value === 0) return "neutral";
  const isPositive = value > 0;
  return isPositive === positiveIsGood ? "positive" : "negative";
}

export function formatPercent(value: number, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}

export function formatSignedPercent(value: number, decimals = 1) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

export function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function mean(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function standardDeviation(values: number[]) {
  const average = mean(values);
  const variance = values.reduce((total, value) => total + Math.pow(value - average, 2), 0) / values.length;
  return Math.sqrt(variance);
}
