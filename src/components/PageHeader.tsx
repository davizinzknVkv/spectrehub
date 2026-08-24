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
    <header className="relative pb-16 mb-12">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          {eyebrow && (
            <div className="flex items-center gap-4 mb-6">
              <div className="w-1.5 h-1.5 bg-primary shadow-[0_0_8px_#4DA09E]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-white/30">{eyebrow}</span>
            </div>
          )}
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-white uppercase tracking-tighter leading-[0.85]">
            {title}
            {highlight && (
              <span className="text-primary italic block sm:inline"> {highlight}</span>
            )}
          </h1>
          {description && (
            <div className="mt-8 flex gap-6 items-start border-l border-white/5 pl-8">
              {Icon && <Icon className="h-4 w-4 text-white/10 shrink-0 mt-1" />}
              <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.2em] leading-relaxed max-w-xl">
                {description}
              </p>
            </div>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
