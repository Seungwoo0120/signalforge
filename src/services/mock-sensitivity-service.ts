import { round } from "@/lib/quant-metrics";
import { runMockBacktest } from "@/services/mock-backtest-service";
import type { SensitivityAnalysis, SensitivityResult, StabilityScore } from "@/types/sensitivity";
import type { PortfolioSize, RebalanceFrequency, StrategyConfig, TransactionCost } from "@/types/strategy";

const transactionCosts: TransactionCost[] = ["0.00%", "0.05%", "0.10%", "0.25%"];
const portfolioSizes: PortfolioSize[] = ["Top 5", "Top 10", "Top 20"];
const rebalanceFrequencies: RebalanceFrequency[] = ["Weekly", "Monthly", "Quarterly"];

export function runMockSensitivityAnalysis(strategy: StrategyConfig): SensitivityAnalysis {
  const results: SensitivityResult[] = [
    ...momentumScenarios(strategy),
    ...rsiScenarios(strategy),
    ...transactionCostScenarios(strategy),
    ...portfolioScenarios(strategy),
    ...rebalanceScenarios(strategy)
  ];
  const returnRange = range(results.map((result) => result.totalReturn));
  const sharpeRange = range(results.map((result) => result.sharpe));
  const drawdownRange = range(results.map((result) => Math.abs(result.maxDrawdown)));
  const stabilityScore = scoreStability(returnRange, sharpeRange, drawdownRange);
  const transactionCostSensitivity = scoreSingleDimension(
    results.filter((result) => result.scenario === "Transaction Cost")
  );
  const portfolioSensitivity = scoreSingleDimension(results.filter((result) => result.scenario === "Portfolio Size"));

  return {
    results,
    stabilityScore,
    scoreDetail: buildScoreDetail(stabilityScore, returnRange, sharpeRange),
    overfittingWarning:
      stabilityScore === "Low"
        ? "Small parameter changes produce meaningfully different simulated results. Treat this configuration as fragile until tested more broadly."
        : null,
    transactionCostSensitivity,
    portfolioSensitivity
  };
}

function momentumScenarios(strategy: StrategyConfig) {
  return [-2, 0, 2].map((delta) => {
    const threshold = clamp(strategy.rules.momentumThreshold + delta, 0, 20);
    return buildResult({
      baseStrategy: strategy,
      id: `momentum-${threshold}`,
      scenario: "Momentum Threshold",
      variation: `${threshold}%`,
      strategy: { ...strategy, rules: { ...strategy.rules, momentumThreshold: threshold } }
    });
  });
}

function rsiScenarios(strategy: StrategyConfig) {
  return [-5, 0, 5].map((delta) => {
    const threshold = clamp(strategy.rules.rsiThreshold + delta, 45, 85);
    return buildResult({
      baseStrategy: strategy,
      id: `rsi-${threshold}`,
      scenario: "RSI Threshold",
      variation: `${threshold}`,
      strategy: { ...strategy, rules: { ...strategy.rules, rsiThreshold: threshold } }
    });
  });
}

function transactionCostScenarios(strategy: StrategyConfig) {
  return transactionCosts.map((transactionCost) =>
    buildResult({
      baseStrategy: strategy,
      id: `cost-${transactionCost}`,
      scenario: "Transaction Cost",
      variation: transactionCost,
      strategy: { ...strategy, transactionCost }
    })
  );
}

function portfolioScenarios(strategy: StrategyConfig) {
  return portfolioSizes.map((portfolioSize) =>
    buildResult({
      baseStrategy: strategy,
      id: `portfolio-${portfolioSize}`,
      scenario: "Portfolio Size",
      variation: portfolioSize,
      strategy: { ...strategy, portfolioSize }
    })
  );
}

function rebalanceScenarios(strategy: StrategyConfig) {
  return rebalanceFrequencies.map((rebalance) =>
    buildResult({
      baseStrategy: strategy,
      id: `rebalance-${rebalance}`,
      scenario: "Rebalance Frequency",
      variation: rebalance,
      strategy: { ...strategy, rebalance }
    })
  );
}

function buildResult({
  baseStrategy,
  id,
  scenario,
  variation,
  strategy
}: {
  baseStrategy: StrategyConfig;
  id: string;
  scenario: SensitivityResult["scenario"];
  variation: string;
  strategy: StrategyConfig;
}): SensitivityResult {
  const backtest = runMockBacktest(strategy);
  const baseBacktest = runMockBacktest(baseStrategy);
  const returnDelta = backtest.rawMetrics.totalReturn - baseBacktest.rawMetrics.totalReturn;
  const absDelta = Math.abs(returnDelta);

  return {
    id,
    scenario,
    variation,
    totalReturn: round(backtest.rawMetrics.totalReturn, 1),
    sharpe: round(backtest.rawMetrics.sharpe, 2),
    maxDrawdown: round(backtest.rawMetrics.maxDrawdown, 1),
    turnover: round(backtest.rawMetrics.turnover, 2),
    stabilityNote:
      absDelta < 4
        ? "Stable vs current setup"
        : absDelta < 10
          ? "Moderate sensitivity"
          : "Large result shift"
  };
}

function scoreSingleDimension(results: SensitivityResult[]): StabilityScore {
  const returnRange = range(results.map((result) => result.totalReturn));
  const sharpeRange = range(results.map((result) => result.sharpe));
  return scoreStability(returnRange, sharpeRange, 0);
}

function scoreStability(returnRange: number, sharpeRange: number, drawdownRange: number): StabilityScore {
  if (returnRange <= 8 && sharpeRange <= 0.18 && drawdownRange <= 4) return "High";
  if (returnRange <= 18 && sharpeRange <= 0.42 && drawdownRange <= 9) return "Medium";
  return "Low";
}

function buildScoreDetail(score: StabilityScore, returnRange: number, sharpeRange: number) {
  if (score === "High") {
    return `Simulated results are relatively similar across tested variations. Total return range is ${returnRange.toFixed(1)} points and Sharpe range is ${sharpeRange.toFixed(2)}.`;
  }

  if (score === "Medium") {
    return `Some settings move results meaningfully. Total return range is ${returnRange.toFixed(1)} points and Sharpe range is ${sharpeRange.toFixed(2)}.`;
  }

  return `Results shift heavily across tested settings. Total return range is ${returnRange.toFixed(1)} points and Sharpe range is ${sharpeRange.toFixed(2)}.`;
}

function range(values: number[]) {
  return Math.max(...values) - Math.min(...values);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
