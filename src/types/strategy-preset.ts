import type { StrategyConfig } from "@/types/strategy";

export type StrategyPresetTag = "Momentum" | "Trend" | "Defensive" | "Core" | "Experimental";

export type StrategyPreset = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  strategyConfig: StrategyConfig;
  tags: StrategyPresetTag[];
  builtIn: boolean;
};
