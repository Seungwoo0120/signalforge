"use client";

import dynamic from "next/dynamic";

import { ChartContainer } from "@/components/chart-container";
import type { Benchmark } from "@/types/strategy";

const EquityCurveChartClient = dynamic(
  () => import("@/components/dashboard-charts-impl").then((mod) => mod.EquityCurveChart),
  {
    ssr: false,
    loading: () => <ChartFallback title="Strategy Equity Curve" height="h-[320px]" />
  }
);

const DrawdownChartClient = dynamic(
  () => import("@/components/dashboard-charts-impl").then((mod) => mod.DrawdownChart),
  {
    ssr: false,
    loading: () => <ChartFallback title="Drawdown Preview" height="h-[265px]" />
  }
);

const MonthlyReturnsChartClient = dynamic(
  () => import("@/components/dashboard-charts-impl").then((mod) => mod.MonthlyReturnsChart),
  {
    ssr: false,
    loading: () => <ChartFallback title="Recent Monthly Returns" height="h-[265px]" />
  }
);

export function EquityCurveChart({ benchmark }: { benchmark: Benchmark }) {
  return <EquityCurveChartClient benchmark={benchmark} />;
}

export function DrawdownChart({ benchmark }: { benchmark: Benchmark }) {
  return <DrawdownChartClient benchmark={benchmark} />;
}

export function MonthlyReturnsChart({ benchmark }: { benchmark: Benchmark }) {
  return <MonthlyReturnsChartClient benchmark={benchmark} />;
}

function ChartFallback({ title, height }: { title: string; height: string }) {
  return (
    <ChartContainer title={title} subtitle="Loading chart module">
      <div className={`${height} rounded-md bg-panelMuted`} />
    </ChartContainer>
  );
}
