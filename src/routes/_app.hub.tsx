import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQuestStore } from "@/lib/quest-store";
import { fetchUserInfoDetailed } from "@/lib/quest-runner";
import { PageHeader } from "@/components/PageHeader";
import { LayoutDashboard, Target, History, Gift, Crosshair, UserRound, ArrowRight, Sparkles, Tractor, Copy } from "lucide-react";
import { Button } from "@/components/ui/ds";
import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/spectre-logo-nobg.png.asset.json";

export const Route = createFileRoute("/_app/hub")({
  head: () => ({ meta: [{ title: "Hub — Spectre Hub" }] }),
  component: HubPage,
});

function HubPage() {
  const creds = useQuestStore((s) => s.creds);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!creds) {
      setLoading(false);
      return;
    }
    fetchUserInfoDetailed().then(r => {
      if (r.ok) setUser(r.data);
      setLoading(false);
    });
  }, [creds]);

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
      <PageHeader
        eyebrow="hub --control"
        icon={LayoutDashboard}
        title="Painel de"
        highlight="Controle"
        description="Gerencie suas ferramentas e monitore a performance da sua conta."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Target, label: "Missões", val: "Ativo", link: "/missoes" },
          { icon: Tractor, label: "Farms", val: "Idle", link: "/farms" },
          { icon: Crosshair, label: "Sniper", val: "Pronto", link: "/nicksgun" },
          { icon: Gift, label: "Orbs", val: "Consultar", link: "/resgatar" },
        ].map((item) => (
          <Link to={item.link} key={item.label} className="ds-card p-6 border-white/5 bg-white/[0.02] flex flex-col group hover:border-spectre-pink/40 transition-all">
            <div className="flex justify-between items-start mb-4">
               <item.icon className="w-5 h-5 text-spectre-pink" />
               <span className="font-display text-[9px] uppercase tracking-widest text-white/20">{item.val}</span>
            </div>
            <span className="font-display text-sm tracking-widest text-white uppercase italic">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="ds-card mt-8 p-8 border border-white/5 bg-white/[0.02]">
        <h3 className="font-display text-sm uppercase tracking-widest text-white mb-6 italic">Estatísticas do Usuário</h3>
        {loading ? (
            <div className="animate-pulse h-12 bg-white/5" />
        ) : user ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="space-y-1">
                    <div className="text-[9px] uppercase tracking-widest text-white/30">Nome</div>
                    <div className="font-display text-lg text-white">{user.global_name || user.username}</div>
                </div>
                <div className="space-y-1">
                    <div className="text-[9px] uppercase tracking-widest text-white/30">ID</div>
                    <div className="font-mono text-lg text-spectre-pink">{user.id}</div>
                </div>
                <div className="space-y-1">
                    <div className="text-[9px] uppercase tracking-widest text-white/30">Status</div>
                    <div className="font-display text-lg text-white">Verificado</div>
                </div>
            </div>
        ) : (
            <p className="text-white/40">Erro ao carregar dados.</p>
        )}
      </div>
    </div>
  );
}
