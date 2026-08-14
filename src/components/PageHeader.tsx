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
 * Cabeçalho padrão de página: LABEL → TÍTULO → DESCRIÇÃO.
 * Usado por todas as abas do Hub para manter a mesma hierarquia.
 */
export function PageHeader({ eyebrow, title, highlight, description, icon: Icon, actions }: Props) {
  return (
    <header className="fade-up relative pb-5 sm:pb-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <div className="ds-label">
              {Icon && <Icon className="h-3 w-3 text-[var(--primary)]" />}
              {eyebrow}
            </div>
          )}
          <h1 className="ds-h1 mt-2.5">
            {title}
            {highlight && (
              <>
                {" "}
                <span className="text-[var(--primary)]">{highlight}</span>
              </>
            )}
          </h1>
          {description && <p className="ds-body mt-2.5 max-w-2xl">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      <div className="hairline absolute inset-x-0 bottom-0" aria-hidden />
    </header>
  );
}
