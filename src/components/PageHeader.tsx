import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: ReactNode;
  icon?: LucideIcon;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, highlight, description, icon: Icon, actions }: Props) {
  return (
    <header className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6">

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[#c4b5fd]">
              {Icon && <Icon className="h-3 w-3" />}
              {eyebrow}
            </div>
          )}
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {title}
            {highlight && (
              <>
                {" "}
                <span className="bg-gradient-to-r from-[#c4b5fd] via-[#c4b5fd] to-[#f0abfc] bg-clip-text text-transparent">
                  {highlight}
                </span>
              </>
            )}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
