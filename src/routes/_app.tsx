import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

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
  Music,
  ImageIcon,
  Tractor,
  Gift,
  Crosshair,
} from "lucide-react";

const DISCORD_INVITE = "https://discord.gg/EMsfMZFyGS";

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
      { to: "/missoes", label: "Missões", icon: Target },
      { to: "/farms", label: "Farms", icon: Tractor },
      { to: "/history", label: "Histórico", icon: History },
      { to: "/resgatar", label: "Resgatar Orbs", icon: Gift },
      { to: "/settings", label: "Login", icon: KeyRound },
    ],
  },
  {
    title: "Utilitários",
    items: [
      { to: "/nicksgun", label: "Nicks-Gun", icon: Crosshair },
      { to: "/clone", label: "Clonar Discord", icon: Copy },
      { to: "/spotify", label: "Gerador Spotify", icon: Music },
      { to: "/fake", label: "Foto Fake", icon: ImageIcon },
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
    <div className="min-h-screen bg-[#0b0d12] text-slate-100 antialiased">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(1200px 600px at 15% -10%, rgba(88,101,242,0.18), transparent 60%), radial-gradient(900px 500px at 90% 10%, rgba(167,139,250,0.15), transparent 60%), radial-gradient(700px 500px at 50% 110%, rgba(88,101,242,0.12), transparent 60%)",
        }}
      />

      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[240px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden border-r border-[color:var(--glass-border)] glass-panel !rounded-none lg:sticky lg:top-0 lg:block lg:h-screen">
          <SidebarBody pathname={pathname} creds={creds} setCreds={setCreds} />
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-[#0b0d12]/70 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <aside
              className="fixed inset-y-0 left-0 z-50 w-[260px] glass-panel-strong !rounded-none lg:hidden"
            >

              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Fechar menu"
                  className="rounded-md border border-white/10 p-1.5 text-slate-400 hover:border-[#5865F2]/50 hover:text-[#a5b4fc]"
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
          className="grid h-9 w-9 place-items-center rounded-lg border border-[#5865F2]/50 bg-gradient-to-br from-[#5865F2]/15 to-[#a78bfa]/20 font-mono text-sm font-bold text-[#a5b4fc]"
          style={{ boxShadow: "0 0 18px -4px color-mix(in oklab, var(--purple) 55%, transparent)" }}
        >
          N
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold tracking-tight text-white">
            Neighbors<span className="text-[#a5b4fc]">hub</span>
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#a78bfa]">neon</div>
        </div>
      </Link>

      <nav className="flex flex-col gap-5 px-3 pb-3 lg:flex-1">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <div className="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
              {group.title}
            </div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.to;
                return (
                  <Link
                    key={`${item.to}-${item.label}`}
                    to={item.to}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                      active
                        ? "bg-gradient-to-r from-[#5865F2]/10 to-[#a78bfa]/10 text-white border border-[#a78bfa]/30"
                        : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? "text-[#a5b4fc]" : "text-[#a78bfa]/70"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

          </div>
        ))}
      </nav>

      <div className="mt-auto space-y-1 border-t border-white/10 p-3">
        <a
          href={DISCORD_INVITE}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <LifeBuoy className="h-4 w-4 text-[#a78bfa]/70" />
          Suporte Discord
        </a>
        <button
          onClick={() => creds && setCreds(null)}
          disabled={!creds}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-40"
        >
          <LogOut className="h-4 w-4 text-[#a78bfa]/70" />
          Sair da conta
        </button>
      </div>
    </div>
  );
}

function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const creds = useQuestStore((s) => s.creds);
  const setCreds = useQuestStore((s) => s.setCreds);
  const [me, setMe] = useState<{ id?: string; username?: string; global_name?: string; avatar?: string | null } | null>(null);

  useEffect(() => {
    if (!creds) { setMe(null); return; }
    let cancelled = false;
    import("@/lib/quest-runner").then(({ fetchUserInfo }) =>
      fetchUserInfo().then((u) => {
        if (!cancelled && u) setMe(u as typeof me);
      }).catch(() => {}),
    );
    return () => { cancelled = true; };
  }, [creds]);

  const avatarUrl = me?.id
    ? me.avatar
      ? `https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png?size=64`
      : `https://cdn.discordapp.com/embed/avatars/${(BigInt(me.id) >> 22n) % 6n}.png`
    : null;

  return (
    <div
      className="sticky top-0 z-10 border-b border-[color:var(--glass-border)]"
      style={{
        background: "var(--glass-bg-strong)",
        backdropFilter: "blur(var(--glass-blur)) saturate(150%)",
      }}
    >

      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMenu}
            aria-label="Abrir menu"
            className="grid h-9 w-9 place-items-center rounded-md border border-white/10 text-slate-400 hover:border-[#5865F2]/50 hover:text-[#a5b4fc] lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div
              className="grid h-8 w-8 place-items-center rounded-lg border border-[#5865F2]/50 bg-gradient-to-br from-[#5865F2]/15 to-[#a78bfa]/20 font-mono text-xs font-bold text-[#a5b4fc]"
              style={{ boxShadow: "0 0 14px -4px color-mix(in oklab, var(--purple) 55%, transparent)" }}
            >
              N
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">
              Neighbors<span className="text-[#a5b4fc]">hub</span>
            </span>
          </Link>
          <div className="hidden lg:block" />
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`h-2 w-2 rounded-full ${creds ? "bg-emerald-500 pulse-dot" : "bg-amber-500"}`}
            title={creds ? "conectado" : "desconectado"}
          />
          {creds && me ? (
            <Link
              to="/hub"
              className="flex items-center gap-2.5 rounded-full border border-[#5865F2]/40 bg-gradient-to-r from-[#5865F2]/10 to-[#a78bfa]/10 py-1 pl-1 pr-3 transition hover:border-[#5865F2]/70"
              style={{ boxShadow: "0 0 14px -6px color-mix(in oklab, var(--cyan) 60%, transparent)" }}
            >
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full border border-surface object-cover"
                />
              )}
              <div className="hidden min-w-0 flex-col leading-tight sm:flex">
                <span className="truncate text-xs font-semibold text-white">
                  {me.global_name || me.username}
                </span>
                <span className="truncate font-mono text-[10px] text-slate-500">
                  @{me.username}
                </span>
              </div>
            </Link>
          ) : (
            <span className="hidden font-mono text-[11px] uppercase tracking-widest text-slate-500 sm:inline">
              {creds ? "conectado" : "desconectado"}
            </span>
          )}
          {creds && (
            <button
              onClick={() => setCreds(null)}
              className="rounded-md border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-slate-400 hover:text-rose-400 lg:hidden"
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
