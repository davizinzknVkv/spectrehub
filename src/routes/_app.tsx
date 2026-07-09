import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuestStore } from "@/lib/quest-store";
import {
  LayoutDashboard,
  Target,
  History,
  KeyRound,
  LifeBuoy,
  LogOut,
} from "lucide-react";

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
      { to: "/settings", label: "Token", icon: KeyRound },
    ],
  },
] as const;

function AppLayout() {
  const hydrate = useQuestStore((s) => s.hydrate);
  const creds = useQuestStore((s) => s.creds);
  const clearCreds = useQuestStore((s) => s.clearCreds);
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 grid-bg opacity-25" />

      <div className="mx-auto grid min-h-screen w-full max-w-[1500px] grid-cols-1 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="border-b border-line/60 bg-surface/50 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col">
            <Link to="/" className="flex items-center gap-2.5 px-5 py-5">
              <div className="grid h-9 w-9 place-items-center rounded-lg border border-cyan/40 bg-cyan/10 font-mono text-sm font-bold text-cyan">
                N
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold tracking-tight text-ink">
                  Neighbors<span className="text-cyan">hub</span>
                </div>
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
                              ? "bg-surface-2 text-ink"
                              : "text-ink-dim hover:bg-surface hover:text-ink"
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${active ? "text-cyan" : "text-ink-mute"}`} />
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
                <LifeBuoy className="h-4 w-4 text-ink-mute" />
                Suporte Discord
              </a>
              <button
                onClick={() => creds && clearCreds()}
                disabled={!creds}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-dim hover:bg-surface hover:text-ink disabled:opacity-40"
              >
                <LogOut className="h-4 w-4 text-ink-mute" />
                Sair da conta
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0">
          <TopBar />
          <div className="px-4 py-6 sm:px-8 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function TopBar() {
  const creds = useQuestStore((s) => s.creds);
  return (
    <div className="sticky top-0 z-10 border-b border-line/60 bg-background/70 backdrop-blur">
      <div className="flex items-center justify-end gap-3 px-4 py-3 sm:px-8">
        <span className="hidden font-mono text-[11px] uppercase tracking-widest text-ink-mute sm:inline">
          {creds ? "conectado" : "desconectado"}
        </span>
        <span
          className={`h-2 w-2 rounded-full ${creds ? "bg-mint pulse-dot" : "bg-amber"}`}
        />
      </div>
    </div>
  );
}
