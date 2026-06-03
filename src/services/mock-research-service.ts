import type { BacktestResult } from "@/types/backtest";
import type { ResearchNotes } from "@/types/research";
import type { ScreenerResult } from "@/types/screener";
import type { SensitivityAnalysis } from "@/types/sensitivity";
import type { StrategyConfig } from "@/types/strategy";

export function generateMockResearchNotes(
  strategy: StrategyConfig,
  backtest: BacktestResult,
  screener: ScreenerResult,
  sensitivity?: SensitivityAnalysis
): ResearchNotes {
  const returnGap = backtest.rawMetrics.totalReturn - backtest.rawMetrics.benchmarkReturn;
  const costImpact = backtest.rawMetrics.transactionCostImpact;
  const drawdown = Math.abs(backtest.rawMetrics.maxDrawdown);

  return {
    strategySummary: `${strategy.name} screens ${strategy.universe} stocks against ${strategy.benchmark}, selects ${strategy.portfolioSize.toLowerCase()}, and assumes ${strategy.rebalance.toLowerCase()} rebalancing with ${strategy.transactionCost} transaction cost. The current simulated screener includes ${screener.summary.included} names and filters ${screener.summary.filtered}.`,
    sections: [
      {
        id: "worked",
        title: "What worked",
        body:
          returnGap >= 0
            ? `The simulated result benefits from the rule stack selecting stronger momentum candidates while comparing favorably with ${strategy.benchmark}. The estimated total return gap is ${returnGap.toFixed(1)} percentage points in this simulated sample.`
            : `The simulated result trails ${strategy.benchmark} in this configuration. The rules still reduce some weak candidates, but the selected assumptions do not offset benchmark strength in this sample.`
      },
      {
        id: "risks",
        title: "Key risks",
        body: `${strategy.portfolioSize} creates ${strategy.portfolioSize === "Top 5" ? "high" : strategy.portfolioSize === "Top 10" ? "moderate" : "lower"} concentration risk. The simulated max drawdown is ${drawdown.toFixed(1)}%, meaning the portfolio declined from a previous peak before recovering.`
      },
      {
        id: "overfitting",
        title: "Overfitting warning",
        body: "These thresholds are educational prototype inputs. A real strategy would need out-of-sample testing, survivorship-bias controls, sensitivity analysis, and realistic trade execution assumptions."
      },
      {
        id: "costs",
        title: "Transaction cost warning",
        body: `${strategy.rebalance} rebalancing and ${strategy.transactionCost} transaction cost create an estimated ${costImpact.toFixed(2)}% annualized drag in this simulated model. Higher turnover can make attractive gross results less useful after costs.`
      },
      {
        id: "benchmark",
        title: "Benchmark interpretation",
        body: `Alpha and beta are calculated against ${strategy.benchmark}. A higher return does not prove the rules are predictive; it only shows how this deterministic prototype setup reacts to the selected assumptions.`
      },
      {
        id: "stability",
        title: "Stability read",
        body: sensitivity
          ? `The current stability score is ${sensitivity.stabilityScore}. Transaction cost sensitivity is ${sensitivity.transactionCostSensitivity.toLowerCase()}, and portfolio size sensitivity is ${sensitivity.portfolioSensitivity.toLowerCase()}. ${sensitivity.overfittingWarning ?? "The tested variations do not show severe fragility in this simulated setup."}`
          : "A full stability read compares nearby parameter variations. This prototype treats that output as educational context rather than proof of robustness."
      },
      {
        id: "improvements",
        title: "Possible improvements",
        body: "Next product iterations should add sector caps, trade logs, regime filters, and a service contract that can later be replaced by a real backend quant engine."
      }
    ],
    disclaimer:
      "This is simulated educational analysis for a frontend prototype. It is not financial advice, a recommendation, or a prediction of future performance."
  };
}
