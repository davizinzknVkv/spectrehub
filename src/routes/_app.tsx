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
} from "lucide-react";
import logoAsset from "@/assets/spectre-logo-main.png.asset.json";
import { AdminNavLink } from "@/components/AdminNavLink";


const DISCORD_INVITE = "https://discord.gg/JK7cC9je87";

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
  }, [hydrate]);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-obsidian text-white antialiased">
      {/* Background elements for Hub */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-spectre-pink/5 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="relative z-10 grid min-h-screen w-full grid-cols-1 lg:grid-cols-[250px_1fr] overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden border-r border-white/5 bg-obsidian lg:sticky lg:top-0 lg:block lg:h-screen lg:w-[250px]">
          <SidebarBody pathname={pathname} creds={creds} setCreds={setCreds} />
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <aside className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-white/5 bg-obsidian lg:hidden">
              <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
                <span className="font-display text-[9px] uppercase tracking-[0.3em] text-white/40 italic">Menu Lateral</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarBody pathname={pathname} creds={creds} setCreds={setCreds} />
            </aside>
          </>
        )}

        {/* Main Content Area */}
        <main className="min-w-0 flex flex-col w-full">
          <TopBar onOpenMenu={() => setMobileOpen(true)} pathname={pathname} />
          <div className="flex-1 w-full max-w-6xl mx-auto px-4 pb-14 pt-6 sm:px-8 sm:pt-8 lg:px-10 lg:pb-16 lg:pt-10 overflow-hidden">
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
  creds: unknown;
  setCreds: (c: null) => void;
}) {
  const logoUrl = logoAsset.url;
  return (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex items-center gap-3 px-8 pb-10 pt-10 group">
        <img
          src={logoUrl}
          alt="Spectre Hub"
          className="h-10 w-10 object-contain shrink-0 transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,0,85,0.3)]"
        />
        <span className="font-display text-lg tracking-tighter text-white uppercase italic">
          Spectre <span className="text-spectre-pink">Hub</span>
        </span>
      </Link>

      <nav className="flex flex-col gap-8 px-4 py-2 lg:flex-1 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <div className="font-display px-4 pb-3 text-[9px] font-bold uppercase tracking-[0.3em] text-white/20 italic">{group.title}</div>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.to;
                return (
                  <Link
                    key={`${item.to}-${item.label}`}
                    to={item.to}
                    className={`flex items-center gap-3 px-4 py-2.5 transition-all duration-300 group border border-transparent ${
                      active 
                        ? "bg-spectre-pink/5 border-spectre-pink/20 text-white" 
                        : "text-white/40 hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        active ? "text-spectre-pink" : "text-white/20 group-hover:text-white"
                      }`}
                    />
                    <span className="font-display text-[11px] uppercase tracking-widest italic">
                      {item.label}
                    </span>
                    {item.soon && (
                      <span className="ml-auto bg-spectre-pink/10 text-spectre-pink text-[7px] font-display uppercase tracking-widest px-2 py-0.5 italic">beta</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/5 p-4 space-y-2">
        <AdminNavLink />
        <a 
          href={DISCORD_INVITE} 
          target="_blank" 
          rel="noreferrer" 
          className="flex items-center gap-3 px-4 py-2.5 text-white/40 hover:text-white transition-all group"
        >
          <LifeBuoy className="h-4 w-4 shrink-0 text-white/20 group-hover:text-white transition-colors" />
          <span className="font-display text-[11px] uppercase tracking-widest italic">Suporte Discord</span>
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
      className={`sticky top-0 z-20 transition-all duration-500 border-b ${
        scrolled 
          ? "bg-black/80 backdrop-blur-xl border-white/5 py-3 px-6" 
          : "bg-transparent border-transparent py-6 px-10"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenMenu}
            className="p-2 border border-white/5 text-white/40 hover:text-white transition-colors lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden lg:block">
            {currentLabel && (
              <h1 className="font-display text-[10px] tracking-[0.4em] text-white/30 uppercase italic">
                Painel <span className="text-spectre-pink mx-2">//</span> {currentLabel}
              </h1>
            )}
          </div>

          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <img src={logoAsset.url} alt="Spectre Hub" className="h-7 w-7 object-contain drop-shadow-[0_0_8px_rgba(255,0,85,0.3)]" />
            <span className="font-display text-[10px] tracking-[0.2em] uppercase italic text-white">Hub</span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${creds ? 'bg-spectre-pink shadow-[0_0_8px_#ff0055]' : 'bg-white/20'}`} />
            <span className="font-display text-[8px] tracking-[0.2em] text-white/20 uppercase italic hidden sm:block">
              {creds ? 'Terminal Ativo' : 'Offline'}
            </span>
          </div>

          {creds && me ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-3 p-1 border border-white/5 bg-white/[0.02] hover:border-spectre-pink/20 transition-all focus:outline-none pr-3">
                <div className="w-8 h-8 bg-white/5 overflow-hidden">
                   {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <UserRound className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="text-left hidden sm:block">
                   <div className="font-display text-[10px] text-white uppercase italic tracking-widest">{me.global_name || me.username}</div>
                   <div className="font-sans text-[8px] text-white/20 uppercase tracking-[0.2em]">Discord Verified</div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-obsidian border-white/5 rounded-none text-white/60">
                <DropdownMenuLabel className="font-display text-[9px] uppercase tracking-widest italic py-4">Gerenciar Conta</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem asChild className="focus:bg-spectre-pink focus:text-white cursor-pointer py-3 rounded-none">
                  <Link to="/hub" className="flex items-center gap-2 font-display text-[10px] uppercase italic tracking-widest">
                    <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-spectre-pink focus:text-white cursor-pointer py-3 rounded-none">
                  <Link to="/settings" className="flex items-center gap-2 font-display text-[10px] uppercase italic tracking-widest">
                    <KeyRound className="w-3.5 h-3.5" /> Segurança
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem onClick={() => setConfirmLogout(true)} className="focus:bg-rose-600 focus:text-white cursor-pointer py-3 rounded-none">
                   <span className="flex items-center gap-2 font-display text-[10px] uppercase italic tracking-widest">
                     <LogOut className="w-3.5 h-3.5" /> Encerrar Sessão
                   </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/settings" className="ds-btn ds-btn-primary !py-2 !px-6 !text-[9px]">
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
            <div className="flex gap-4 w-full">
              <button className="ds-btn ds-btn-secondary flex-1 py-3" onClick={() => setConfirmLogout(false)}>Cancelar</button>
              <button 
                className="ds-btn ds-btn-primary flex-1 py-3" 
                onClick={() => {
                  setCreds(null);
                  setConfirmLogout(false);
                  toast.success("Terminal desconectado");
                }}
              >Sair</button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 border border-white/5 p-4 bg-white/[0.02]">
              <div className="w-12 h-12 bg-white/5 overflow-hidden">
                 {avatarUrl && <img src={avatarUrl} alt="" className="w-full h-full object-cover grayscale" />}
              </div>
              <div>
                <div className="font-display text-xs text-white uppercase italic tracking-widest">{me?.global_name || me?.username}</div>
                <div className="font-sans text-[9px] text-white/20 uppercase tracking-[0.2em]">Verified Hub User</div>
              </div>
            </div>
            <p className="text-white/60 text-xs font-sans italic leading-relaxed">Sua chave de acesso será removida deste terminal local. Você precisará autenticar novamente para acessar os protocolos premium.</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
