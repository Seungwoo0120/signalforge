import { getPortfolioCount } from "@/lib/quant-metrics";
import type { ScreenerResult } from "@/types/screener";
import type { ScreenerRow, StrategyConfig, Universe } from "@/types/strategy";

type StockCandidate = {
  ticker: string;
  company: string;
  sector: string;
  universes: Universe[];
  momentum: number;
  rsi: number;
  volumeRatio: number;
  aboveSma200: boolean;
  volatility: number;
};

const candidates: StockCandidate[] = [
  {
    ticker: "NVDA",
    company: "NVIDIA Corp.",
    sector: "Semiconductors",
    universes: ["Nasdaq 100", "S&P 500"],
    momentum: 12.4,
    rsi: 64,
    volumeRatio: 1.32,
    aboveSma200: true,
    volatility: 31
  },
  {
    ticker: "MSFT",
    company: "Microsoft Corp.",
    sector: "Software",
    universes: ["Nasdaq 100", "S&P 500"],
    momentum: 8.7,
    rsi: 58,
    volumeRatio: 1.12,
    aboveSma200: true,
    volatility: 20
  },
  {
    ticker: "AVGO",
    company: "Broadcom Inc.",
    sector: "Semiconductors",
    universes: ["Nasdaq 100", "S&P 500"],
    momentum: 7.9,
    rsi: 61,
    volumeRatio: 1.24,
    aboveSma200: true,
    volatility: 25
  },
  {
    ticker: "AMZN",
    company: "Amazon.com Inc.",
    sector: "Consumer Discretionary",
    universes: ["Nasdaq 100", "S&P 500"],
    momentum: 7.2,
    rsi: 59,
    volumeRatio: 0.96,
    aboveSma200: true,
    volatility: 27
  },
  {
    ticker: "COST",
    company: "Costco Wholesale Corp.",
    sector: "Retail",
    universes: ["Nasdaq 100", "S&P 500"],
    momentum: 4.1,
    rsi: 55,
    volumeRatio: 1.05,
    aboveSma200: true,
    volatility: 15
  },
  {
    ticker: "TSLA",
    company: "Tesla Inc.",
    sector: "Automobiles",
    universes: ["Nasdaq 100", "S&P 500"],
    momentum: 6.8,
    rsi: 74,
    volumeRatio: 0.92,
    aboveSma200: true,
    volatility: 42
  },
  {
    ticker: "META",
    company: "Meta Platforms Inc.",
    sector: "Communication Services",
    universes: ["Nasdaq 100", "S&P 500"],
    momentum: 5.9,
    rsi: 67,
    volumeRatio: 1.18,
    aboveSma200: false,
    volatility: 26
  },
  {
    ticker: "LLY",
    company: "Eli Lilly and Co.",
    sector: "Health Care",
    universes: ["S&P 500"],
    momentum: 6.1,
    rsi: 62,
    volumeRatio: 1.08,
    aboveSma200: true,
    volatility: 19
  },
  {
    ticker: "JPM",
    company: "JPMorgan Chase & Co.",
    sector: "Financials",
    universes: ["S&P 500"],
    momentum: 5.4,
    rsi: 57,
    volumeRatio: 1.02,
    aboveSma200: true,
    volatility: 18
  },
  {
    ticker: "XOM",
    company: "Exxon Mobil Corp.",
    sector: "Energy",
    universes: ["S&P 500"],
    momentum: 3.6,
    rsi: 53,
    volumeRatio: 1.16,
    aboveSma200: true,
    volatility: 22
  },
  {
    ticker: "UNH",
    company: "UnitedHealth Group Inc.",
    sector: "Health Care",
    universes: ["S&P 500"],
    momentum: -1.8,
    rsi: 46,
    volumeRatio: 0.88,
    aboveSma200: false,
    volatility: 21
  }
];

export function runMockScreener(strategy: StrategyConfig): ScreenerResult {
  const portfolioCount = getPortfolioCount(strategy.portfolioSize);
  const scoredRows = candidates
    .filter((candidate) => candidate.universes.includes(strategy.universe))
    .map((candidate) => toScreenerRow(candidate, strategy))
    .sort((a, b) => b.score - a.score);

  let includedCount = 0;
  const rows = scoredRows.map((row) => {
    if (row.status !== "Watchlist") return row;

    if (includedCount < portfolioCount) {
      includedCount += 1;
      return { ...row, status: "Included" as const };
    }

    return row;
  });

  return {
    universe: strategy.universe,
    benchmark: strategy.benchmark,
    rows,
    summary: {
      included: rows.filter((row) => row.status === "Included").length,
      watchlist: rows.filter((row) => row.status === "Watchlist").length,
      filtered: rows.filter((row) => row.status === "Filtered" || row.status === "RSI limit").length
    },
    ruleSummary: `${strategy.universe} candidates are ranked by momentum, RSI discipline, trend, volume, and volatility.`
  };
}

function toScreenerRow(candidate: StockCandidate, strategy: StrategyConfig): ScreenerRow {
  const passesMomentum = candidate.momentum >= strategy.rules.momentumThreshold;
  const passesRsi = candidate.rsi <= strategy.rules.rsiThreshold;
  const passesVolume = !strategy.rules.volumeAboveAverage || candidate.volumeRatio >= 1;
  const passesTrend = !strategy.rules.priceAboveSma200 || candidate.aboveSma200;
  const score = calculateScore(candidate, strategy);
  const status = getStatus({ passesMomentum, passesRsi, passesVolume, passesTrend });

  return {
    ticker: candidate.ticker,
    company: candidate.company,
    sector: candidate.sector,
    momentum: candidate.momentum,
    rsi: candidate.rsi,
    volumeSignal: candidate.volumeRatio >= 1 ? "Pass" : "Watch",
    trendSignal: candidate.aboveSma200 ? "Pass" : "Fail",
    score,
    status
  };
}

function calculateScore(candidate: StockCandidate, strategy: StrategyConfig) {
  const momentumScore = Math.min(40, candidate.momentum * 3.1);
  const rsiScore = candidate.rsi <= strategy.rules.rsiThreshold ? 24 - Math.max(0, candidate.rsi - 55) * 0.35 : 4;
  const volumeScore = candidate.volumeRatio >= 1 ? 16 + Math.min(6, (candidate.volumeRatio - 1) * 18) : 6;
  const trendScore = candidate.aboveSma200 ? 16 : strategy.rules.priceAboveSma200 ? -8 : 4;
  const volatilityPenalty = Math.max(0, candidate.volatility - 22) * 0.32;
  const benchmarkFit = strategy.benchmark === "QQQ" && candidate.universes.includes("Nasdaq 100") ? 3 : 0;

  return Math.max(0, Math.min(100, Math.round(momentumScore + rsiScore + volumeScore + trendScore + benchmarkFit - volatilityPenalty)));
}

function getStatus({
  passesMomentum,
  passesRsi,
  passesVolume,
  passesTrend
}: {
  passesMomentum: boolean;
  passesRsi: boolean;
  passesVolume: boolean;
  passesTrend: boolean;
}): ScreenerRow["status"] {
  if (!passesRsi) return "RSI limit";
  if (!passesMomentum || !passesVolume || !passesTrend) return "Filtered";
  return "Watchlist";
}
