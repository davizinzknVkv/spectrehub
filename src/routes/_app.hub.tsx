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
  fetchUserSettings,
  leaveGuild,
  fetchDMChannels,
  closeDMChannel,
  fetchRelationships,
  removeRelationship,

  type Guild,
  type ProfileBadge,
  type DMChannel,
  type Relationship
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
  Gamepad2,

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
  ShieldCheck,
  Trash2,
  UserMinus
} from "lucide-react";
import { Button, Badge, Card, Modal, StatCard, Skeleton } from "@/components/ui/ds";
import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/spectre-logo-nobg.png.asset.json";
import { cn, getDiscordCreationDate, formatDiscordAccountAge } from "@/lib/utils";

export const Route = createFileRoute("/_app/hub")({
  head: () => ({ meta: [{ title: "Hub — Spectre Hub" }] }),
  component: HubPage,
});

function HubPage() {
  const creds = useQuestStore((s) => s.creds);
  const plan = useQuestStore((s) => s.plan);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<{ total: number; friends: number } | null>(null);
  const [dmCount, setDmCount] = useState<number | null>(null);
  const [dmChannels, setDmChannels] = useState<DMChannel[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [bio, setBio] = useState<string | null>(null);
  const [badges, setBadges] = useState<ProfileBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [leavingAll, setLeavingAll] = useState(false);
  const [showGuilds, setShowGuilds] = useState(false);
  const [showDMs, setShowDMs] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showPresence, setShowPresence] = useState(false);
  const [userSettings, setUserSettings] = useState<any>(null);
  const [cleaningDms, setCleaningDms] = useState(false);
  const [cleaningFriends, setCleaningFriends] = useState(false);
  const [confirmAction, setConfirmAction] = useState<null | "dms" | "friends">(null);

  // Search filters
  const [guildSearch, setGuildSearch] = useState(() => localStorage.getItem("spectre_hub_guild_search") || "");
  const [dmSearch, setDmSearch] = useState(() => localStorage.getItem("spectre_hub_dm_search") || "");
  const [friendSearch, setFriendSearch] = useState(() => localStorage.getItem("spectre_hub_friend_search") || "");

  useEffect(() => {
    localStorage.setItem("spectre_hub_guild_search", guildSearch);
  }, [guildSearch]);

  useEffect(() => {
    localStorage.setItem("spectre_hub_dm_search", dmSearch);
  }, [dmSearch]);

  useEffect(() => {
    localStorage.setItem("spectre_hub_friend_search", friendSearch);
  }, [friendSearch]);

  const filteredGuilds = useMemo(() => {
    return guilds.filter(g => g.name.toLowerCase().includes(guildSearch.toLowerCase()));
  }, [guilds, guildSearch]);

  const filteredDMs = useMemo(() => {
    return dmChannels.filter(c => {
      const recipient = c.recipients?.[0];
      const name = c.name || recipient?.global_name || recipient?.username || "Conversa em Grupo";
      return name.toLowerCase().includes(dmSearch.toLowerCase()) || 
             c.id.includes(dmSearch) ||
             (recipient?.username && recipient.username.toLowerCase().includes(dmSearch.toLowerCase()));
    });
  }, [dmChannels, dmSearch]);

  const filteredFriends = useMemo(() => {
    return relationships.filter(r => {
      if (r.type !== 1) return false;
      const u = r.user;
      const name = u?.global_name || u?.username || "Usuário Desconhecido";
      return name.toLowerCase().includes(friendSearch.toLowerCase()) || 
             u?.username?.toLowerCase().includes(friendSearch.toLowerCase()) ||
             r.id.includes(friendSearch);
    });
  }, [relationships, friendSearch]);



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
          
          // Parallel fetch for details including plan verification
          const { fetchUserPlan } = await import("@/lib/quest-runner");
          const [rel, dms, gld, b, bdg, stg, p] = await Promise.all([
            fetchRelationshipsCount(),
            fetchDMsCount(),
            fetchGuilds(),
            fetchProfileBio(u.id as string),
            fetchProfileBadges(u.id as string),
            fetchUserSettings(),
            fetchUserPlan()
          ]);

          if (p) useQuestStore.getState().setPlan(p);


          setStats(rel);
          setDmCount(dms);
          setDmChannels(await fetchDMChannels());
          setRelationships(await fetchRelationships());
          setGuilds(gld);
          setBio(b);
          setBadges(bdg);
          setUserSettings(stg);

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
    if (targets.length === 0) {
      toast.info("Nenhum servidor para sair (você é dono de todos ou não está em nenhum).");
      setLeavingAll(false);
      return;
    }
    
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

  const handleClearDMs = async () => {
    setConfirmAction(null);
    setCleaningDms(true);
    try {
      const channels = await fetchDMChannels();
      if (channels.length === 0) {
        toast.info("Nenhuma conversa aberta para fechar.");
        return;
      }
      toast.info(`Fechando ${channels.length} conversas...`);
      let count = 0;
      for (const c of channels) {
        if (await closeDMChannel(c.id)) count++;
        await new Promise((r) => setTimeout(r, 600));
      }
      toast.success(`${count} conversas fechadas.`);
      setDmCount(await fetchDMsCount());
      setDmChannels(await fetchDMChannels());
    } catch {
      toast.error("Falha ao limpar as conversas.");
    } finally {
      setCleaningDms(false);
    }
  };

  const handleRemoveFriends = async () => {
    setConfirmAction(null);
    setCleaningFriends(true);
    try {
      const rels = await fetchRelationships();
      const targets = rels.filter((r) => r.type === 1);
      if (targets.length === 0) {
        toast.info("Nenhuma amizade encontrada.");
        return;
      }
      toast.info(`Removendo ${targets.length} amizades...`);
      let count = 0;
      for (const r of targets) {
        if (await removeRelationship(r.id)) count++;
        await new Promise((res) => setTimeout(res, 600));
      }
      toast.success(`${count} amizades removidas.`);
      setStats(await fetchRelationshipsCount());
      setRelationships(await fetchRelationships());
    } catch {
      toast.error("Falha ao remover as amizades.");
    } finally {
      setCleaningFriends(false);
    }
  };

  if (!creds) {
    return (
      <div className="pt-20 text-center space-y-8">
        <img src={logoAsset.url} alt="Logo" className="w-24 h-24 mx-auto invert opacity-50" />
        <h1 className="font-display text-4xl uppercase tracking-tighter text-white">Offline</h1>
        <p className="text-white/40 max-w-sm mx-auto font-sans">Conecte sua conta no portal de segurança para desbloquear o acesso total ao Spectre Hub.</p>
        <Link to="/settings" className="ds-btn ds-btn-primary mx-auto">Vincular Conta</Link>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="relative overflow-hidden border border-border bg-card/30 rounded-xl p-8 sm:p-12">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <img src={logoAsset.url} alt="" className="w-64 h-64 rotate-12" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
          {/* Avatar Area */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-background border border-border overflow-hidden relative rounded-2xl shadow-2xl">
              {loading ? (
                <Skeleton className="w-full h-full" />
              ) : user?.avatar ? (
                <img 
                  src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=256`} 
                  className="w-full h-full object-cover transition-all duration-700"
                  alt={user.username}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-display text-4xl text-foreground-muted uppercase">
                  {user?.username?.slice(0, 2) || "??"}
                </div>
              )}
              {/* Active Indicator */}
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-primary border-4 border-background rounded-full shadow-[0_0_12px_rgba(255,0,85,0.4)]" />
            </div>
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap gap-2">
              {loading ? (
                <Skeleton className="w-16 h-4" />
              ) : (
                badges.map(b => (
                  <div key={b.id} title={b.description} className="w-5 h-5 opacity-80 hover:opacity-100 transition-opacity">
                    <img src={`https://cdn.discordapp.com/badge-icons/${b.icon}.png`} alt="" className="w-full h-full object-contain" />
                  </div>
                ))
              )}
            </div>

            <div>
              {loading ? (
                <Skeleton className="h-10 w-64 mb-2" />
              ) : (
                <h2 className="font-display text-3xl sm:text-5xl text-foreground uppercase tracking-tight leading-none">
                  {user?.global_name || user?.username}
                  <span className="text-xs ml-3 font-mono text-primary font-bold">#{user?.id}</span>
                </h2>
              )}
              <div className="flex flex-wrap gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-foreground-muted" />
                  <span className="font-sans text-xs font-semibold text-foreground">{loading ? "---" : guilds.length} <span className="text-foreground-muted font-normal">Servidores</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-foreground-muted" />
                  <span className="font-sans text-xs font-semibold text-foreground">{loading ? "---" : (stats?.friends || 0)} <span className="text-foreground-muted font-normal">Amigos</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-foreground-muted" />
                  <span className="font-sans text-xs font-semibold text-foreground">{loading ? "---" : (dmCount || 0)} <span className="text-foreground-muted font-normal">DMs</span></span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-auto flex flex-col gap-2">
            <Link to="/settings" className="ds-btn ds-btn-secondary w-full text-center">Configurações</Link>
            <button onClick={handleLeaveAll} disabled={leavingAll} className="ds-btn ds-btn-primary w-full text-center">
              {leavingAll ? "Processando..." : "Sair de Servidores"}
            </button>
          </div>
        </div>
      </section>

      {/* Restored Quick Actions Grid */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-foreground">Ações Rápidas</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Target, label: "Missões", val: "Ativo", link: "/missoes", desc: "Farm de Orbs Automático" },
            { icon: Tractor, label: "Farms", val: "Idle", link: "/farms", desc: "Monitoramento em Tempo Real" },
            { icon: Crosshair, label: "Sniper", val: "Pronto", link: "/nicksgun", desc: "Nicks-Gun v4.2" },
            { icon: Gift, label: "Resgatar", val: "Shop", link: "/resgatar", desc: "Trocar Orbs por Itens" },
            { 
              icon: Gamepad2, 
              label: "Presence", 
              val: userSettings?.status?.toUpperCase() || "OFFLINE", 
              onClick: () => setShowPresence(true),
              desc: "Status & Rich Presence" 
            },

          ].map((item: any) => {
            const Content = (
              <div className="ds-card p-6 border-border bg-card/50 flex flex-col group hover:border-primary/40 transition-all overflow-hidden relative h-full w-full text-left rounded-xl">
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <item.icon className="w-24 h-24" />
                </div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                   <item.icon className="w-5 h-5 text-primary" />
                   <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-foreground-muted/50">{item.val}</span>
                </div>
                <div className="relative z-10">
                  <span className="font-sans text-sm font-bold text-foreground uppercase block">{item.label}</span>
                  <span className="text-[11px] text-foreground-muted font-sans font-medium">{item.desc}</span>
                </div>
              </div>
            );

            if (item.link) {
              return (
                <Link to={item.link} key={item.label} className="block transition-all">
                  {Content}
                </Link>
              );
            }

            return (
              <button key={item.label} onClick={item.onClick} className="block transition-all">
                {Content}
              </button>
            );
          })}

        </div>
      </section>

      {/* Account Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-8">
          {/* User Bio and Security Info */}
          <section className="ds-card p-8 border-border bg-card/30 rounded-xl space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <UserRound className="w-3.5 h-3.5 text-primary" />
                <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-foreground">Informações da Conta</h3>
              </div>
              <div className="p-4 bg-background border border-border rounded-lg font-sans text-xs text-foreground-muted italic leading-relaxed min-h-[60px]">
                {loading ? <Skeleton className="h-4 w-full" /> : bio || "Sem biografia definida."}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: "E-mail", val: user?.email || "N/A", icon: Mail, mask: true },
                { label: "Telefone", val: user?.phone || "Não Vinculado", icon: Phone, mask: user?.phone ? true : false },
                { label: "MFA / 2FA", val: user?.mfa_enabled ? "Ativado" : "Desativado", icon: Lock, alert: !user?.mfa_enabled },
                { label: "Criado em", val: user?.id ? getDiscordCreationDate(user.id).toLocaleDateString('pt-BR') : "N/A", icon: Calendar },
                { label: "Idade da Conta", val: user?.id ? formatDiscordAccountAge(user.id) : "N/A", icon: History },
              ].map(info => (
                <div key={info.label} className="flex gap-4 items-center group/info">
                  <div className={cn("w-10 h-10 flex items-center justify-center border border-border bg-background rounded-lg", info.alert && "text-primary")}>
                    <info.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted/50 mb-1">{info.label}</div>
                    <div className={cn(
                      "font-sans text-[13px] font-semibold text-foreground transition-all duration-300", 
                      info.alert && "text-primary",
                      info.mask && "blur-[4px] group-hover/info:blur-0 select-none cursor-help"
                    )}>
                      {info.val}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Manage Servers Restored */}
          <section className="ds-card p-8 border-border bg-card/30 rounded-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-primary" />
                <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-foreground">Gerenciar Servidores</h3>
              </div>
              <span className="font-mono text-[10px] text-foreground-muted/50 uppercase font-bold">{guilds.length} Total</span>
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

          {/* Limpeza da Conta */}
          <section className="ds-card p-8 border-border bg-card/30 rounded-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Trash2 className="w-3.5 h-3.5 text-primary" />
                <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-foreground">Limpeza da Conta</h3>
              </div>
              <span className="font-mono text-[10px] text-foreground-muted/50 uppercase font-bold">
                {dmCount ?? 0} DMS / {stats?.friends ?? 0} AMIGOS
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowDMs(true)}
                disabled={cleaningDms}
                className="flex-1 ds-btn ds-btn-secondary flex items-center justify-center gap-3"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                {cleaningDms ? "Limpando..." : "Listar Conversas"}
              </button>
              <button
                onClick={() => setShowFriends(true)}
                disabled={cleaningFriends}
                className="flex-1 ds-btn ds-btn-primary flex items-center justify-center gap-3"
              >
                <UserMinus className="w-3.5 h-3.5" />
                {cleaningFriends ? "Removendo..." : "Listar Amigos"}
              </button>
            </div>
            <p className="mt-4 text-[11px] text-foreground-muted/50 font-sans font-medium uppercase tracking-wider">
              Estas ações são permanentes e podem levar alguns minutos dependendo do volume.
            </p>
          </section>
        </div>

        {/* Sidebar: Premium Stats & Plan */}
        <aside className="space-y-8">
          <section className="ds-card !p-8 border-primary/20 bg-primary/5 relative overflow-hidden group rounded-xl">
            <div className="absolute -right-8 -top-8 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-700">
              <Sparkles className="w-32 h-32 text-primary" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Spectre Tier</span>
              </div>
              
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted/50">Plano Atual</div>
                <div className="font-display text-3xl text-foreground tracking-tight uppercase leading-none">
                  {loading ? <Skeleton className="h-8 w-24" /> : plan.toUpperCase()}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted/50">Status</span>
                  <span className="font-mono text-[10px] font-bold text-primary shadow-[0_0_12px_rgba(255,0,85,0.4)]">ONLINE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted/50">Encriptação</span>
                  <span className="font-mono text-[10px] font-bold text-foreground">AES-256</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted/50">Prioridade</span>
                  <span className="font-mono text-[10px] font-bold text-foreground">NÍVEL 4</span>
                </div>
              </div>

              <Link to="/resgatar" className="ds-btn ds-btn-primary w-full text-center !py-3">Acessar Loja</Link>
            </div>
          </section>

          <section className="ds-card !p-6 border-border bg-card/30 rounded-xl space-y-4">
            <h4 className="font-sans text-[10px] font-bold uppercase tracking-wider text-foreground-muted/50">Atividade Recente</h4>
            <div className="space-y-3">
              {[
                { label: "Sniper Calibrado", time: "2m atrás" },
                { label: "Orbs Sincronizados", time: "15m atrás" },
                { label: "Login Realizado", time: "1h atrás" },
              ].map((act, i) => (
                <div key={i} className="flex justify-between items-center border-b border-border/20 pb-2 last:border-0 last:pb-0">
                  <span className="text-[11px] text-foreground-muted font-medium uppercase tracking-wider">{act.label}</span>
                  <span className="text-[9px] font-mono font-bold text-foreground-muted/30 uppercase">{act.time}</span>
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
          className="max-w-2xl rounded-2xl"
        >
          <div className="space-y-4">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-muted/50" />
              <input 
                type="text" 
                placeholder="Filtrar servidores..." 
                value={guildSearch}
                onChange={(e) => setGuildSearch(e.target.value)}
                className="w-full bg-background border border-border py-2.5 pl-10 pr-4 font-sans text-xs rounded-lg text-foreground placeholder:text-foreground-muted/30 focus:border-primary/40 outline-none transition-all"
              />
            </div>
            
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {filteredGuilds.length === 0 ? (
                <p className="text-center py-8 text-foreground-muted/30 font-sans text-xs font-medium uppercase tracking-widest">Nenhum servidor encontrado</p>
              ) : filteredGuilds.map(g => (
              <div key={g.id} className="flex items-center justify-between p-4 bg-card/30 border border-border group hover:border-primary/20 transition-all rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center overflow-hidden">
                    {g.icon ? (
                      <img src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                    ) : (
                      <span className="text-[10px] text-foreground-muted font-bold uppercase">{g.name.slice(0, 2)}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-sans text-[13px] font-bold text-foreground uppercase tracking-tight">{g.name}</div>
                    <div className="font-mono text-[9px] font-bold text-foreground-muted/50 uppercase">{g.id}</div>
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
                      className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-foreground transition-colors"
                    >
                      Sair
                    </button>
                  )}
                </div>
              </div>
            ))}
            </div>
          </div>
        </Modal>
      )}
      {/* DM List Modal */}
      {showDMs && (
        <Modal 
          title="Conversas Abertas" 
          onClose={() => setShowDMs(false)}
          className="max-w-2xl rounded-2xl"
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-muted/50" />
                <input 
                  type="text" 
                  placeholder="Filtrar conversas..." 
                  value={dmSearch}
                  onChange={(e) => setDmSearch(e.target.value)}
                  className="w-full bg-background border border-border py-2.5 pl-10 pr-4 font-sans text-xs rounded-lg text-foreground placeholder:text-foreground-muted/30 focus:border-primary/40 outline-none transition-all"
                />
              </div>
              <button 
                onClick={() => { setShowDMs(false); setConfirmAction("dms"); }}
                className="ds-btn ds-btn-primary !py-2.5 !px-5 !text-[11px] font-bold rounded-lg whitespace-nowrap"
              >
                Limpar Todas as DMs
              </button>
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {filteredDMs.length === 0 ? (
                <p className="text-center py-8 text-foreground-muted/30 font-sans text-xs font-medium uppercase tracking-widest">Nenhuma conversa encontrada</p>
              ) : filteredDMs.map(c => {
              const recipient = c.recipients?.[0];
              const name = c.name || recipient?.global_name || recipient?.username || "Conversa em Grupo";
              const avatar = recipient?.avatar ? `https://cdn.discordapp.com/avatars/${recipient.id}/${recipient.avatar}.png` : null;
              
              return (
                <div key={c.id} className="flex items-center justify-between p-4 bg-card/30 border border-border group hover:border-primary/20 transition-all rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center overflow-hidden">
                      {avatar ? (
                        <img src={avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-foreground-muted/20">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-sans text-[13px] font-bold text-foreground uppercase tracking-tight">{name}</div>
                      <div className="font-mono text-[9px] font-bold text-foreground-muted/50 uppercase">
                        {c.type === 1 ? "DM Direta" : "Grupo"} <span className="mx-2 font-sans opacity-20">/</span> {c.id}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      if (confirm(`Fechar esta conversa?`)) {
                        const ok = await closeDMChannel(c.id);
                        if (ok) {
                          toast.success(`Conversa fechada`);
                          setDmChannels(prev => prev.filter(x => x.id !== c.id));
                          setDmCount(prev => prev !== null ? prev - 1 : 0);
                        }
                      }
                    }}
                    className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-foreground transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              );
            })}
            </div>
          </div>
        </Modal>
      )}
      {/* Friends List Modal */}
      {showFriends && (
        <Modal 
          title="Lista de Amigos" 
          onClose={() => setShowFriends(false)}
          className="max-w-2xl rounded-2xl"
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-muted/50" />
                <input 
                  type="text" 
                  placeholder="Filtrar amigos..." 
                  value={friendSearch}
                  onChange={(e) => setFriendSearch(e.target.value)}
                  className="w-full bg-background border border-border py-2.5 pl-10 pr-4 font-sans text-xs rounded-lg text-foreground placeholder:text-foreground-muted/30 focus:border-primary/40 outline-none transition-all"
                />
              </div>
              <button 
                onClick={() => { setShowFriends(false); setConfirmAction("friends"); }}
                className="ds-btn ds-btn-primary !py-2.5 !px-5 !text-[11px] font-bold rounded-lg whitespace-nowrap"
              >
                Limpar Todos os Amigos
              </button>
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {filteredFriends.length === 0 ? (
                <p className="text-center py-8 text-foreground-muted/30 font-sans text-xs font-medium uppercase tracking-widest">Nenhuma amizade encontrada</p>
              ) : filteredFriends.map(r => {
              const u = r.user;
              const name = u?.global_name || u?.username || "Usuário Desconhecido";
              const avatar = u?.avatar ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png` : null;
              
              return (
                <div key={r.id} className="flex items-center justify-between p-4 bg-card/30 border border-border group hover:border-primary/20 transition-all rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center overflow-hidden">
                      {avatar ? (
                        <img src={avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-foreground-muted/20">
                          <UserRound className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-sans text-[13px] font-bold text-foreground uppercase tracking-tight">{name}</div>
                      <div className="font-mono text-[9px] font-bold text-foreground-muted/50 uppercase">
                        {u?.username} <span className="mx-2 font-sans opacity-20">/</span> {r.id}
                      </div>
                      <div className="font-sans text-[9px] text-primary uppercase font-bold tracking-wider mt-1">
                        {u?.id ? formatDiscordAccountAge(u.id) : ""}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      if (confirm(`Remover amizade com ${name}?`)) {
                        const ok = await removeRelationship(r.id);
                        if (ok) {
                          toast.success(`Amizade removida`);
                          setRelationships(prev => prev.filter(x => x.id !== r.id));
                          setStats(prev => prev ? { ...prev, friends: prev.friends - 1 } : null);
                        }
                      }
                    }}
                    className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-foreground transition-colors"
                  >
                    Remover
                  </button>
                </div>
              );
            })}
            </div>
          </div>
        </Modal>
      )}
      {/* Presence Modal */}
      {showPresence && (
        <PresenceModal 
          settings={userSettings} 
          onClose={() => setShowPresence(false)} 
          onUpdate={(newSettings) => setUserSettings(newSettings)}
        />
      )}
      {/* Confirmação de Limpeza */}
      {confirmAction && (
        <Modal
          title={confirmAction === "dms" ? "Limpar Conversas" : "Remover Amizades"}
          description={
            confirmAction === "dms"
              ? `Todas as suas conversas abertas (${dmCount ?? 0}) serão fechadas.`
              : `Todos os seus amigos (${stats?.friends ?? 0}) serão removidos da sua lista.`
          }
          onClose={() => setConfirmAction(null)}
          className="max-w-md rounded-2xl"
        >
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-5 border border-primary/20 bg-primary/5 rounded-xl">
              <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-[12px] text-foreground-muted font-sans font-medium leading-relaxed">
                Esta ação é permanente e não pode ser desfeita. O protocolo de segurança Spectre processa as remoções gradualmente para proteger a integridade da sua conta.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 ds-btn ds-btn-secondary text-center !py-3 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={confirmAction === "dms" ? handleClearDMs : handleRemoveFriends}
                className="flex-1 ds-btn ds-btn-primary text-center !py-3 rounded-lg font-bold"
              >
                Confirmar Protocolo
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function PresenceModal({ 
  settings, 
  onClose,
  onUpdate 
}: { 
  settings: any; 
  onClose: () => void;
  onUpdate: (s: any) => void;
}) {
  const [activeTab, setActiveTab] = useState<'status' | 'custom' | 'rich'>('status');
  const [status, setStatus] = useState(settings?.status || 'online');
  const [customText, setCustomText] = useState(settings?.custom_status?.text || '');
  const [customEmoji, setCustomEmoji] = useState(settings?.custom_status?.emoji_name || '');
  const [richEnabled, setRichEnabled] = useState(false);
  const [richName, setRichName] = useState('Spectre Hub');
  const [richDetails, setRichDetails] = useState('Optimizing Discord');
  const [loading, setLoading] = useState(false);
  
  const token = useQuestStore(s => s.creds?.token);

  const handleSave = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { updatePresence } = await import("@/lib/presence.functions");
      await updatePresence({
        data: {
          token,
          status: activeTab === 'status' ? status : undefined,
          customStatus: activeTab === 'custom' ? {
            text: customText,
            emojiName: customEmoji || undefined
          } : undefined,
          richPresence: activeTab === 'rich' ? {
            enabled: richEnabled,
            name: richName,
            details: richDetails
          } : undefined
        }
      });

      
      toast.success("Status atualizado");
      // Update local state to reflect changes (simplified)
      const newSettings = { ...settings };
      if (activeTab === 'status') newSettings.status = status;
      if (activeTab === 'custom') newSettings.custom_status = { text: customText, emoji_name: customEmoji };
      onUpdate(newSettings);
      
      onClose();
    } catch (err) {
      toast.error("Erro ao atualizar presença");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      title="Status & Presença" 
      description="Gerencie como você aparece no Discord através da rede Spectre"
      onClose={onClose}
      className="max-w-lg rounded-2xl"
    >

      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          {['status', 'custom', 'rich'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "flex-1 py-3 font-sans text-[11px] font-bold uppercase tracking-wider transition-all relative",
                activeTab === tab 
                  ? "text-primary" 
                  : "text-foreground-muted hover:text-foreground"
              )}
            >
              {tab === 'status' && 'Status'}
              {tab === 'custom' && 'Personalizado'}
              {tab === 'rich' && 'Rich Presence'}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_8px_rgba(255,0,85,0.4)]" />
              )}
            </button>
          ))}
        </div>

        <div className="min-h-[200px] py-4">
          {activeTab === 'status' && (
            <div className="space-y-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted/50 mb-4">Selecione sua visibilidade</div>
              <div className="grid grid-cols-2 gap-3">
                {['online', 'idle', 'dnd', 'invisible'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={cn(
                      "p-4 border border-border bg-card/30 rounded-xl flex items-center gap-4 group transition-all duration-300",
                      status === s && "border-primary/40 bg-primary/5 shadow-lg shadow-primary/5"
                    )}
                  >
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      s === 'online' && "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]",
                      s === 'idle' && "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]",
                      s === 'dnd' && "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]",
                      s === 'invisible' && "bg-white/20"
                    )} />
                    <span className={cn(
                      "font-sans text-xs font-bold uppercase tracking-wider",
                      status === s ? "text-foreground" : "text-foreground-muted/50"
                    )}>{s === 'dnd' ? 'Não Perturbe' : s === 'invisible' ? 'Invisível' : s === 'idle' ? 'Ausente' : 'Online'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">Ativar Status Customizado</span>
                <button 
                  onClick={() => setCustomText(customText ? '' : 'Spectre Hub User')}
                  className={cn(
                    "w-10 h-5 rounded-full relative transition-all duration-500",
                    customText ? "bg-primary shadow-[0_0_10px_rgba(255,0,85,0.4)]" : "bg-border"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-500",
                    customText ? "left-6" : "left-1"
                  )} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted/50 block mb-2">Texto do Status</label>
                  <input 
                    type="text" 
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="O que você está fazendo agora?"
                    className="w-full bg-background border border-border p-4 rounded-xl font-sans text-sm text-foreground outline-none focus:border-primary/40 transition-all placeholder:text-foreground-muted/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted/50 block mb-2">Emoji (Opcional)</label>
                  <input 
                    type="text" 
                    value={customEmoji}
                    onChange={(e) => setCustomEmoji(e.target.value)}
                    placeholder="🚀 ou nome_do_emoji"
                    className="w-full bg-background border border-border p-4 rounded-xl font-sans text-sm text-foreground outline-none focus:border-primary/40 transition-all placeholder:text-foreground-muted/20"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rich' && (
              <div className="flex items-center justify-between p-5 bg-primary/5 border border-primary/20 rounded-xl">
                <div className="flex items-center gap-4">
                  <Gamepad2 className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-xs font-bold text-foreground uppercase tracking-tight">Atividade do Sistema</div>
                    <div className="text-[10px] text-foreground-muted font-medium uppercase tracking-wider">Simular atividade de jogo</div>
                  </div>
                </div>

                <button 
                  onClick={() => setRichEnabled(!richEnabled)}
                  className={cn(
                    "w-10 h-5 rounded-full relative transition-all duration-500",
                    richEnabled ? "bg-primary shadow-[0_0_10px_rgba(255,0,85,0.4)]" : "bg-border"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-500",
                    richEnabled ? "left-6" : "left-1"
                  )} />
                </button>
              </div>

              <div className={cn("space-y-4 transition-all duration-500", !richEnabled && "opacity-20 pointer-events-none grayscale")}>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted/50 block mb-2">Nome da Atividade</label>
                  <input 
                    type="text" 
                    value={richName}
                    onChange={(e) => setRichName(e.target.value)}
                    className="w-full bg-background border border-border p-4 rounded-xl font-sans text-sm text-foreground outline-none focus:border-primary/40 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted/50 block mb-2">Detalhes</label>
                  <input 
                    type="text" 
                    value={richDetails}
                    onChange={(e) => setRichDetails(e.target.value)}
                    className="w-full bg-background border border-border p-4 rounded-xl font-sans text-sm text-foreground outline-none focus:border-primary/40 transition-all"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={onClose}
            className="flex-1 ds-btn ds-btn-secondary !py-3 font-bold uppercase tracking-widest text-[11px] rounded-lg"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex-1 ds-btn ds-btn-primary !py-3 font-bold uppercase tracking-widest text-[11px] rounded-lg shadow-lg shadow-primary/20"
          >
            {loading ? "Sincronizando..." : "Aplicar Protocolo"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

