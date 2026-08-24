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
  Tractor,
  Gift,
  Crosshair,
  UserRound,
  Activity,
  Music,
} from "lucide-react";
import logoAsset from "@/assets/logo-spectre.png.asset.json";
import { AdminNavLink } from "@/components/AdminNavLink";


const DISCORD_INVITE = "https://discord.gg/vbYK559Jnb";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const NAV_GROUPS = [
  {
    title: "Visão geral",
    items: [{ to: "/hub", label: "Dashboard", icon: LayoutDashboard, soon: false }],
  },
  {
    title: "Produtos",
    items: [
      { to: "/resgatar", label: "Meus Produtos", icon: Gift, soon: false },
    ],
  },
  {
    title: "Ferramentas",
    items: [
      { to: "/missoes", label: "Missões", icon: Target, soon: false },
      { to: "/farms", label: "Farms Automáticas", icon: Tractor, soon: false },
      { to: "/nicksgun", label: "Nicks-Gun Sniper", icon: Crosshair, soon: false },
      { to: "/spotify", label: "Spotify Gen", icon: Music, soon: false },
      { to: "/clone", label: "Discord Tools", icon: Copy, soon: false },
    ],
  },
  {
    title: "Conta",
    items: [
      { to: "/settings", label: "Perfil & Segurança", icon: UserRound, soon: false },
      { to: "/history", label: "Histórico Global", icon: History, soon: false },
    ],
  },
  {
    title: "Suporte",
    items: [
      { to: "/", label: "Página Inicial", icon: Activity, soon: false },
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
    
    // Sincroniza plano com cargos do Discord ao montar o layout
    import("@/lib/quest-runner").then(({ fetchUserPlan }) => {
      fetchUserPlan().then((plan) => {
        if (plan) useQuestStore.getState().setPlan(plan);
      });
    });
  }, [hydrate]);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/30">
      {/* Background elements for Hub */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
              backgroundSize: '32px 32px'
            }}
          />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="relative z-10 grid min-h-screen w-full lg:grid-cols-[280px_1fr] overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden border-r border-white/5 bg-[#030303] lg:block lg:w-[280px]">
          <SidebarBody pathname={pathname} />
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/90 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <aside className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-white/5 bg-[#030303] lg:hidden">
              <div className="flex items-center justify-between border-b border-white/5 px-8 py-8">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">MENU_ROOT</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-white/20 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarBody pathname={pathname} />
            </aside>
          </>
        )}

        {/* Main Content Area */}
        <main className="min-w-0 flex flex-col w-full bg-[#030303]">
          <TopBar onOpenMenu={() => setMobileOpen(true)} pathname={pathname} />
          <div className="flex-1 w-full max-w-7xl mx-auto px-8 pb-24 pt-12 sm:px-12 lg:px-16">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarBody({
  pathname,
}: {
  pathname: string;
}) {
  const logoUrl = logoAsset.url;
  return (
    <div className="flex h-full flex-col lg:sticky lg:top-0 lg:h-screen">
      <Link to="/" className="flex items-center gap-4 px-10 pb-12 pt-12 group">
        <img
          src={logoUrl}
          alt="SPECTRE"
          className="h-10 w-10 object-contain shrink-0 transition-transform duration-700 grayscale group-hover:grayscale-0"
        />
        <span className="font-display text-xl tracking-tighter text-white uppercase group-hover:text-primary transition-colors">
          SPECTRE
        </span>
      </Link>

      <nav className="flex flex-col gap-10 px-6 py-4 lg:flex-1 overflow-y-auto custom-scrollbar">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="space-y-4">
            <div className="font-mono px-4 text-[8px] font-bold uppercase tracking-[0.5em] text-white/10">{group.title}</div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.to;
                return (
                  <Link
                    key={`${item.to}-${item.label}`}
                    to={item.to}
                    className={`flex items-center gap-4 px-4 py-3 transition-all duration-500 group relative ${
                      active 
                        ? "text-primary bg-primary/[0.03]" 
                        : "text-white/20 hover:text-white hover:bg-white/[0.01]"
                    }`}
                  >
                    {active && <div className="absolute left-0 top-0 bottom-0 w-px bg-primary shadow-[0_0_8px_#4DA09E]" />}
                    <Icon
                      className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                        active ? "text-primary" : "text-white/10 group-hover:text-primary/50"
                      }`}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                      {item.label}
                    </span>
                    {item.soon && (
                      <span className="ml-auto bg-primary/10 text-primary text-[7px] font-mono font-bold uppercase tracking-wider px-2 py-0.5">BETA</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/5 p-6 space-y-2">
        <AdminNavLink />
        <a 
          href={DISCORD_INVITE} 
          target="_blank" 
          rel="noreferrer" 
          className="flex items-center gap-4 px-4 py-3 text-white/10 hover:text-white transition-all group"
        >
          <LifeBuoy className="h-3.5 w-3.5 shrink-0 transition-colors group-hover:text-primary" />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em]">OPERATIONS_SUPPORT</span>
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
  const [me, setMe] = useState<{ id?: string; username?: string; global_name?: string; avatar?: string | null; banner?: string | null; banner_color?: string | null } | null>(null);

  useEffect(() => {
    if (!creds) { setMe(null); return; }
    let cancelled = false;
    import("@/lib/quest-runner").then(({ fetchUserInfo, fetchProfile }) => {
      fetchUserInfo().then((u) => {
        if (!cancelled && u) {
          fetchProfile(u.id as string).then((profile) => {
            if (!cancelled) {
              setMe({
                ...(u as any),
                banner: profile?.user?.banner,
                banner_color: profile?.user?.banner_color,
              });
            }
          });
        }
      }).catch(() => {});
    });
    return () => { cancelled = true; };
  }, [creds]);

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
      className={`sticky top-0 z-20 transition-all duration-700 border-b ${
        scrolled 
          ? "bg-[#030303]/95 border-white/5 py-6 px-8 sm:px-12" 
          : "bg-transparent border-transparent py-10 px-10 sm:px-16"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button
            onClick={onOpenMenu}
            className="p-3 border border-white/5 text-white/20 hover:text-white transition-colors lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          
          <div className="hidden lg:flex items-center gap-4">
            <div className="w-1 h-1 bg-primary" />
            <h1 className="font-mono text-[9px] font-bold tracking-[0.4em] text-white/20 uppercase">
              NETWORK_LOCAL <span className="text-white/5 mx-3">::</span> {currentLabel || 'STATUS_IDLE'}
            </h1>
          </div>

          <Link to="/" className="flex items-center gap-4 lg:hidden">
            <img src={logoAsset.url} alt="SPECTRE" className="h-8 w-8 object-contain grayscale" />
            <span className="font-display text-xs tracking-tighter uppercase text-white">SPECTRE</span>
          </Link>
        </div>

        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4 border-r border-white/5 pr-10">
            <div className={`w-1.5 h-1.5 ${creds ? 'bg-primary shadow-[0_0_8px_#4DA09E]' : 'bg-white/5'}`} />
            <span className="font-mono text-[8px] font-bold tracking-[0.4em] text-white/20 uppercase hidden sm:block">
              {creds ? 'LINK_ESTABLISHED' : 'LINK_OFFLINE'}
            </span>
          </div>

          {creds && me ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-4 p-1 border border-white/5 bg-black hover:border-primary/30 transition-all focus:outline-none pr-5">
                <div className="w-10 h-10 bg-[#030303] border border-white/5 overflow-hidden">
                   {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="w-full h-full object-cover grayscale" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10">
                      <UserRound className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="text-left hidden sm:block">
                   <div className="font-mono text-[9px] text-white uppercase tracking-[0.1em] leading-none mb-1">{me.global_name || me.username}</div>
                   <div className="font-mono text-[7px] text-primary uppercase tracking-[0.3em] font-bold">OPERATOR_AUTH</div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card border-border rounded-xl text-foreground-muted p-2">
                <DropdownMenuLabel className="font-sans text-[10px] font-bold uppercase tracking-wider text-foreground-muted/50 px-3 py-2">Gerenciar Conta</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border my-1" />
                <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-foreground cursor-pointer py-2 rounded-lg">
                  <Link to="/hub" className="flex items-center gap-3 font-sans text-sm font-medium">
                    <LayoutDashboard className="w-4 h-4 text-foreground-muted" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-foreground cursor-pointer py-2 rounded-lg">
                  <Link to="/settings" className="flex items-center gap-3 font-sans text-sm font-medium">
                    <KeyRound className="w-4 h-4 text-foreground-muted" /> Segurança
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border my-1" />
                <DropdownMenuItem onClick={() => setConfirmLogout(true)} className="focus:bg-rose-500/10 focus:text-rose-500 cursor-pointer py-2 rounded-lg">
                   <span className="flex items-center gap-3 font-sans text-sm font-medium">
                     <LogOut className="w-4 h-4" /> Encerrar Sessão
                   </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/settings" className="ds-btn ds-btn-primary !py-2 !px-5 !text-[11px] !min-height-0 h-9 rounded-full">
               Entrar
            </Link>
          )}
        </div>
      </div>

      {confirmLogout && (
        <Modal
          title="Encerrar Sessão"
          onClose={() => setConfirmLogout(false)}
          actions={
            <div className="flex gap-3 w-full">
              <button 
                className="ds-btn ds-btn-secondary flex-1" 
                onClick={() => setConfirmLogout(false)}
              >
                Cancelar
              </button>
              <button 
                className="ds-btn ds-btn-primary flex-1" 
                onClick={() => {
                  setCreds(null);
                  setConfirmLogout(false);
                  toast.success("Terminal desconectado");
                }}
              >
                Confirmar Saída
              </button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="relative w-full flex flex-col items-center">
                {/* Profile Banner */}
                <div className="absolute top-0 left-0 w-full h-24 overflow-hidden rounded-t-lg border-x border-t border-border bg-background-secondary relative group">
                  {me?.banner ? (
                    <img 
                      src={`https://cdn.discordapp.com/banners/${me.id}/${me.banner}.png?size=600`} 
                      alt="" 
                      className="w-full h-full object-cover opacity-40 transition-all duration-700" 
                    />
                  ) : (
                    <div 
                      className="w-full h-full opacity-20" 
                      style={{ backgroundColor: me?.banner_color || '#4DA09E' }}
                    />
                  )}
                  {/* Banner Copy Button */}
                  <button 
                    onClick={() => {
                      if (!me?.banner) return;
                      const url = `https://cdn.discordapp.com/banners/${me.id}/${me.banner}.png?size=4096`;
                      navigator.clipboard.writeText(url);
                      toast.success("Link do Banner copiado!");
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 border border-white/10 text-white/60 hover:text-white hover:bg-black transition-all opacity-0 group-hover:opacity-100 rounded-md"
                    title="Copiar link do Banner"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="relative mt-12 group">
                  <div className="relative w-24 h-24 bg-background border-2 border-border overflow-hidden rounded-full shrink-0 shadow-xl transition-transform duration-500 group-hover:scale-105">
                   {avatarUrl ? (
                     <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-foreground-muted">
                       <UserRound className="w-10 h-10" />
                     </div>
                   )}
                   {/* Avatar Copy Button */}
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       if (!avatarUrl) return;
                       const highRes = avatarUrl.replace("?size=64", "?size=4096");
                       navigator.clipboard.writeText(highRes);
                       toast.success("Link do Avatar copiado!");
                     }}
                     className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                     <Copy className="w-6 h-6 text-white" />
                   </button>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-1">
                <div className="font-display text-xl text-foreground uppercase tracking-widest">{me?.global_name || me?.username}</div>
                <div className="font-sans text-xs text-foreground-muted uppercase tracking-widest">@{me?.username}</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <p className="text-foreground-muted text-[10px] text-center leading-relaxed uppercase tracking-widest opacity-50">
                ID: {me?.id}
              </p>
              
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => {
                    if (!avatarUrl) return;
                    const highRes = avatarUrl.replace("?size=64", "?size=4096");
                    navigator.clipboard.writeText(highRes);
                    toast.success("Link do Avatar copiado!");
                  }}
                  className="ds-btn ds-btn-secondary !py-1 !px-3 !text-[9px] uppercase tracking-tighter flex items-center gap-2"
                >
                  <Copy className="w-3 h-3" /> Copiar Avatar
                </button>
                <button 
                  onClick={() => {
                    if (!me?.banner) return;
                    const url = `https://cdn.discordapp.com/banners/${me.id}/${me.banner}.png?size=4096`;
                    navigator.clipboard.writeText(url);
                    toast.success("Link do Banner copiado!");
                  }}
                  className="ds-btn ds-btn-secondary !py-1 !px-3 !text-[9px] uppercase tracking-tighter flex items-center gap-2"
                  disabled={!me?.banner}
                >
                  <Copy className="w-3 h-3" /> Copiar Banner
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}