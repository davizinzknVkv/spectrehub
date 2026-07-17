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
    <header className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-5 sm:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(167,139,250,0.35), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-[-40%] h-56 w-56 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(88,101,242,0.35), transparent 70%)",
        }}
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-[#a5b4fc]">
              {Icon && <Icon className="h-3 w-3" />}
              {eyebrow}
            </div>
          )}
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {title}
            {highlight && (
              <>
                {" "}
                <span className="bg-gradient-to-r from-[#a5b4fc] via-[#c4b5fd] to-[#f0abfc] bg-clip-text text-transparent">
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
