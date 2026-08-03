/**
 * NGHC Design System — primitivos únicos de UI.
 * Toda página do Hub deve usar estes componentes em vez de estilos ad-hoc.
 * Apenas apresentação: nenhum componente aqui contém regra de negócio.
 */
import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Card ───────────────────────────────────────────────────────────── */
type CardVariant = "default" | "interactive" | "highlighted";

export function Card({
  variant = "default",
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { variant?: CardVariant }) {
  return (
    <div
      className={cn(
        "ds-card",
        variant === "interactive" && "ds-card-interactive",
        variant === "highlighted" && "ds-card-highlighted",
        className,
      )}
      {...props}
    />
  );
}

/* ── StatCard ───────────────────────────────────────────────────────── */
export function StatCard({
  label,
  value,
  hint,
  accent = true,
  icon: Icon,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  accent?: boolean;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div className={cn("ds-card ds-card-hover", className)}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-3.5 w-3.5 text-[var(--accent-soft)]" />}
        <span className="ds-label truncate">{label}</span>
      </div>
      <div
        className={cn(
          "mt-3 truncate text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl",
          accent ? "text-[var(--accent-soft)]" : "text-[var(--text-1)]",
        )}
      >
        {value}
      </div>
      {hint && <div className="mt-1.5 truncate ds-small">{hint}</div>}
    </div>
  );
}

/* ── Button ─────────────────────────────────────────────────────────── */
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const BTN_VARIANT: Record<ButtonVariant, string> = {
  primary: "ds-btn-primary",
  secondary: "ds-btn-secondary",
  ghost: "ds-btn-ghost",
  danger: "ds-btn-danger",
};
const BTN_SIZE: Record<ButtonSize, string> = { sm: "ds-btn-sm", md: "", lg: "ds-btn-lg" };

export function buttonClass(
  variant: ButtonVariant = "secondary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn("ds-btn", BTN_VARIANT[variant], BTN_SIZE[size], className);
}

export function Button({
  variant = "secondary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

/* ── Badge ──────────────────────────────────────────────────────────── */
type BadgeVariant = "default" | "accent" | "success" | "warning" | "danger";
const BADGE: Record<BadgeVariant, string> = {
  default: "",
  accent: "ds-badge-accent",
  success: "ds-badge-success",
  warning: "ds-badge-warning",
  danger: "ds-badge-danger",
};

export function Badge({
  variant = "default",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return <span className={cn("ds-badge", BADGE[variant], className)} {...props} />;
}

/* ── Input ──────────────────────────────────────────────────────────── */
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("ds-input", className)} {...props} />;
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="ds-label">{label}</span>
      <div className="mt-2">{children}</div>
      {hint && <div className="mt-1.5 ds-small">{hint}</div>}
    </label>
  );
}

/* ── Skeleton ───────────────────────────────────────────────────────── */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("ds-skeleton h-4 w-full", className)} {...props} />;
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="ds-card">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-7 w-2/3" />
      {Array.from({ length: Math.max(0, lines - 1) }).map((_, i) => (
        <Skeleton key={i} className="mt-2.5 h-3 w-full" />
      ))}
    </div>
  );
}

/* ── EmptyState ─────────────────────────────────────────────────────── */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "ds-card flex flex-col items-center justify-center gap-3 py-12 text-center",
        className,
      )}
    >
      {Icon && (
        <span className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--border-1)] bg-white/[0.03] text-[var(--accent-soft)]">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <div className="ds-h3">{title}</div>
      {description && <p className="max-w-sm ds-body">{description}</p>}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

/* ── Modal ──────────────────────────────────────────────────────────── */
export function Modal({
  title,
  description,
  onClose,
  children,
  actions,
  className,
}: {
  title: string;
  description?: ReactNode;
  onClose?: () => void;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className="ds-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className={cn("ds-modal", className)}>
        <div className="border-b border-[var(--border-1)] px-5 py-4">
          <h2 className="ds-h3">{title}</h2>
          {description && <p className="mt-1 ds-body">{description}</p>}
        </div>
        {children && <div className="px-5 py-4">{children}</div>}
        {actions && (
          <div className="flex flex-wrap justify-end gap-2 border-t border-[var(--border-1)] px-5 py-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
