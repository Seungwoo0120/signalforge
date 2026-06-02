import {
  BarChart3,
  BookOpenText,
  CandlestickChart,
  LayoutDashboard,
  Search,
  SlidersHorizontal
} from "lucide-react";
import { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Strategy Builder", icon: SlidersHorizontal },
  { label: "Backtest", icon: BarChart3 },
  { label: "Screener", icon: Search },
  { label: "Research Notes", icon: BookOpenText }
];

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas text-textPrimary">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-borderSoft bg-panel/90 px-5 py-6 backdrop-blur xl:block">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-white">
            <CandlestickChart size={21} />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight">SignalForge</div>
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-textMuted">
              Quant Research
            </div>
          </div>
        </div>

        <nav className="mt-10 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-textMuted transition",
                  item.active && "bg-accentSoft text-accent",
                  !item.active && "hover:bg-panelMuted hover:text-textPrimary"
                )}
                href="#"
              >
                <Icon size={18} />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-5 right-5 rounded-md border border-borderSoft bg-panelMuted p-4">
          <div className="text-sm font-semibold">Data mode</div>
          <p className="mt-2 text-sm leading-6 text-textMuted">
            Mock strategy and backtest data only. Market APIs, auth, and AI calls are intentionally
            out of scope for this foundation.
          </p>
        </div>
      </aside>

      <div className="xl:pl-72">
        <header className="sticky top-0 z-10 border-b border-borderSoft bg-canvas/85 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 xl:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-white">
                <CandlestickChart size={19} />
              </div>
              <div className="font-semibold tracking-tight">SignalForge</div>
            </div>
            <div className="hidden xl:block">
              <div className="text-sm font-medium text-textMuted">Dashboard</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                Strategy research workspace
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden rounded-md border border-borderSoft bg-panel px-3 py-2 text-sm text-textMuted sm:block">
                Benchmark: <span className="font-semibold text-textPrimary">SPY</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-borderSoft px-4 py-2 xl:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-textMuted",
                    item.active && "bg-accentSoft text-accent"
                  )}
                  href="#"
                >
                  <Icon size={16} />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
