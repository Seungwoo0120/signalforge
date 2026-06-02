"use client";

import { BookmarkPlus, Trash2 } from "lucide-react";
import { useState } from "react";

import { useStrategyPresets } from "@/hooks/use-strategy-presets";
import { cn } from "@/lib/utils";
import type { StrategyPreset } from "@/types/strategy-preset";
import type { StrategyConfig } from "@/types/strategy";

export function StrategyPresetsPanel({
  currentStrategy,
  onLoadPreset
}: {
  currentStrategy: StrategyConfig;
  onLoadPreset: (strategy: StrategyConfig) => void;
}) {
  const { builtInPresets, deletePreset, savePreset, userPresets } = useStrategyPresets();
  const [presetName, setPresetName] = useState(currentStrategy.name);
  const [description, setDescription] = useState("Saved local strategy preset");

  function handleSavePreset() {
    const trimmedName = presetName.trim() || currentStrategy.name;
    savePreset({
      name: trimmedName,
      description: description.trim() || "Saved local strategy preset",
      strategyConfig: { ...currentStrategy, name: trimmedName }
    });
  }

  return (
    <section className="rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accentSoft text-accent">
          <BookmarkPlus size={20} />
        </div>
        <div>
          <h2 className="text-base font-semibold tracking-tight">Strategy Presets</h2>
          <p className="mt-1 text-sm leading-6 text-textMuted">
            Presets are saved locally in your browser for this prototype. Templates are educational and not financial advice.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1.2fr_auto]">
        <input
          className="h-11 rounded-md border border-borderSoft bg-panelMuted px-3 text-sm font-medium outline-none transition focus:border-accent"
          placeholder="Preset name"
          value={presetName}
          onChange={(event) => setPresetName(event.target.value)}
        />
        <input
          className="h-11 rounded-md border border-borderSoft bg-panelMuted px-3 text-sm font-medium outline-none transition focus:border-accent"
          placeholder="Optional description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <button
          className="inline-flex h-11 items-center justify-center rounded-md bg-accent px-4 text-sm font-semibold text-white transition hover:opacity-90"
          type="button"
          onClick={handleSavePreset}
        >
          Save current strategy
        </button>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <PresetGroup
          presets={builtInPresets}
          title="Built-in templates"
          onDelete={deletePreset}
          onLoadPreset={onLoadPreset}
        />
        <PresetGroup
          emptyText="No saved presets yet."
          presets={userPresets}
          title="Saved presets"
          onDelete={deletePreset}
          onLoadPreset={onLoadPreset}
        />
      </div>
    </section>
  );
}

function PresetGroup({
  emptyText,
  onDelete,
  onLoadPreset,
  presets,
  title
}: {
  emptyText?: string;
  onDelete: (id: string) => void;
  onLoadPreset: (strategy: StrategyConfig) => void;
  presets: StrategyPreset[];
  title: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-3 space-y-3">
        {presets.length === 0 ? (
          <div className="rounded-md border border-dashed border-borderSoft bg-panelMuted p-4 text-sm leading-6 text-textMuted">
            {emptyText}
          </div>
        ) : (
          presets.map((preset) => (
            <PresetCard key={preset.id} preset={preset} onDelete={onDelete} onLoadPreset={onLoadPreset} />
          ))
        )}
      </div>
    </div>
  );
}

function PresetCard({
  onDelete,
  onLoadPreset,
  preset
}: {
  onDelete: (id: string) => void;
  onLoadPreset: (strategy: StrategyConfig) => void;
  preset: StrategyPreset;
}) {
  return (
    <article className="rounded-md border border-borderSoft bg-panelMuted p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{preset.name}</div>
          <p className="mt-1 text-sm leading-6 text-textMuted">{preset.description}</p>
        </div>
        {!preset.builtIn ? (
          <button
            className="text-textMuted transition hover:text-danger"
            type="button"
            onClick={() => onDelete(preset.id)}
          >
            <Trash2 size={16} />
          </button>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {preset.tags.map((tag) => (
          <span key={tag} className="rounded-md border border-borderSoft bg-panel px-2.5 py-1 text-xs font-semibold text-textMuted">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        <Summary label="Universe" value={preset.strategyConfig.universe} />
        <Summary label="Portfolio" value={preset.strategyConfig.portfolioSize} />
        <Summary label="Rebalance" value={preset.strategyConfig.rebalance} />
      </div>
      <button
        className={cn(
          "mt-4 inline-flex rounded-md border border-borderSoft bg-panel px-3 py-2 text-sm font-semibold transition hover:border-accent hover:text-accent"
        )}
        type="button"
        onClick={() => onLoadPreset(preset.strategyConfig)}
      >
        Load preset
      </button>
    </article>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.14em] text-textMuted">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
