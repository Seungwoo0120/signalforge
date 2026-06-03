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
    <section className="min-w-0 rounded-md border border-borderSoft bg-panel p-5 shadow-panel">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-borderSoft pb-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-textMuted">{subtitle}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
