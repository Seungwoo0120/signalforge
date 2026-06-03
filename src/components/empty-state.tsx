import type { ReactNode } from "react";

export function EmptyState({
  action,
  description,
  title
}: {
  action?: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <div className="rounded-md border border-dashed border-borderSoft bg-panelMuted p-5 text-center">
      <div className="text-sm font-semibold">{title}</div>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-textMuted">{description}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
