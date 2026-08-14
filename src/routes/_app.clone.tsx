import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Copy, Server, ArrowRight, CheckCircle2, AlertCircle, ChevronDown, Search } from "lucide-react";
import { useQuestStore } from "@/lib/quest-store";
import { PageHeader } from "@/components/PageHeader";
import { Button, Card, Badge } from "@/components/ui/ds";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { cloneServer, getGuilds } from "@/lib/cloner.functions";
import * as Popover from "@radix-ui/react-popover";

export const Route = createFileRoute("/_app/clone")({
  head: () => ({ meta: [{ title: "Discord Tools — Spectre Hub" }] }),
  component: ClonePage,
});

function ClonePage() {
  const creds = useQuestStore((s) => s.creds);
  const [originId, setOriginId] = useState("");
  const [destId, setDestId] = useState("");
  const [guilds, setGuilds] = useState<any[]>([]);
  const [loadingGuilds, setLoadingGuilds] = useState(false);
  const [loading, setLoading] = useState(false);
  const runClone = useServerFn(cloneServer);
  const fetchGuilds = useServerFn(getGuilds);

  useEffect(() => {
    if (creds?.token) {
      loadGuilds();
    }
  }, [creds?.token]);

  const loadGuilds = async () => {
    if (!creds?.token) return;
    setLoadingGuilds(true);
    try {
      const res = await fetchGuilds({ data: { token: creds.token } });
      if (res.ok) {
        setGuilds(res.guilds || []);
      }
    } catch (err) {
      console.error("Failed to load guilds", err);
    } finally {
      setLoadingGuilds(false);
    }
  };

  const handleClone = async () => {
    if (!creds?.token) {
      toast.error("Conecte seu token primeiro.");
      return;
    }
    if (!originId || !destId) {
      toast.error("Informe os IDs dos servidores.");
      return;
    }

    setLoading(true);
    toast.info("Iniciando clonagem... Isso pode levar alguns minutos.");

    try {
      const res = await runClone({
        data: {
          token: creds.token,
          originGuildId: originId,
          destGuildId: destId,
        },
      });

      if (res.ok) {
        toast.success("Servidor clonado com sucesso!");
        setOriginId("");
        setDestId("");
      } else {
        toast.error(res.error || "Erro ao clonar servidor.");
      }
    } catch (err) {
      toast.error("Erro na comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <PageHeader 
        title="Discord Tools" 
        description="Ferramentas avançadas de gestão e automação"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 border-white/5 bg-white/[0.02] space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center border border-spectre-pink/20 bg-spectre-pink/5 text-spectre-pink">
                <Copy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg text-white uppercase italic tracking-widest">Servidor Cloner</h3>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Protocolo de replicação estrutural</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              <div className="space-y-4">
                <label className="font-display text-[9px] uppercase tracking-widest text-white/40 italic block px-1">Servidor Origem (Fonte)</label>
                <GuildSelector 
                  value={originId} 
                  onChange={setOriginId} 
                  guilds={guilds} 
                  loading={loadingGuilds}
                  placeholder="Selecione o servidor de origem..."
                />
              </div>

              <div className="hidden md:flex absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center bg-obsidian border border-white/10 z-10">
                <ArrowRight className="w-4 h-4 text-white/20" />
              </div>

              <div className="space-y-4">
                <label className="font-display text-[9px] uppercase tracking-widest text-white/40 italic block px-1">Servidor Destino (Alvo)</label>
                <GuildSelector 
                  value={destId} 
                  onChange={setDestId} 
                  guilds={guilds} 
                  loading={loadingGuilds}
                  placeholder="Selecione o servidor de destino..."
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                onClick={handleClone}
                disabled={loading || !originId || !destId}
                className="ds-btn ds-btn-primary w-full py-4 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white animate-spin" />
                    Processando Clonagem...
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Iniciar Protocolo de Clonagem
                  </>
                )}
              </button>
            </div>
          </Card>

          <section className="ds-card p-6 border-white/5 bg-white/[0.02]">
             <div className="flex items-center gap-2 mb-4 text-spectre-pink">
                <AlertCircle className="w-4 h-4" />
                <h4 className="font-display text-[9px] uppercase tracking-widest italic font-bold">Importante</h4>
             </div>
             <ul className="space-y-3 text-[10px] text-white/40 uppercase tracking-[0.15em] font-sans italic leading-relaxed">
                <li>• O Bot/Token deve ter permissão de "Gerenciar Servidor" apenas no servidor que vai receber.</li>
                <li>• Serão copiados: Cargos, Categorias, Canais de Texto e Voz.</li>
                <li>• Mensagens e membros não são transferidos por este protocolo.</li>
                <li>• O processo pode levar tempo dependendo da complexidade do servidor.</li>
             </ul>
          </section>
        </div>

        <aside className="space-y-6">
          <Card className="p-6 border-white/5 bg-white/[0.02] space-y-6">
            <h4 className="font-display text-[10px] uppercase tracking-widest text-white italic">Status do Sistema</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-[9px] uppercase text-white/30">Motor REST</span>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px]">ONLINE</Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-[9px] uppercase text-white/30">Auto-Delay</span>
                <span className="font-mono text-[9px] text-white">ATIVO</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-[9px] uppercase text-white/30">Bypass Antiflood</span>
                <span className="font-mono text-[9px] text-white">ESTÁVEL</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-white/5 bg-white/[0.02] space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-spectre-pink" />
              <h4 className="font-display text-[10px] uppercase tracking-widest text-white italic">Recursos Ativos</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 bg-spectre-pink rounded-full" />
                <span className="text-[9px] uppercase text-white/60 tracking-wider">Cópia de Cargos</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 bg-spectre-pink rounded-full" />
                <span className="text-[9px] uppercase text-white/60 tracking-wider">Estrutura de Categorias</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 bg-spectre-pink rounded-full" />
                <span className="text-[9px] uppercase text-white/60 tracking-wider">Permissões Específicas</span>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
