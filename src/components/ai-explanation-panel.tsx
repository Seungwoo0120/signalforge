import { BrainCircuit } from "lucide-react";

import type { ResearchNotes } from "@/types/research";

export function AiExplanationPanel({ notes }: { notes?: ResearchNotes }) {
  return (
    <section className="rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-panelMuted text-textMuted">
          <BrainCircuit size={20} />
        </div>
        <div>
          <h2 className="text-base font-semibold tracking-tight">Explanation Placeholder</h2>
          <p className="mt-1 text-sm leading-6 text-textMuted">
            AI-assisted explanations will later summarize rule logic, assumptions, and risk
            tradeoffs. No model call is wired in this version.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-md border border-dashed border-borderSoft bg-panelMuted p-4">
        <div className="text-sm font-semibold">Draft explanation preview</div>
        <p className="mt-2 text-sm leading-6 text-textMuted">
          {notes?.strategySummary ??
            "This mock strategy favors stocks with confirmed long-term uptrends, positive short-term momentum, acceptable RSI levels, and above-average volume. The backtest preview should be read as interface sample data, not as a forecast or investment recommendation."}
        </p>
        {notes ? <p className="mt-3 text-xs leading-5 text-textMuted">{notes.disclaimer}</p> : null}
      </div>
    </section>
  );
}
