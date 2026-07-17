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
              <div className="section-eyebrow inline-flex items-center gap-1.5">
                {Icon && <Icon className="h-3 w-3" />}
                {eyebrow}
              </div>
            )}
            {title && <h2 className="section-title mt-1">{title}</h2>}
            {description && <p className="section-sub mt-1">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
