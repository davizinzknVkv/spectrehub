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
    <header className="fade-up relative pb-5 sm:pb-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <div className="flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.32em] text-slate-500">
              {Icon && <Icon className="h-3 w-3 text-[#a5b4fc]" />}
              {eyebrow}
            </div>
          )}
          <h1 className="mt-2.5 text-[1.7rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.1rem]">
            {title}
            {highlight && (
              <>
                {" "}
                <span className="text-[#a5b4fc]">{highlight}</span>
              </>
            )}
          </h1>
          {description && (
            <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-400">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      <div className="hairline absolute inset-x-0 bottom-0" aria-hidden />
    </header>
  );
}
