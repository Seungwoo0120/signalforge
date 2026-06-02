import { cn } from "@/lib/utils";
import type { ScreenerRow } from "@/types/strategy";

export function ResultsTable({
  rows,
  rebalance
}: {
  rows: ScreenerRow[];
  rebalance: string;
}) {
  return (
    <section className="rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Signal Snapshot</h2>
          <p className="mt-1 text-sm text-textMuted">Latest mock rebalance candidates and filters</p>
        </div>
        <span className="rounded-md border border-borderSoft bg-panelMuted px-3 py-2 text-sm font-medium text-textMuted">
          {rebalance} rebalance
        </span>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-borderSoft text-xs uppercase tracking-[0.14em] text-textMuted">
              <th className="py-3 font-semibold">Ticker</th>
              <th className="py-3 font-semibold">Company</th>
              <th className="py-3 font-semibold">Sector</th>
              <th className="py-3 font-semibold">Momentum</th>
              <th className="py-3 font-semibold">RSI</th>
              <th className="py-3 font-semibold">Score</th>
              <th className="py-3 font-semibold">Status</th>
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
                <td className="py-3">{row.score}</td>
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
  );
}
