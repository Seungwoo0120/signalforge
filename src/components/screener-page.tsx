"use client";

import { ArrowDownUp, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { cn } from "@/lib/utils";
import { useStrategy } from "@/providers/strategy-provider";
import { runMockScreener } from "@/services/mock-screener-service";

type SortKey = "score" | "momentum" | "rsi";
type StatusFilter = "All" | "Included" | "Filtered" | "Watchlist" | "RSI limit";

export function ScreenerPage() {
  const { strategy } = useStrategy();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const screener = useMemo(() => runMockScreener(strategy), [strategy]);

  const rows = useMemo(() => {
    return screener.rows
      .filter((row) => {
        const searchable = `${row.ticker} ${row.company} ${row.sector}`.toLowerCase();
        const matchesQuery = searchable.includes(query.toLowerCase());
        const matchesStatus = status === "All" || row.status === status;
        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => b[sortKey] - a[sortKey]);
  }, [query, screener.rows, sortKey, status]);

  return (
    <>
      <PageHeader
        eyebrow="Screener"
        title="Review stocks passing the current mock rule stack."
        description={`${screener.ruleSummary} Results are hypothetical sample data for UI prototyping only.`}
      />

      <section className="rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-borderSoft bg-panelMuted px-3 py-2 transition focus-within:border-accent">
            <Search className="text-textMuted" size={17} />
            <input
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-textMuted"
              placeholder="Search ticker, company, or sector"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="rounded-md border border-borderSoft bg-panelMuted px-3 py-2 text-sm font-semibold outline-none transition focus:border-accent"
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
              className="rounded-md border border-borderSoft bg-panelMuted px-3 py-2 text-sm font-semibold outline-none transition focus:border-accent"
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as SortKey)}
            >
              <option value="score">Sort by score</option>
              <option value="momentum">Sort by momentum</option>
              <option value="rsi">Sort by RSI</option>
            </select>
          </div>
        </div>

        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <Summary label="Included" value={String(screener.summary.included)} />
          <Summary label="Watchlist" value={String(screener.summary.watchlist)} />
          <Summary label="Filtered" value={String(screener.summary.filtered)} />
        </div>

        <div className="mt-5 overflow-x-auto rounded-md border border-borderSoft">
          <table className="w-full min-w-[980px] border-collapse text-left text-sm">
            <thead className="bg-panelMuted">
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
                <tr key={row.ticker} className="border-b border-borderSoft transition last:border-0 hover:bg-panelMuted/65">
                  <td className="py-3 pl-3 font-semibold">{row.ticker}</td>
                  <td className="py-3">
                    <div className="font-medium">{row.company}</div>
                  </td>
                  <td className="py-3 text-textMuted">{row.sector}</td>
                  <td className="py-3">{row.momentum.toFixed(1)}%</td>
                  <td className="py-3">{row.rsi}</td>
                  <td className="py-3">
                    <SignalPill pass={row.volumeSignal === "Pass"}>{row.volumeSignal}</SignalPill>
                  </td>
                  <td className="py-3">
                    <SignalPill pass={row.trendSignal === "Pass"}>{row.trendSignal}</SignalPill>
                  </td>
                  <td className="py-3">
                    <span className="inline-flex min-w-10 justify-center rounded-md bg-panelMuted px-2.5 py-1 font-semibold">
                      {row.score}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={cn(
                        "inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold",
                        row.status === "Included"
                          ? "border-accent/25 bg-accentSoft text-accent"
                          : "border-borderSoft bg-panelMuted text-textMuted"
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
        {rows.length === 0 ? (
          <div className="mt-5">
            <EmptyState
              description="Try a broader status filter or search term. The screener is using deterministic mock data from the current strategy."
              title="No matching candidates"
            />
          </div>
        ) : null}
      </section>
    </>
  );
}

function Header({ children }: { children: ReactNode }) {
  return <th className="py-3 first:pl-3 font-semibold">{children}</th>;
}

function SignalPill({ children, pass }: { children: ReactNode; pass: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold",
        pass ? "border-accent/25 bg-accentSoft text-accent" : "border-borderSoft bg-panel text-textMuted"
      )}
    >
      {children}
    </span>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-borderSoft bg-panelMuted p-3">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-textMuted">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}
