"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { defaultStrategyConfig } from "@/data/mock-data";
import type { StrategyConfig } from "@/types/strategy";

type StrategyContextValue = {
  strategy: StrategyConfig;
  updateStrategy: (updates: Partial<StrategyConfig>) => void;
  updateRules: (updates: Partial<StrategyConfig["rules"]>) => void;
  runMockBacktest: () => void;
  lastRunAt: string | null;
};

const StrategyContext = createContext<StrategyContextValue | null>(null);

const storageKey = "signalforge-strategy-state";

type PersistedState = {
  strategy: StrategyConfig;
  lastRunAt: string | null;
};

export function StrategyProvider({ children }: { children: ReactNode }) {
  const [strategy, setStrategy] = useState<StrategyConfig>(defaultStrategyConfig);
  const [lastRunAt, setLastRunAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;

      const parsed = JSON.parse(raw) as PersistedState;
      setStrategy({ ...defaultStrategyConfig, ...parsed.strategy });
      setLastRunAt(parsed.lastRunAt ?? null);
    } catch {
      setStrategy(defaultStrategyConfig);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ strategy, lastRunAt }));
  }, [strategy, lastRunAt]);

  const value = useMemo<StrategyContextValue>(
    () => ({
      strategy,
      updateStrategy: (updates) => {
        setStrategy((current) => ({ ...current, ...updates }));
      },
      updateRules: (updates) => {
        setStrategy((current) => ({ ...current, rules: { ...current.rules, ...updates } }));
      },
      runMockBacktest: () => {
        setLastRunAt(new Date().toISOString());
      },
      lastRunAt
    }),
    [lastRunAt, strategy]
  );

  return <StrategyContext.Provider value={value}>{children}</StrategyContext.Provider>;
}

export function useStrategy() {
  const context = useContext(StrategyContext);

  if (!context) {
    throw new Error("useStrategy must be used within StrategyProvider");
  }

  return context;
}
