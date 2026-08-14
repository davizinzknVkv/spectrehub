/**
 * NGHC Design System - Primitives
 * Industrial, tactical, obsidian.
 */
import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Card ───────────────────────────────────────────────────────────── */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("ds-card border-white/5 bg-white/[0.02]", className)}
      {...props}
    />
  );
}

/* ── StatCard ───────────────────────────────────────────────────────── */
export function StatCard({
  label,
  value,
  accent = true,
  icon: Icon,
  className,
}: {
  label: string;
  value: ReactNode;
  accent?: boolean;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div className={cn("ds-card p-6 border-white/5 bg-white/[0.02] space-y-2", className)}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className={cn("h-3.5 w-3.5", accent ? "text-spectre-pink" : "text-white/20")} />}
        <span className="font-display text-[9px] uppercase tracking-widest text-white/30 italic">{label}</span>
      </div>
      <div className={cn("font-display text-2xl italic tracking-tighter", accent ? "text-white" : "text-white/60")}>
        {value}
      </div>
    </div>
  );
}

/* ── Button ─────────────────────────────────────────────────────────── */
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export function buttonClass(variant: ButtonVariant = "secondary", size: ButtonSize = "md", className?: string) {
  return cn("ds-btn", variant === "primary" ? "ds-btn-primary" : "ds-btn-secondary", size === "sm" && "!py-2 !px-4 !text-[8px]", size === "lg" && "ds-btn-lg", className);
}

export function Button({
  variant = "secondary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <button 
      className={buttonClass(variant, size, className)} 
      {...props} 
    />
  );
}

/* ── Badge ──────────────────────────────────────────────────────────── */
export function Badge({ children, className, variant }: { children: ReactNode; className?: string; variant?: string }) {
  return (
    <span className={cn("bg-spectre-pink/10 text-spectre-pink font-display text-[8px] uppercase tracking-widest px-2 py-0.5 italic border border-spectre-pink/20", className)}>
      {children}
    </span>
  );
}

/* ── Input ──────────────────────────────────────────────────────────── */
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("w-full bg-white/[0.02] border border-white/5 py-3 px-4 font-display text-[10px] text-white italic uppercase tracking-widest outline-none focus:border-spectre-pink/20 transition-all", className)} {...props} />;
}

export function Field({ label, children, className, hint }: { label: string; children: ReactNode; className?: string; hint?: ReactNode }) {
  return (
    <div className={className}>
      <label className="font-display text-[9px] uppercase tracking-widest text-white/30 italic block mb-2">{label}</label>
      {children}
      {hint && <div className="mt-1 font-sans text-[10px] text-white/20 italic">{hint}</div>}
    </div>
  );
}

/* ── Skeleton ───────────────────────────────────────────────────────── */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse bg-white/5", className)} {...props} />;
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
    <div className={cn("ds-card p-12 text-center border-dashed border-white/5 bg-white/[0.01] space-y-6", className)}>
      {Icon && (
        <div className="w-16 h-16 mx-auto flex items-center justify-center border border-white/10 bg-white/[0.02]">
           <Icon className="w-8 h-8 text-white/20" />
        </div>
      )}
      <div className="space-y-2">
         <h3 className="font-display text-xl text-white uppercase italic tracking-widest">{title}</h3>
         {description && <p className="font-sans text-sm text-white/30 italic max-w-sm mx-auto">{description}</p>}
      </div>
      {action && <div>{action}</div>}
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
    <div className="ds-backdrop flex items-center justify-center p-4 z-[999]" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={cn("ds-card !p-0 w-full max-w-xl border-white/10 bg-obsidian overflow-hidden", className)}>
        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <div className="min-w-0">
             <h2 className="font-display text-sm uppercase tracking-widest text-white italic truncate">{title}</h2>
             {description && <p className="font-sans text-[10px] text-white/30 italic mt-1 truncate">{description}</p>}
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors text-xl">×</button>
        </div>
        <div className="px-8 py-8">{children}</div>
        {actions && (
          <div className="px-8 py-6 border-t border-white/5 bg-white/[0.01]">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
