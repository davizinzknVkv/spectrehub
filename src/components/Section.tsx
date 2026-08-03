import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title?: string;
  description?: ReactNode;
  icon?: LucideIcon;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Section({ eyebrow, title, description, icon: Icon, actions, children, className = "" }: Props) {
  return (
    <section className={`section-stack ${className}`}>
      {(eyebrow || title || actions) && (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
          <div className="min-w-0">
            {eyebrow && (
              <div className="flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-slate-500">
                {Icon && <Icon className="h-3 w-3 text-[#a5b4fc]" />}
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="mt-1.5 text-[1.05rem] font-semibold tracking-[-0.02em] text-white sm:text-[1.15rem]">
                {title}
              </h2>
            )}
            {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
