import type { ScreenerRow, StrategyConfig } from "@/types/strategy";

export type ScreenerStatusSummary = {
  included: number;
  watchlist: number;
  filtered: number;
};

export type ScreenerResult = {
  universe: StrategyConfig["universe"];
  benchmark: StrategyConfig["benchmark"];
  rows: ScreenerRow[];
  summary: ScreenerStatusSummary;
  ruleSummary: string;
};
