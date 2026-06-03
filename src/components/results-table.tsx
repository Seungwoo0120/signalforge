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
    <section className="min-w-0 rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">Signal Snapshot</h2>
          <p className="mt-1 text-sm text-textMuted">Latest simulated rebalance candidates and filters</p>
        </div>
        <span className="rounded-md border border-borderSoft bg-panelMuted px-3 py-2 text-sm font-medium text-textMuted">
          {rebalance} rebalance
        </span>
      </div>

      <div className="mt-5 max-w-full overflow-x-auto rounded-md border border-borderSoft">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-panelMuted">
            <tr className="border-b border-borderSoft text-xs uppercase tracking-[0.14em] text-textMuted">
              <th className="py-3 pl-3 font-semibold">Ticker</th>
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
              <tr key={row.ticker} className="border-b border-borderSoft transition last:border-0 hover:bg-panelMuted/65">
                <td className="py-3 pl-3 font-semibold">{row.ticker}</td>
                <td className="py-3 font-medium">{row.company}</td>
                <td className="py-3 text-textMuted">{row.sector}</td>
                <td className="py-3">{row.momentum.toFixed(1)}%</td>
                <td className="py-3">{row.rsi}</td>
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
    </section>
  );
}
