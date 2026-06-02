"use client";

import dynamic from "next/dynamic";

import { ChartContainer } from "@/components/chart-container";
import type { Benchmark, ChartPoint } from "@/types/strategy";

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

export function EquityCurveChart({ benchmark, data }: { benchmark: Benchmark; data?: ChartPoint[] }) {
  return <EquityCurveChartClient benchmark={benchmark} data={data} />;
}

export function DrawdownChart({ benchmark, data }: { benchmark: Benchmark; data?: ChartPoint[] }) {
  return <DrawdownChartClient benchmark={benchmark} data={data} />;
}

export function MonthlyReturnsChart({ benchmark, data }: { benchmark: Benchmark; data?: ChartPoint[] }) {
  return <MonthlyReturnsChartClient benchmark={benchmark} data={data} />;
}

function ChartFallback({ title, height }: { title: string; height: string }) {
  return (
    <ChartContainer title={title} subtitle="Loading chart module">
      <div className={`${height} rounded-md bg-panelMuted`} />
    </ChartContainer>
  );
}
