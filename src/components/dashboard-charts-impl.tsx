"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { ChartContainer } from "@/components/chart-container";
import { getChartData } from "@/data/mock-data";
import type { Benchmark, ChartPoint } from "@/types/strategy";

const chartColors = {
  strategy: "#0e9aa7",
  benchmark: "#64748b",
  drawdown: "#dc2626",
  grid: "hsl(var(--border-soft))",
  text: "hsl(var(--text-muted))",
  panel: "hsl(var(--panel))"
};

const tooltipStyle = {
  background: "hsl(var(--panel))",
  border: "1px solid hsl(var(--border-soft))",
  borderRadius: 8,
  color: "hsl(var(--text-primary))"
};

export function EquityCurveChart({ benchmark }: { benchmark: Benchmark }) {
  const mounted = useMounted();
  const data = getChartData(benchmark).equity;

  return (
    <ChartContainer
      title="Strategy Equity Curve"
      subtitle={`Growth of $100, mock data, compared with ${benchmark}`}
      action={<LegendPill label={`Benchmark: ${benchmark}`} />}
    >
      <div className="h-[320px]">
        {mounted ? (
          <ResponsiveContainer height="100%" width="100%">
          <AreaChart data={data} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="strategyFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor={chartColors.strategy} stopOpacity={0.22} />
                <stop offset="95%" stopColor={chartColors.strategy} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              minTickGap={34}
              stroke={chartColors.text}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              stroke={chartColors.text}
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: chartColors.grid }} />
            <Area
              dataKey="strategy"
              name="Strategy"
              type="monotone"
              stroke={chartColors.strategy}
              strokeWidth={2.4}
              fill="url(#strategyFill)"
            />
            <Line
              dataKey="benchmark"
              name={benchmark}
              type="monotone"
              stroke={chartColors.benchmark}
              strokeDasharray="5 4"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ChartSkeleton />
        )}
      </div>
    </ChartContainer>
  );
}

export function DrawdownChart({ benchmark }: { benchmark: Benchmark }) {
  const mounted = useMounted();
  const data = getChartData(benchmark).drawdown;

  return (
    <ChartContainer title="Drawdown Preview" subtitle="Peak-to-trough declines over the mock test">
      <div className="h-[265px]">
        {mounted ? (
          <ResponsiveContainer height="100%" width="100%">
          <LineChart data={data} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              minTickGap={38}
              stroke={chartColors.text}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              stroke={chartColors.text}
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: chartColors.grid }} />
            <Line
              dataKey="strategy"
              name="Strategy"
              type="monotone"
              stroke={chartColors.drawdown}
              strokeWidth={2.2}
              dot={false}
            />
            <Line
              dataKey="benchmark"
              name={benchmark}
              type="monotone"
              stroke={chartColors.benchmark}
              strokeDasharray="4 4"
              strokeWidth={1.8}
              dot={false}
            />
          </LineChart>
          </ResponsiveContainer>
        ) : (
          <ChartSkeleton />
        )}
      </div>
    </ChartContainer>
  );
}

export function MonthlyReturnsChart({ benchmark }: { benchmark: Benchmark }) {
  const mounted = useMounted();
  const data = getChartData(benchmark).monthly;

  return (
    <ChartContainer title="Recent Monthly Returns" subtitle="Mock return distribution by month">
      <div className="h-[265px]">
        {mounted ? (
          <ResponsiveContainer height="100%" width="100%">
          <BarChart data={data} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              stroke={chartColors.text}
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <YAxis
              stroke={chartColors.text}
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--panel-muted))" }} />
            <Bar dataKey="strategy" name="Strategy" fill={chartColors.strategy} radius={[4, 4, 0, 0]} />
            <Bar dataKey="benchmark" name={benchmark} fill={chartColors.benchmark} radius={[4, 4, 0, 0]} />
          </BarChart>
          </ResponsiveContainer>
        ) : (
          <ChartSkeleton />
        )}
      </div>
    </ChartContainer>
  );
}

export function CompactEquityCurve({ benchmark, data }: { benchmark: Benchmark; data?: ChartPoint[] }) {
  const mounted = useMounted();
  const chartData = data ?? getChartData(benchmark).equity;

  return (
    <div className="h-[220px]">
      {mounted ? (
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart data={chartData} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="compactStrategyFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor={chartColors.strategy} stopOpacity={0.2} />
                <stop offset="95%" stopColor={chartColors.strategy} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" hide />
            <YAxis hide domain={["dataMin - 8", "dataMax + 8"]} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: chartColors.grid }} />
            <Area
              dataKey="strategy"
              name="Strategy"
              type="monotone"
              stroke={chartColors.strategy}
              strokeWidth={2.2}
              fill="url(#compactStrategyFill)"
            />
            <Line
              dataKey="benchmark"
              name={benchmark}
              type="monotone"
              stroke={chartColors.benchmark}
              strokeDasharray="4 4"
              strokeWidth={1.8}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <ChartSkeleton />
      )}
    </div>
  );
}

function LegendPill({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-borderSoft bg-panelMuted px-3 py-2 text-sm font-medium text-textMuted">
      {label}
    </div>
  );
}

function ChartSkeleton() {
  return <div className="h-full w-full rounded-md bg-panelMuted" />;
}

function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
