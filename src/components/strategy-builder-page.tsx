"use client";

import { Save, SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";

import { PageHeader } from "@/components/page-header";
import { StrategyConfigCard } from "@/components/strategy-config-card";
import {
  benchmarkOptions,
  portfolioSizeOptions,
  rebalanceOptions,
  transactionCostOptions,
  universeOptions,
  weightingOptions
} from "@/data/mock-data";
import { cn } from "@/lib/utils";
import { useStrategy } from "@/providers/strategy-provider";
import type {
  Benchmark,
  PortfolioSize,
  RebalanceFrequency,
  TransactionCost,
  Universe,
  Weighting
} from "@/types/strategy";

export function StrategyBuilderPage() {
  const { strategy, updateStrategy, updateRules } = useStrategy();

  return (
    <>
      <PageHeader
        eyebrow="Strategy Builder"
        title="Configure a transparent rule-based strategy."
        description="Adjust the mock configuration below. Changes are kept client-side and immediately update the dashboard, backtest, screener, and notes."
        actions={
          <span className="inline-flex items-center gap-2 rounded-md border border-borderSoft bg-panelMuted px-4 py-2.5 text-sm font-semibold text-textMuted">
            <Save size={17} />
            Autosaved locally
          </span>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accentSoft text-accent">
              <SlidersHorizontal size={20} />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight">Strategy configuration</h2>
              <p className="mt-1 text-sm text-textMuted">
                Mock inputs only. No live orders, market APIs, or predictions are connected.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <Field label="Strategy name">
              <input
                className="h-11 w-full rounded-md border border-borderSoft bg-panelMuted px-3 text-sm font-medium outline-none transition focus:border-accent"
                value={strategy.name}
                onChange={(event) => updateStrategy({ name: event.target.value })}
              />
            </Field>
            <OptionField label="Universe">
              {universeOptions.map((option) => (
                <OptionButton
                  key={option}
                  active={strategy.universe === option}
                  onClick={() => updateStrategy({ universe: option as Universe })}
                >
                  {option}
                </OptionButton>
              ))}
            </OptionField>
            <OptionField label="Benchmark">
              {benchmarkOptions.map((option) => (
                <OptionButton
                  key={option}
                  active={strategy.benchmark === option}
                  onClick={() => updateStrategy({ benchmark: option as Benchmark })}
                >
                  {option}
                </OptionButton>
              ))}
            </OptionField>
            <OptionField label="Portfolio size">
              {portfolioSizeOptions.map((option) => (
                <OptionButton
                  key={option}
                  active={strategy.portfolioSize === option}
                  onClick={() => updateStrategy({ portfolioSize: option as PortfolioSize })}
                >
                  {option}
                </OptionButton>
              ))}
            </OptionField>
            <OptionField label="Weighting">
              {weightingOptions.map((option) => (
                <OptionButton
                  key={option}
                  active={strategy.weighting === option}
                  onClick={() => updateStrategy({ weighting: option as Weighting })}
                >
                  {option}
                </OptionButton>
              ))}
            </OptionField>
            <OptionField label="Rebalance frequency">
              {rebalanceOptions.map((option) => (
                <OptionButton
                  key={option}
                  active={strategy.rebalance === option}
                  onClick={() => updateStrategy({ rebalance: option as RebalanceFrequency })}
                >
                  {option}
                </OptionButton>
              ))}
            </OptionField>
            <OptionField label="Transaction cost">
              {transactionCostOptions.map((option) => (
                <OptionButton
                  key={option}
                  active={strategy.transactionCost === option}
                  onClick={() => updateStrategy({ transactionCost: option as TransactionCost })}
                >
                  {option}
                </OptionButton>
              ))}
            </OptionField>
          </div>

          <div className="mt-8 border-t border-borderSoft pt-6">
            <h3 className="text-sm font-semibold">Signal rules</h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <ToggleRow
                checked={strategy.rules.priceAboveSma200}
                label="Price above 200-day moving average"
                onChange={(checked) => updateRules({ priceAboveSma200: checked })}
              />
              <ToggleRow
                checked={strategy.rules.volumeAboveAverage}
                label="Volume above 20-day average"
                onChange={(checked) => updateRules({ volumeAboveAverage: checked })}
              />
              <Field label={`20-day momentum threshold: ${strategy.rules.momentumThreshold}%`}>
                <input
                  className="w-full accent-accent"
                  max={20}
                  min={0}
                  step={1}
                  type="range"
                  value={strategy.rules.momentumThreshold}
                  onChange={(event) => updateRules({ momentumThreshold: Number(event.target.value) })}
                />
              </Field>
              <Field label={`RSI upper threshold: ${strategy.rules.rsiThreshold}`}>
                <input
                  className="w-full accent-accent"
                  max={85}
                  min={45}
                  step={1}
                  type="range"
                  value={strategy.rules.rsiThreshold}
                  onChange={(event) => updateRules({ rsiThreshold: Number(event.target.value) })}
                />
              </Field>
            </div>
          </div>
        </div>

        <StrategyConfigCard strategy={strategy} />
      </section>
    </>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function OptionField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-sm font-semibold">{label}</div>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function OptionButton({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "rounded-md border px-3 py-2 text-sm font-semibold transition",
        active
          ? "border-accent bg-accentSoft text-accent"
          : "border-borderSoft bg-panelMuted text-textMuted hover:border-accent hover:text-textPrimary"
      )}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ToggleRow({
  checked,
  label,
  onChange
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-16 items-center justify-between gap-4 rounded-md border border-borderSoft bg-panelMuted p-4">
      <span className="text-sm font-semibold">{label}</span>
      <input
        checked={checked}
        className="h-5 w-5 accent-accent"
        type="checkbox"
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}
