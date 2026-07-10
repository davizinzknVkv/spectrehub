import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQuestStore } from "@/lib/quest-store";
import {
  LayoutDashboard,
  Target,
  History,
  KeyRound,
  LifeBuoy,
  LogOut,
  Menu,
  X,
  Copy,
} from "lucide-react";

const DISCORD_INVITE = "https://discord.gg/neighborshub";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const NAV_GROUPS = [
  {
    title: "Visão geral",
    items: [{ to: "/hub", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Ferramentas",
    items: [
      { to: "/hub", label: "Missões", icon: Target, hash: "missoes" },
      { to: "/history", label: "Histórico", icon: History },
      { to: "/settings", label: "Login", icon: KeyRound },
    ],
  },
  {
    title: "Utilitários",
    items: [
      { action: "clone", label: "Clonar Servidores", icon: Copy },
    ],
  },
] as const;

function AppLayout() {
  const hydrate = useQuestStore((s) => s.hydrate);
  const creds = useQuestStore((s) => s.creds);
  const setCreds = useQuestStore((s) => s.setCreds);
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 grid-bg opacity-25" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 40% at 20% 0%, color-mix(in oklab, var(--purple) 18%, transparent), transparent 70%), radial-gradient(50% 40% at 100% 100%, color-mix(in oklab, var(--cyan) 15%, transparent), transparent 70%)",
        }}
      />

      <div className="mx-auto grid min-h-screen w-full max-w-[1500px] grid-cols-1 lg:grid-cols-[240px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden border-r border-line/60 bg-surface/50 backdrop-blur lg:sticky lg:top-0 lg:block lg:h-screen">
          <SidebarBody pathname={pathname} creds={creds} setCreds={setCreds} />
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <aside
              className="fixed inset-y-0 left-0 z-50 w-[260px] border-r border-purple/30 bg-surface/95 backdrop-blur lg:hidden"
              style={{ boxShadow: "0 0 40px -8px color-mix(in oklab, var(--purple) 40%, transparent)" }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-line/60">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-mute">menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Fechar menu"
                  className="rounded-md border border-line p-1.5 text-ink-dim hover:border-cyan/50 hover:text-cyan"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <SidebarBody pathname={pathname} creds={creds} setCreds={setCreds} />
            </aside>
          </>
        )}

        {/* Main */}
        <main className="min-w-0">
          <TopBar onOpenMenu={() => setMobileOpen(true)} />
          <div className="px-4 pb-10 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pb-8 lg:pt-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarBody({
  pathname,
  creds,
  setCreds,
}: {
  pathname: string;
  creds: unknown;
  setCreds: (c: null) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-2.5 px-5 py-5">
        <div
          className="grid h-9 w-9 place-items-center rounded-lg border border-cyan/50 bg-gradient-to-br from-cyan/15 to-purple/20 font-mono text-sm font-bold text-cyan"
          style={{ boxShadow: "0 0 18px -4px color-mix(in oklab, var(--purple) 55%, transparent)" }}
        >
          N
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold tracking-tight text-ink">
            Neighbors<span className="text-cyan">hub</span>
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-purple">neon · v2</div>
        </div>
      </Link>

      <nav className="flex flex-col gap-5 px-3 pb-3 lg:flex-1">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <div className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-ink-mute">
              {group.title}
            </div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = pathname === item.to && !("hash" in item && item.hash);
                const Icon = item.icon;
                return (
                  <Link
                    key={`${item.to}-${item.label}`}
                    to={item.to}
                    hash={"hash" in item ? item.hash : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                      active
                        ? "bg-gradient-to-r from-cyan/10 to-purple/10 text-ink border border-purple/30"
                        : "text-ink-dim hover:bg-surface hover:text-ink border border-transparent"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? "text-cyan" : "text-purple/70"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto space-y-1 border-t border-line/60 p-3">
        <a
          href="https://discord.gg/lovable-dev"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-dim hover:bg-surface hover:text-ink"
        >
          <LifeBuoy className="h-4 w-4 text-purple/70" />
          Suporte Discord
        </a>
        <button
          onClick={() => creds && setCreds(null)}
          disabled={!creds}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-dim hover:bg-surface hover:text-ink disabled:opacity-40"
        >
          <LogOut className="h-4 w-4 text-purple/70" />
          Sair da conta
        </button>
      </div>
    </div>
  );
}

function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const creds = useQuestStore((s) => s.creds);
  const setCreds = useQuestStore((s) => s.setCreds);
  return (
    <div className="sticky top-0 z-10 border-b border-line/60 bg-background/80 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMenu}
            aria-label="Abrir menu"
            className="grid h-9 w-9 place-items-center rounded-md border border-line text-ink-dim hover:border-cyan/50 hover:text-cyan lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div
              className="grid h-8 w-8 place-items-center rounded-lg border border-cyan/50 bg-gradient-to-br from-cyan/15 to-purple/20 font-mono text-xs font-bold text-cyan"
              style={{ boxShadow: "0 0 14px -4px color-mix(in oklab, var(--purple) 55%, transparent)" }}
            >
              N
            </div>
            <span className="text-sm font-semibold tracking-tight text-ink">
              Neighbors<span className="text-cyan">hub</span>
            </span>
          </Link>
          <div className="hidden lg:block" />
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[11px] uppercase tracking-widest text-ink-mute sm:inline">
            {creds ? "conectado" : "desconectado"}
          </span>
          <span
            className={`h-2 w-2 rounded-full ${creds ? "bg-mint pulse-dot" : "bg-amber"}`}
          />
          {creds && (
            <button
              onClick={() => setCreds(null)}
              className="rounded-md border border-line px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-dim hover:text-rose lg:hidden"
              aria-label="Sair"
            >
              sair
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
