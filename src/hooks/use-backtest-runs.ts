"use client";

import { useEffect, useMemo, useState } from "react";

import type { BacktestResult, BacktestRun } from "@/types/backtest";
import type { ScreenerResult } from "@/types/screener";
import type { StrategyConfig } from "@/types/strategy";

const storageKey = "signalforge-backtest-runs";
const maxRuns = 10;

export function useBacktestRuns() {
  const [runs, setRuns] = useState<BacktestRun[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        setRuns(JSON.parse(raw) as BacktestRun[]);
      }
    } catch {
      setRuns([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(storageKey, JSON.stringify(runs));
  }, [loaded, runs]);

  const latestRun = useMemo(() => runs[0] ?? null, [runs]);

  function saveRun({
    strategy,
    backtest,
    screener
  }: {
    strategy: StrategyConfig;
    backtest: BacktestResult;
    screener: ScreenerResult;
  }) {
    const createdAt = new Date().toISOString();
    const run: BacktestRun = {
      id: `run-${Date.now()}`,
      createdAt,
      runLabel: `${strategy.name} / ${strategy.benchmark}`,
      strategyName: strategy.name,
      benchmark: strategy.benchmark,
      strategySnapshot: structuredClone(strategy),
      backtestResultSnapshot: structuredClone(backtest),
      screenerResultSnapshot: structuredClone(screener)
    };

    setRuns((current) => [run, ...current].slice(0, maxRuns));
    return run;
  }

  function clearRuns() {
    setRuns([]);
  }

  return {
    runs,
    latestRun,
    saveRun,
    clearRuns
  };
}
