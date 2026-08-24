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
          <div className="bg-[#030303] border border-white/5 p-10 space-y-10 relative">
            <div className="absolute top-0 right-0 w-1 h-1 bg-primary" />
            
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 flex items-center justify-center border border-primary/20 bg-primary/5 text-primary">
                <Music className="w-6 h-6 opacity-50" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-base text-white uppercase tracking-tighter">SPOTIFY_GEN_PROTOCOL</h3>
                <p className="font-mono text-[8px] text-white/20 uppercase tracking-[0.4em]">SOURCE_LINK_GENERATOR</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="font-mono text-[8px] uppercase tracking-[0.5em] text-white/20 px-1 block">LINK_QUANTITY</label>
                <Input 
                  type="number" 
                  min={1} 
                  max={100} 
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="bg-transparent border-white/10 font-mono text-xs focus:border-primary/50 transition-all rounded-none h-12"
                />
                <p className="font-mono text-[7px] text-white/10 uppercase tracking-[0.3em] pl-1">MAX_BATCH: 100_UNITS</p>
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
                    START_GENERATION
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-[#030303] border border-white/5 p-8 space-y-8">
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
                      <div className={cn("w-1.5 h-1.5 rounded-full", (stock || 0) > 0 ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-primary shadow-[0_0_8px_#4DA09E]")} />
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
           <Card className="p-8 border-white/5 bg-white/[0.02] flex flex-col h-full min-h-[500px]">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#4DA09E]" />
                    <h3 className="font-display text-sm text-white uppercase italic tracking-widest">Output de Resultados</h3>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={handleCopy} 
                      disabled={links.length === 0}
                      className="!text-[9px] !py-2 !h-auto flex items-center gap-2"
                    >
                       <Copy className="w-3 h-3" /> Copiar
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={handleDownload} 
                      disabled={links.length === 0}
                      className="!text-[9px] !py-2 !h-auto flex items-center gap-2"
                    >
                       <Download className="w-3 h-3" /> Baixar .TXT
                    </Button>
                 </div>
              </div>

              <div className="flex-1 bg-black/40 border border-white/5 p-6 font-mono text-[11px] text-white/60 overflow-y-auto custom-scrollbar relative">
                 <AnimatePresence mode="wait">
                   {links.length > 0 ? (
                     <motion.div 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       className="space-y-2"
                     >
                       {links.map((link, i) => (
                         <div key={i} className="py-1 border-b border-white/[0.02] break-all hover:text-white transition-colors">
                           {link}
                         </div>
                       ))}
                     </motion.div>
                   ) : (
                     <motion.div 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className="h-full flex flex-col items-center justify-center gap-4 text-white/10"
                     >
                        <div className="w-16 h-16 border border-white/5 flex items-center justify-center opacity-20">
                           <Music className="w-8 h-8" />
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.3em] italic">Aguardando geração...</span>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>

              {links.length > 0 && (
                <div className="mt-6 flex items-center justify-between text-[9px] uppercase tracking-widest text-white/30 italic">
                   <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                      {links.length} Protocolos Gerados
                   </div>
                   <span>Terminal Ativo</span>
                </div>
              )}
           </Card>
        </div>
      </div>
    </div>
  );
}
