"use client";

import {
  BarChart3,
  BookOpenText,
  CandlestickChart,
  LayoutDashboard,
  Search,
  SlidersHorizontal
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { benchmarkOptions } from "@/data/mock-data";
import { cn } from "@/lib/utils";
import { useStrategy } from "@/providers/strategy-provider";
import type { Benchmark } from "@/types/strategy";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, title: "Strategy research workspace" },
  {
    label: "Strategy Builder",
    href: "/strategy-builder",
    icon: SlidersHorizontal,
    title: "Configure strategy rules"
  },
  { label: "Backtest", href: "/backtest", icon: BarChart3, title: "Mock backtest results" },
  { label: "Screener", href: "/screener", icon: Search, title: "Filtered stock universe" },
  {
    label: "Research Notes",
    href: "/research-notes",
    icon: BookOpenText,
    title: "Strategy interpretation notes"
  }
];

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { strategy, updateStrategy } = useStrategy();
  const activeItem = navItems.find((item) => item.href === pathname) ?? navItems[0];

  return (
    <div className="min-h-screen bg-canvas text-textPrimary">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-borderSoft bg-panel/95 px-5 py-6 shadow-panel backdrop-blur xl:block">
        <Link className="flex items-center gap-3" href="/">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-white">
            <CandlestickChart size={21} />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight">SignalForge</div>
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-textMuted">
              Quant Research
            </div>
          </div>
        </Link>

        <nav className="mt-10 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === pathname;
            return (
              <Link
                key={item.label}
                className={cn(
                  "flex items-center gap-3 rounded-md border px-3 py-2.5 text-sm font-medium text-textMuted transition",
                  active && "border-accent/30 bg-accentSoft text-accent shadow-sm",
                  !active && "border-transparent hover:border-borderSoft hover:bg-panelMuted hover:text-textPrimary"
                )}
                href={item.href}
              >
                <Icon size={18} />
                {item.label}
              </Link>
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
        <header className="sticky top-0 z-10 border-b border-borderSoft bg-canvas/90 backdrop-blur">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 xl:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-white">
                <CandlestickChart size={19} />
              </div>
              <div className="font-semibold tracking-tight">SignalForge</div>
            </div>
            <div className="hidden xl:block">
              <div className="text-sm font-medium text-textMuted">{activeItem.label}</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">{activeItem.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <label className="hidden items-center gap-2 rounded-md border border-borderSoft bg-panel px-3 py-2 text-sm text-textMuted shadow-sm sm:flex">
                Benchmark
                <select
                  className="bg-transparent text-sm font-semibold text-textPrimary outline-none"
                  value={strategy.benchmark}
                  onChange={(event) =>
                    updateStrategy({ benchmark: event.target.value as Benchmark })
                  }
                >
                  {benchmarkOptions.map((benchmark) => (
                    <option key={benchmark} value={benchmark}>
                      {benchmark}
                    </option>
                  ))}
                </select>
              </label>
              <ThemeToggle />
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-borderSoft px-4 py-2 xl:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.href === pathname;
              return (
                <Link
                  key={item.label}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-md border border-transparent px-3 py-2 text-sm font-medium text-textMuted",
                    active && "border-accent/30 bg-accentSoft text-accent"
                  )}
                  href={item.href}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
