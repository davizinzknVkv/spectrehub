import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Modal } from "@/components/ui/ds";


import { useQuestStore } from "@/lib/quest-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  UserRound,
} from "lucide-react";
import logoAsset from "@/assets/spectre-hub-logo.png.asset.json";

const DISCORD_INVITE = "https://discord.gg/EMsfMZFyGS";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const NAV_GROUPS = [
  {
    title: "Visão geral",
    items: [{ to: "/hub", label: "Dashboard", icon: LayoutDashboard, soon: false }],
  },
  {
    title: "Ferramentas",
    items: [
      { to: "/missoes", label: "Missões", icon: Target, soon: false },
      { to: "/farms", label: "Farms", icon: Tractor, soon: false },
      { to: "/history", label: "Histórico", icon: History, soon: false },
      { to: "/resgatar", label: "Resgatar Orbs", icon: Gift, soon: false },
    ],
  },
  {
    title: "Utilitários",
    items: [
      { to: "/nicksgun", label: "Nicks-Gun", icon: Crosshair, soon: true },
      { to: "/clone", label: "Clonar Discord", icon: Copy, soon: true },
      { to: "/spotify", label: "Gerador Spotify", icon: Music, soon: true },
      { to: "/fake", label: "Foto Fake", icon: ImageIcon, soon: false },
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
    <div className="min-h-screen text-slate-100 antialiased">
      <div className="app-shell-bg" aria-hidden />

      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[236px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden border-r border-white/5 bg-[#050505] lg:sticky lg:top-0 lg:block lg:h-screen">
          <SidebarBody pathname={pathname} creds={creds} setCreds={setCreds} />
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <aside className="fixed inset-y-0 left-0 z-50 w-[264px] border-r border-white/[0.08] bg-[#070707]/95 backdrop-blur-xl lg:hidden">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-600">menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Fechar menu"
                  className="rounded-md border border-white/[0.08] p-1.5 text-slate-400 transition hover:border-white/20 hover:text-white"
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
          <TopBar onOpenMenu={() => setMobileOpen(true)} pathname={pathname} />
          <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-6 sm:px-6 sm:pt-8 lg:px-10 lg:pb-16 lg:pt-10">
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
  const logoUrl = logoAsset.url;
  return (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-3 px-5 pb-5 pt-6">
        <div className="grid h-9 w-9 place-items-center rounded-[0.6rem] border border-white/10 bg-white/[0.04] p-1.5 shadow-inner">
          <img src={logoUrl} alt="" className="h-full w-full object-contain" />
        </div>
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[0.9rem] font-bold tracking-[-0.03em] uppercase text-white font-display">
            Spectre Hub
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-600">elite console</div>
        </div>
      </Link>

      <div className="hairline mx-5" aria-hidden />

      <nav className="flex flex-col gap-5 px-3 py-5 lg:flex-1">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <div className="ds-label px-3 pb-2">{group.title}</div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.to;
                return (
                  <Link
                    key={`${item.to}-${item.label}`}
                    to={item.to}
                    data-active={active}
                    className="nav-item group"
                  >
                    <Icon
                      className={`h-[15px] w-[15px] shrink-0 transition ${
                        active ? "text-[#a5b4fc]" : "text-slate-600 group-hover:text-[#a5b4fc]"
                      }`}
                    />
                    <span className={active ? "font-medium tracking-[-0.01em]" : "tracking-[-0.01em]"}>
                      {item.label}
                    </span>
                    {item.soon && (
                      <span className="ds-badge ml-auto shrink-0">em breve</span>
                    )}
                  </Link>

                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/[0.06] p-3">
        <a href={DISCORD_INVITE} target="_blank" rel="noreferrer" className="nav-item">
          <LifeBuoy className="h-[15px] w-[15px] shrink-0 text-slate-600" />
          Suporte Discord
        </a>
      </div>
    </div>
  );
}

function TopBar({ onOpenMenu, pathname }: { onOpenMenu: () => void; pathname: string }) {
  const allItems = NAV_GROUPS.flatMap((g) => g.items as readonly { to: string; label: string }[]);
  const currentLabel = allItems.find((i) => i.to === pathname)?.label;


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

  const logoUrl = logoAsset.url;

  const avatarUrl = me?.id
    ? me.avatar
      ? `https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png?size=64`
      : `https://cdn.discordapp.com/embed/avatars/${(BigInt(me.id) >> 22n) % 6n}.png`
    : null;

  const [scrolled, setScrolled] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="sticky top-0 z-20 transition-[background-color,backdrop-filter,border-color] duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(5,5,5,0.72)" : "rgba(5,5,5,0.40)",
        backdropFilter: `blur(${scrolled ? 22 : 12}px) saturate(120%)`,
        borderBottom: `1px solid rgba(255,255,255,${scrolled ? 0.06 : 0.025})`,
      }}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMenu}
            aria-label="Abrir menu"
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.08] text-slate-400 transition hover:border-white/20 hover:text-white lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] p-1">
              <img src={logoUrl} alt="" className="h-full w-full object-contain" />
            </div>
            <span className="text-sm font-bold tracking-[-0.03em] uppercase text-white font-display">Spectre Hub</span>
          </Link>
          <div className="hidden lg:block" />
        </div>

        {currentLabel && (
          <div className="hidden flex-1 justify-center md:flex">
            <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-slate-500">
              {currentLabel}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <span
            className={`h-1.5 w-1.5 rounded-full ${creds ? "bg-emerald-400 pulse-dot" : "bg-amber-400"}`}
            title={creds ? "conectado" : "desconectado"}
          />
          {creds && me ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="group flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.02] py-1 pl-1 pr-3 transition hover:border-white/20 hover:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#818cf8]/40"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full object-cover ring-1 ring-white/10 transition group-hover:ring-[#a78bfa]/50"
                  />
                ) : (
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-white/5 text-slate-400">
                    <UserRound className="h-3.5 w-3.5" />
                  </div>
                )}
                <div className="hidden min-w-0 flex-col leading-tight sm:flex">
                  <span className="truncate text-xs font-semibold text-white">
                    {me.global_name || me.username}
                  </span>
                  <span className="truncate font-mono text-[10px] text-slate-500">
                    @{me.username}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-56 rounded-[12px] border-white/[0.08] bg-[#0c0c0c]/95 text-[#a1a1aa] backdrop-blur-xl"
              >
                <DropdownMenuLabel className="flex items-center gap-2 py-2">
                  {avatarUrl && (
                    <img src={avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                  )}
                  <div className="min-w-0 leading-tight">
                    <div className="truncate text-sm font-semibold text-white">
                      {me.global_name || me.username}
                    </div>
                    <div className="truncate font-mono text-[10px] text-slate-500">
                      @{me.username}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer focus:bg-white/5 focus:text-white"
                >
                  <Link to="/hub" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4 text-[#c4b5fd]" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer focus:bg-white/5 focus:text-white"
                >
                  <Link to="/settings" className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-[#c4b5fd]" />
                    Login / Token
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={() => setConfirmLogout(true)}
                  className="cursor-pointer text-rose-300 focus:bg-rose-500/10 focus:text-rose-200"
                >
                  <LogOut className="h-4 w-4" />
                  Sair da conta
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span className="hidden font-mono text-[11px] uppercase tracking-widest text-slate-500 sm:inline">
              desconectado
            </span>
          )}


        </div>
      </div>

      {confirmLogout && (
        <Modal
          title="Sair da conta"
          description="Seu token será removido deste navegador. Você poderá entrar novamente quando quiser."
          onClose={() => setConfirmLogout(false)}
          actions={
            <>
              <Button variant="ghost" onClick={() => setConfirmLogout(false)}>
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setConfirmLogout(false);
                  setCreds(null);
                  toast.success("Sessão encerrada");
                }}
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </>
          }
        >
          <div className="flex items-center gap-3">
            {avatarUrl && (
              <img src={avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10" />
            )}
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-semibold text-white">
                {me?.global_name || me?.username}
              </div>
              <div className="truncate font-mono text-[11px] text-slate-500">@{me?.username}</div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );

}
