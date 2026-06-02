"use client";

import { useEffect, useMemo, useState } from "react";

import type { StrategyPreset, StrategyPresetTag } from "@/types/strategy-preset";
import type { StrategyConfig } from "@/types/strategy";

const storageKey = "signalforge-strategy-presets";
const maxUserPresets = 20;
const templateDate = "2026-06-02T00:00:00.000Z";

export const builtInStrategyPresets: StrategyPreset[] = [
  {
    id: "template-momentum-trend",
    name: "Momentum Trend Strategy",
    description: "Balanced Nasdaq 100 trend and momentum template for the mock prototype.",
    createdAt: templateDate,
    updatedAt: templateDate,
    builtIn: true,
    tags: ["Momentum", "Trend"],
    strategyConfig: {
      name: "Momentum Trend Strategy",
      universe: "Nasdaq 100",
      benchmark: "SPY",
      portfolioSize: "Top 10",
      weighting: "Equal weight",
      rebalance: "Monthly",
      transactionCost: "0.10%",
      rules: {
        priceAboveSma200: true,
        momentumThreshold: 5,
        rsiThreshold: 70,
        volumeAboveAverage: true
      }
    }
  },
  {
    id: "template-defensive-trend",
    name: "Defensive Trend Strategy",
    description: "Broader S&P 500 trend template with lower turnover and tighter RSI discipline.",
    createdAt: templateDate,
    updatedAt: templateDate,
    builtIn: true,
    tags: ["Defensive", "Trend"],
    strategyConfig: {
      name: "Defensive Trend Strategy",
      universe: "S&P 500",
      benchmark: "SPY",
      portfolioSize: "Top 20",
      weighting: "Equal weight",
      rebalance: "Quarterly",
      transactionCost: "0.05%",
      rules: {
        priceAboveSma200: true,
        momentumThreshold: 3,
        rsiThreshold: 65,
        volumeAboveAverage: true
      }
    }
  },
  {
    id: "template-high-momentum",
    name: "High Momentum Strategy",
    description: "Concentrated Nasdaq 100 template with stronger momentum requirements.",
    createdAt: templateDate,
    updatedAt: templateDate,
    builtIn: true,
    tags: ["Momentum", "Experimental"],
    strategyConfig: {
      name: "High Momentum Strategy",
      universe: "Nasdaq 100",
      benchmark: "QQQ",
      portfolioSize: "Top 5",
      weighting: "Equal weight",
      rebalance: "Weekly",
      transactionCost: "0.10%",
      rules: {
        priceAboveSma200: true,
        momentumThreshold: 8,
        rsiThreshold: 75,
        volumeAboveAverage: true
      }
    }
  },
  {
    id: "template-low-turnover-core",
    name: "Low Turnover Core Strategy",
    description: "S&P 500 core template focused on broader selection and quarterly rebalance.",
    createdAt: templateDate,
    updatedAt: templateDate,
    builtIn: true,
    tags: ["Core", "Trend"],
    strategyConfig: {
      name: "Low Turnover Core Strategy",
      universe: "S&P 500",
      benchmark: "SPY",
      portfolioSize: "Top 20",
      weighting: "Equal weight",
      rebalance: "Quarterly",
      transactionCost: "0.05%",
      rules: {
        priceAboveSma200: true,
        momentumThreshold: 4,
        rsiThreshold: 70,
        volumeAboveAverage: false
      }
    }
  }
];

export function useStrategyPresets() {
  const [userPresets, setUserPresets] = useState<StrategyPreset[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        setUserPresets(JSON.parse(raw) as StrategyPreset[]);
      }
    } catch {
      setUserPresets([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(storageKey, JSON.stringify(userPresets));
  }, [loaded, userPresets]);

  const latestPreset = useMemo(() => userPresets[0] ?? null, [userPresets]);
  const allPresets = useMemo(() => [...builtInStrategyPresets, ...userPresets], [userPresets]);

  function savePreset({
    description,
    name,
    strategyConfig,
    tags = ["Experimental"]
  }: {
    description: string;
    name: string;
    strategyConfig: StrategyConfig;
    tags?: StrategyPresetTag[];
  }) {
    const now = new Date().toISOString();
    const preset: StrategyPreset = {
      id: `preset-${Date.now()}`,
      name,
      description,
      createdAt: now,
      updatedAt: now,
      strategyConfig: structuredClone(strategyConfig),
      tags,
      builtIn: false
    };

    setUserPresets((current) => [preset, ...current].slice(0, maxUserPresets));
    return preset;
  }

  function renamePreset(id: string, name: string) {
    setUserPresets((current) =>
      current.map((preset) =>
        preset.id === id ? { ...preset, name, updatedAt: new Date().toISOString() } : preset
      )
    );
  }

  function deletePreset(id: string) {
    setUserPresets((current) => current.filter((preset) => preset.id !== id));
  }

  return {
    allPresets,
    builtInPresets: builtInStrategyPresets,
    userPresets,
    latestPreset,
    savePreset,
    renamePreset,
    deletePreset
  };
}
