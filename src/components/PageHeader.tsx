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

/**
 * NGHC Design System - PageHeader
 * Unified header for all Hub modules.
 */
export function PageHeader({ eyebrow, title, highlight, description, icon: Icon, actions }: Props) {
  return (
    <header className="relative pb-10 mb-8 border-b border-white/5">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <div className="flex items-center gap-2 mb-3">
              {Icon && <Icon className="h-3 w-3 text-primary" />}
              <span className="font-display text-[9px] uppercase tracking-[0.3em] text-white/30 italic">{eyebrow}</span>
            </div>
          )}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white uppercase italic tracking-tighter leading-none">
            {title}
            {highlight && (
              <span className="text-primary"> {highlight}</span>
            )}
          </h1>
          {description && (
            <p className="mt-4 font-sans text-sm text-white/40 italic leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-3 pb-1">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
