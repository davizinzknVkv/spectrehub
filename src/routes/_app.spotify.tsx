import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Music, Copy, Download, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, Button, Input } from "@/components/ui/ds";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { useQuestStore } from "@/lib/quest-store";
import { generateSpotifyLinks } from "@/lib/spotify.functions";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/_app/spotify")({
  head: () => ({ meta: [{ title: "Spotify Gen — SPECTRE" }] }),
  component: SpotifyGenPage,
});

function SpotifyGenPage() {
  const [quantity, setQuantity] = useState(10);
  const [utmSource, setUtmSource] = useState("spectre");
  const [utmMedium, setUtmMedium] = useState("discord");
  const [utmCampaign, setUtmCampaign] = useState("spotify");
  const [links, setLinks] = useState<string[]>([]);
  const [stock, setStock] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const genFn = useServerFn(generateSpotifyLinks);
  const plan = useQuestStore((s) => s.plan);
  

  useEffect(() => {
    const fetchStock = async () => {
      const { data } = await supabase
        .from("spotify_links")
        .select("stock")
        .eq("active", true);
      
      if (data) {
        const total = data.reduce((acc, curr) => acc + (curr.stock || 0), 0);
        setStock(total);
      }
    };
    fetchStock();
    const sub = supabase
      .channel("spotify_stock")
      .on("postgres_changes", { event: "*", schema: "public", table: "spotify_links" }, () => fetchStock())
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, []);

  const handleGenerate = async () => {
    if (plan !== "premium" && plan !== "lifetime" && plan !== "beta") {
      toast.error("Acesso negado: Plano Premium ou Lifetime requerido.");
      return;
    }

    if (quantity < 1 || quantity > 100) {
      toast.error("Quantidade inválida (1-100)");
      return;
    }

    setLoading(true);
    try {
      const res = await genFn({
        data: {
          quantity,
          utmSource,
          utmMedium,
          utmCampaign,
        },
      });

      if (res.ok) {
        setLinks(res.links);
        toast.success("Links gerados com sucesso!");
      }
    } catch (err) {
      toast.error("Falha ao gerar links.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (links.length === 0) return;
    navigator.clipboard.writeText(links.join("\n"));
    toast.success("✓ Links copiados");
  };

  const handleDownload = () => {
    if (links.length === 0) return;
    const blob = new Blob([links.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spotify_links.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-stack">
      <PageHeader 
        title="SPOTIFY GEN" 
        description="Gerador de links de campanha para Spotify."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0d0f14] border border-white/5 p-10 space-y-10 relative">
            <div className="absolute top-0 right-0 w-1 h-1 bg-primary" />
            
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 flex items-center justify-center border border-primary/20 bg-primary/5 text-primary">
                <Music className="w-6 h-6 opacity-50" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-base text-white uppercase tracking-tighter">PROTOCOLO SPOTIFY GEN</h3>
                <p className="font-mono text-[8px] text-white/20 uppercase tracking-[0.4em]">GERADOR DE LINKS</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="font-mono text-[8px] uppercase tracking-[0.5em] text-white/20 px-1 block">QUANTIDADE DE LINKS</label>
                <Input 
                  type="number" 
                  min={1} 
                  max={100} 
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="bg-transparent border-white/10 font-mono text-xs focus:border-primary/50 transition-all rounded-none h-12"
                />
                <p className="font-mono text-[7px] text-white/10 uppercase tracking-[0.3em] pl-1">LOTE MÁXIMO: 100 UNIDADES</p>
              </div>

              <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="font-mono text-[8px] uppercase tracking-[0.5em] text-white/20 px-1 block">UTM_SOURCE</label>
                    <Input 
                      placeholder="IDENTIFIER" 
                      value={utmSource} 
                      onChange={(e) => setUtmSource(e.target.value)}
                      className="bg-transparent border-white/10 font-mono text-xs focus:border-primary/50 transition-all rounded-none h-12"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="font-mono text-[8px] uppercase tracking-[0.5em] text-white/20 px-1 block">UTM_MEDIUM</label>
                    <Input 
                      placeholder="CHANNEL" 
                      value={utmMedium} 
                      onChange={(e) => setUtmMedium(e.target.value)}
                      className="bg-transparent border-white/10 font-mono text-xs focus:border-primary/50 transition-all rounded-none h-12"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="font-mono text-[8px] uppercase tracking-[0.5em] text-white/20 px-1 block">UTM_CAMPAIGN</label>
                    <Input 
                      placeholder="TRACKING_TAG" 
                      value={utmCampaign} 
                      onChange={(e) => setUtmCampaign(e.target.value)}
                      className="bg-transparent border-white/10 font-mono text-xs focus:border-primary/50 transition-all rounded-none h-12"
                    />
                 </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="ds-btn ds-btn-primary w-full h-14 flex items-center justify-center gap-4 disabled:opacity-50 !text-[10px] uppercase tracking-[0.3em]"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    INITIALIZING_DATA...
                  </>
                ) : (
                  <>
                    <Music className="w-4 h-4" />
                    INICIAR GERAÇÃO
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-[#0d0f14] border border-white/5 p-8 space-y-8">
             <div className="flex flex-col gap-6">
               <div className="flex items-center gap-3 text-white/20">
                  <AlertCircle className="w-4 h-4" />
                  <h4 className="font-mono text-[8px] uppercase tracking-[0.5em]">LEGAL_DISCLAIMER_NOTICE</h4>
               </div>
               <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.1em] leading-relaxed">
                  Esta ferramenta gera links legítimos de redirecionamento do Spotify com parâmetros UTM para rastreamento de campanhas. Não gera contas premium ou vouchers.
               </p>
               <div className="pt-8 border-t border-white/5 space-y-6">
                 <div className="flex items-center justify-between">
                    <p className="font-mono text-[8px] text-white/40 uppercase tracking-[0.4em]">CURRENT_STOCK_STATE</p>
                    <div className="flex items-center gap-3">
                      <div className={cn("w-1.5 h-1.5 rounded-full", (stock || 0) > 0 ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-primary shadow-[0_0_8px_#005194]")} />
                      <span className="font-mono text-xs text-white">{stock !== null ? stock : "---"}</span>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <p className="font-mono text-[8px] text-primary uppercase tracking-[0.4em]">ACCESS_REQUIREMENTS</p>
                    <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.1em] leading-relaxed">
                      O acesso ao Spotify Gen está disponível apenas para membros PREMIUM e LIFETIME. Planos Free e Booster estão desativados.
                    </p>
                 </div>
               </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
           <div className="bg-[#0d0f14] border border-white/5 p-10 flex flex-col h-full min-h-[600px] relative">
              <div className="absolute top-0 left-0 w-1 h-1 bg-white/20" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
                 <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#005194]" />
                    <h3 className="font-display text-base text-white uppercase tracking-tighter">RESULTADOS DO TERMINAL</h3>
                 </div>
                 
                 <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button 
                      onClick={handleCopy} 
                      disabled={links.length === 0}
                      className="h-10 px-6 border border-white/10 text-[9px] font-mono uppercase tracking-[0.2em] flex items-center gap-3 hover:border-primary/40 hover:text-primary transition-all disabled:opacity-20"
                    >
                       <Copy className="w-3 h-3" /> COPIAR TUDO
                    </button>
                    <button 
                      onClick={handleDownload} 
                      disabled={links.length === 0}
                      className="h-10 px-6 border border-white/10 text-[9px] font-mono uppercase tracking-[0.2em] flex items-center gap-3 hover:border-primary/40 hover:text-primary transition-all disabled:opacity-20"
                    >
                       <Download className="w-3 h-3" /> EXPORTAR TXT
                    </button>
                 </div>
              </div>

              <div className="flex-1 bg-black/20 border border-white/5 p-8 font-mono text-[10px] text-white/40 overflow-y-auto custom-scrollbar relative">
                 <AnimatePresence mode="wait">
                   {links.length > 0 ? (
                     <motion.div 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       className="space-y-3"
                     >
                       {links.map((link, i) => (
                         <div key={i} className="py-2 border-b border-white/5 break-all hover:text-white transition-colors uppercase tracking-[0.1em]">
                           {link}
                         </div>
                       ))}
                     </motion.div>
                   ) : (
                     <motion.div 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className="h-full flex flex-col items-center justify-center gap-6 text-white/5"
                     >
                        <div className="w-20 h-20 border border-white/5 flex items-center justify-center">
                           <Music className="w-10 h-10 opacity-10" />
                        </div>
                        <span className="font-mono text-[9px] uppercase tracking-[0.5em]">SYSTEM_WAITING_FOR_INPUT...</span>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>

              {links.length > 0 && (
                <div className="mt-8 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.3em] text-white/10">
                   <div className="flex items-center gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                      {links.length} DATA_PACKETS_READY
                   </div>
                   <span className="text-primary/40">PROTOCOL_ACTIVE</span>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
