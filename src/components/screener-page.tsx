"use client";

import { ArrowDownUp, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import { PageHeader } from "@/components/page-header";
import { screenerRows } from "@/data/mock-data";
import { cn } from "@/lib/utils";
import { useStrategy } from "@/providers/strategy-provider";

type SortKey = "score" | "momentum" | "rsi";
type StatusFilter = "All" | "Included" | "Filtered" | "Watchlist" | "RSI limit";

export function ScreenerPage() {
  const { strategy } = useStrategy();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [sortKey, setSortKey] = useState<SortKey>("score");

  const rows = useMemo(() => {
    return screenerRows
      .filter((row) => {
        const searchable = `${row.ticker} ${row.company} ${row.sector}`.toLowerCase();
        const matchesQuery = searchable.includes(query.toLowerCase());
        const matchesStatus = status === "All" || row.status === status;
        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => b[sortKey] - a[sortKey]);
  }, [query, sortKey, status]);

  return (
    <>
      <PageHeader
        eyebrow="Screener"
        title="Review stocks passing the current mock rule stack."
        description={`The table is filtered by the current ${strategy.universe} strategy configuration. Results are sample data for UI prototyping only.`}
      />

      <section className="rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-borderSoft bg-panelMuted px-3 py-2">
            <Search className="text-textMuted" size={17} />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-textMuted"
              placeholder="Search ticker, company, or sector"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="rounded-md border border-borderSoft bg-panelMuted px-3 py-2 text-sm font-semibold outline-none"
              value={status}
              onChange={(event) => setStatus(event.target.value as StatusFilter)}
            >
              {["All", "Included", "Watchlist", "Filtered", "RSI limit"].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              className="rounded-md border border-borderSoft bg-panelMuted px-3 py-2 text-sm font-semibold outline-none"
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as SortKey)}
            >
              <option value="score">Sort by score</option>
              <option value="momentum">Sort by momentum</option>
              <option value="rsi">Sort by RSI</option>
            </select>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-borderSoft text-xs uppercase tracking-[0.14em] text-textMuted">
                <Header>Ticker</Header>
                <Header>Company</Header>
                <Header>Sector</Header>
                <Header>Momentum</Header>
                <Header>RSI</Header>
                <Header>Volume Signal</Header>
                <Header>Trend Signal</Header>
                <Header>
                  <span className="inline-flex items-center gap-1">
                    Score <ArrowDownUp size={13} />
                  </span>
                </Header>
                <Header>Status</Header>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.ticker} className="border-b border-borderSoft last:border-0">
                  <td className="py-3 font-semibold">{row.ticker}</td>
                  <td className="py-3 text-textMuted">{row.company}</td>
                  <td className="py-3 text-textMuted">{row.sector}</td>
                  <td className="py-3">{row.momentum.toFixed(1)}%</td>
                  <td className="py-3">{row.rsi}</td>
                  <td className="py-3">
                    <SignalPill pass={row.volumeSignal === "Pass"}>{row.volumeSignal}</SignalPill>
                  </td>
                  <td className="py-3">
                    <SignalPill pass={row.trendSignal === "Pass"}>{row.trendSignal}</SignalPill>
                  </td>
                  <td className="py-3 font-semibold">{row.score}</td>
                  <td className="py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-md px-2.5 py-1 text-xs font-semibold",
                        row.status === "Included"
                          ? "bg-accentSoft text-accent"
                          : "bg-panelMuted text-textMuted"
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function Header({ children }: { children: ReactNode }) {
  return <th className="py-3 font-semibold">{children}</th>;
}

function SignalPill({ children, pass }: { children: ReactNode; pass: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2.5 py-1 text-xs font-semibold",
        pass ? "bg-accentSoft text-accent" : "bg-panelMuted text-textMuted"
      )}
    >
      {children}
    </span>
  );
}
