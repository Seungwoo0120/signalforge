import { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <section className="mb-5 rounded-md border border-borderSoft bg-panel/95 p-4 shadow-panel sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-textMuted">
            {eyebrow}
          </div>
          <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-textMuted sm:text-base">{description}</p>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}
