import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { useQuestStore } from "@/lib/quest-store";
import { 
  fetchUserInfoDetailed, 
  fetchRelationshipsCount, 
  fetchDMsCount, 
  fetchGuilds, 
  fetchProfileBio, 
  fetchProfileBadges,
  leaveGuild,
  type Guild,
  type ProfileBadge
} from "@/lib/quest-runner";
import { PageHeader } from "@/components/PageHeader";
import { 
  LayoutDashboard, 
  Target, 
  History, 
  Gift, 
  Crosshair, 
  UserRound, 
  ArrowRight, 
  Sparkles, 
  Tractor, 
  Copy,
  Users,
  MessageSquare,
  Server,
  ShieldAlert,
  Calendar,
  Phone,
  Mail,
  Lock,
  Search,
  LogOut,
  ChevronRight,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { Button, Badge, Card, Modal, StatCard, Skeleton } from "@/components/ui/ds";
import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/spectre-logo-nobg.png.asset.json";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/hub")({
  head: () => ({ meta: [{ title: "Hub — Spectre Hub" }] }),
  component: HubPage,
});

function HubPage() {
  const creds = useQuestStore((s) => s.creds);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<{ total: number; friends: number } | null>(null);
  const [dmCount, setDmCount] = useState<number | null>(null);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [bio, setBio] = useState<string | null>(null);
  const [badges, setBadges] = useState<ProfileBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [leavingAll, setLeavingAll] = useState(false);
  const [showGuilds, setShowGuilds] = useState(false);

  useEffect(() => {
    if (!creds) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const loadData = async () => {
      try {
        const userInfo = await fetchUserInfoDetailed();
        if (userInfo.ok) {
          const u = userInfo.data;
          setUser(u);
          
          // Parallel fetch for details
          const [rel, dms, gld, b, bdg] = await Promise.all([
            fetchRelationshipsCount(),
            fetchDMsCount(),
            fetchGuilds(),
            fetchProfileBio(u.id as string),
            fetchProfileBadges(u.id as string)
          ]);

          setStats(rel);
          setDmCount(dms);
          setGuilds(gld);
          setBio(b);
          setBadges(bdg);
        }
      } catch (err) {
        console.error("Hub data load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [creds]);

  const handleLeaveAll = async () => {
    if (!confirm("Isso fará você sair de TODOS os servidores onde não é dono. Continuar?")) return;
    setLeavingAll(true);
    let count = 0;
    const targets = guilds.filter(g => !g.owner);
    
    toast.info(`Iniciando desligamento de ${targets.length} servidores...`);
    
    for (const g of targets) {
      const ok = await leaveGuild(g.id);
      if (ok) count++;
      // Prevent rate limits
      await new Promise(r => setTimeout(r, 600));
    }
    
    toast.success(`${count} servidores removidos.`);
    setLeavingAll(false);
    // Refresh
    const gld = await fetchGuilds();
    setGuilds(gld);
  };

  if (!creds) {
    return (
      <div className="pt-20 text-center space-y-8">
        <img src={logoAsset.url} alt="Logo" className="w-24 h-24 mx-auto invert opacity-50" />
        <h1 className="font-display text-4xl uppercase tracking-tighter text-white">Terminal Offline</h1>
        <p className="text-white/40 max-w-sm mx-auto font-sans">Conecte sua conta no portal de segurança para desbloquear o acesso total ao Spectre Hub.</p>
        <Link to="/settings" className="ds-btn ds-btn-primary mx-auto">Vincular Conta</Link>
      </div>
    );
  }

  return (
    <div className="page-stack">
      {/* Restored Rich Profile Header */}
      <section className="relative overflow-hidden border border-white/5 bg-white/[0.02] p-8 sm:p-12">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <img src={logoAsset.url} alt="" className="w-64 h-64 rotate-12" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
          {/* Avatar Area */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-obsidian border border-white/10 overflow-hidden relative">
              {loading ? (
                <Skeleton className="w-full h-full" />
              ) : user?.avatar ? (
                <img 
                  src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  alt={user.username}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-display text-4xl text-white/20 uppercase italic">
                  {user?.username?.slice(0, 2) || "??"}
                </div>
              )}
              {/* Active Indicator */}
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-spectre-pink border-4 border-obsidian shadow-[0_0_8px_#ff0055]" />
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              {loading ? (
                <Skeleton className="w-16 h-4" />
              ) : (
                badges.map(b => (
                  <div key={b.id} title={b.description} className="w-5 h-5 opacity-40 hover:opacity-100 transition-opacity">
                    <img src={`https://cdn.discordapp.com/badge-icons/${b.icon}.png`} alt="" className="w-full h-full object-contain invert" />
                  </div>
                ))
              )}
            </div>

            <div>
              {loading ? (
                <Skeleton className="h-12 w-64 mb-2" />
              ) : (
                <h2 className="font-display text-4xl sm:text-6xl text-white uppercase italic tracking-tighter leading-none">
                  {user?.global_name || user?.username}
                  <span className="text-[10px] ml-4 font-mono text-spectre-pink tracking-widest not-italic">#{user?.id}</span>
                </h2>
              )}
              <div className="flex flex-wrap gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-white/20" />
                  <span className="font-display text-[10px] uppercase tracking-widest text-white italic">{guilds.length} <span className="text-white/20">Servidores</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-white/20" />
                  <span className="font-display text-[10px] uppercase tracking-widest text-white italic">{stats?.friends || 0} <span className="text-white/20">Amigos</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-white/20" />
                  <span className="font-display text-[10px] uppercase tracking-widest text-white italic">{dmCount || 0} <span className="text-white/20">DMs</span></span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-auto flex flex-col gap-2">
            <Link to="/settings" className="ds-btn ds-btn-secondary !py-2 !px-6 !text-[9px] w-full text-center">Configurações</Link>
            <button onClick={handleLeaveAll} disabled={leavingAll} className="ds-btn ds-btn-primary !py-2 !px-6 !text-[9px] w-full text-center">
              {leavingAll ? "Processando..." : "Limpar Conta"}
            </button>
          </div>
        </div>
      </section>

      {/* Restored Quick Actions Grid */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-spectre-pink" />
          <h3 className="font-display text-[10px] uppercase tracking-[0.3em] text-white italic font-bold">Ações Rápidas</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Target, label: "Missões", val: "Ativo", link: "/missoes", desc: "Farm de Orbs Automático" },
            { icon: Tractor, label: "Farms", val: "Idle", link: "/farms", desc: "Monitoramento em Tempo Real" },
            { icon: Crosshair, label: "Sniper", val: "Pronto", link: "/nicksgun", desc: "Nicks-Gun v4.2" },
            { icon: Gift, label: "Resgatar", val: "Shop", link: "/resgatar", desc: "Trocar Orbs por Itens" },
          ].map((item) => (
            <Link to={item.link} key={item.label} className="ds-card p-6 border-white/5 bg-white/[0.02] flex flex-col group hover:border-spectre-pink/40 transition-all overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <item.icon className="w-24 h-24" />
              </div>
              <div className="flex justify-between items-start mb-4 relative z-10">
                 <item.icon className="w-5 h-5 text-spectre-pink" />
                 <span className="font-display text-[9px] uppercase tracking-widest text-white/20">{item.val}</span>
              </div>
              <div className="relative z-10">
                <span className="font-display text-sm tracking-widest text-white uppercase italic block">{item.label}</span>
                <span className="text-[9px] text-white/30 uppercase tracking-widest font-sans italic">{item.desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Account Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-8">
          {/* User Bio and Security Info */}
          <section className="ds-card p-8 border-white/5 bg-white/[0.02] space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <UserRound className="w-3.5 h-3.5 text-spectre-pink" />
                <h3 className="font-display text-[10px] uppercase tracking-widest text-white italic">Informações da Conta</h3>
              </div>
              <div className="p-4 bg-obsidian border border-white/5 font-sans text-xs text-white/40 italic leading-relaxed min-h-[60px]">
                {loading ? <Skeleton className="h-4 w-full" /> : bio || "Sem biografia definida."}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: "E-mail", val: user?.email || "N/A", icon: Mail },
                { label: "Telefone", val: user?.phone || "Não Vinculado", icon: Phone },
                { label: "MFA / 2FA", val: user?.mfa_enabled ? "Ativado" : "Desativado", icon: Lock, alert: !user?.mfa_enabled },
                { label: "Criado em", val: user?.id ? new Date(parseInt(user.id) / 4194304 + 1420070400000).toLocaleDateString() : "N/A", icon: Calendar },
              ].map(info => (
                <div key={info.label} className="flex gap-4 items-center">
                  <div className={cn("w-10 h-10 flex items-center justify-center border border-white/5 bg-white/[0.01]", info.alert && "text-spectre-pink")}>
                    <info.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-white/20 mb-1">{info.label}</div>
                    <div className={cn("font-display text-[11px] uppercase tracking-widest text-white", info.alert && "text-spectre-pink")}>{info.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Manage Servers Restored */}
          <section className="ds-card p-8 border-white/5 bg-white/[0.02]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-spectre-pink" />
                <h3 className="font-display text-[10px] uppercase tracking-widest text-white italic">Gerenciar Servidores</h3>
              </div>
              <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">{guilds.length} Total</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setShowGuilds(true)}
                className="flex-1 ds-btn ds-btn-secondary flex items-center justify-center gap-3"
              >
                <Search className="w-3.5 h-3.5" />
                Listar Servidores
              </button>
              <button 
                onClick={handleLeaveAll}
                disabled={leavingAll}
                className="flex-1 ds-btn ds-btn-primary flex items-center justify-center gap-3"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sair de Todos
              </button>
            </div>
          </section>
        </div>

        {/* Sidebar: Premium Stats & Plan */}
        <aside className="space-y-8">
          <section className="ds-card p-8 border-spectre-pink/20 bg-spectre-pink/5 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-700">
              <Sparkles className="w-32 h-32 text-spectre-pink" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2 text-spectre-pink">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-display text-[9px] uppercase tracking-widest italic font-bold">Protocolo Spectre</span>
              </div>
              
              <div className="space-y-2">
                <div className="text-[9px] uppercase tracking-widest text-white/30">Plano Atual</div>
                <div className="font-display text-3xl text-white italic tracking-tighter uppercase leading-none">
                  {loading ? <Skeleton className="h-8 w-24" /> : "Premium"}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-widest text-white/40">Status do Terminal</span>
                  <span className="font-mono text-[9px] text-spectre-pink shadow-[0_0_8px_#ff0055]">ONLINE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-widest text-white/40">Encriptação</span>
                  <span className="font-mono text-[9px] text-white">AES-256</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-widest text-white/40">Prioridade</span>
                  <span className="font-mono text-[9px] text-white">NÍVEL 4</span>
                </div>
              </div>

              <Link to="/resgatar" className="ds-btn ds-btn-primary w-full text-center !py-3">Acessar Loja</Link>
            </div>
          </section>

          <section className="ds-card p-6 border-white/5 bg-white/[0.02] space-y-4">
            <h4 className="font-display text-[9px] uppercase tracking-widest text-white/30 italic">Atividade Recente</h4>
            <div className="space-y-3">
              {[
                { label: "Sniper Calibrado", time: "2m atrás" },
                { label: "Orbs Sincronizados", time: "15m atrás" },
                { label: "Login Realizado", time: "1h atrás" },
              ].map((act, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                  <span className="text-[10px] text-white/60 font-sans italic">{act.label}</span>
                  <span className="text-[8px] font-mono text-white/20 uppercase">{act.time}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {/* Guild List Modal */}
      {showGuilds && (
        <Modal 
          title="Servidores Vinculados" 
          onClose={() => setShowGuilds(false)}
          className="max-w-2xl"
        >
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {guilds.map(g => (
              <div key={g.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-obsidian border border-white/10 flex items-center justify-center overflow-hidden">
                    {g.icon ? (
                      <img src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                    ) : (
                      <span className="text-[10px] text-white/20 uppercase font-display">{g.name.slice(0, 2)}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-display text-[11px] text-white uppercase italic tracking-widest">{g.name}</div>
                    <div className="font-mono text-[8px] text-white/20 uppercase">{g.id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {g.owner && <Badge variant="spectre-pink">Dono</Badge>}
                  {!g.owner && (
                    <button 
                      onClick={async () => {
                        if (confirm(`Sair de ${g.name}?`)) {
                          const ok = await leaveGuild(g.id);
                          if (ok) {
                            toast.success(`Saiu de ${g.name}`);
                            setGuilds(guilds.filter(x => x.id !== g.id));
                          }
                        }
                      }}
                      className="text-[9px] uppercase tracking-widest text-spectre-pink opacity-40 hover:opacity-100 transition-opacity italic font-bold"
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
