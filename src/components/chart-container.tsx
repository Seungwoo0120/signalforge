import { ReactNode } from "react";

export function ChartContainer({
  title,
  subtitle,
  children,
  action
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-textMuted">{subtitle}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
